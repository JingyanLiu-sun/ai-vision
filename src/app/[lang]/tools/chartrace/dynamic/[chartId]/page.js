import React from "react";
import { dynamicChartConfigs } from '../../dynamicChartConfigs';
import CommonComments from "@/app/components/GiscusComments";
import DynamicChart from './content';
import path from 'path';
import fs from 'fs/promises';
import { getDictionary } from "@/app/dictionaries";
import { PageMeta } from "@/app/components/Meta";

export const dynamic = 'force-dynamic';
// Avoid using PapaParse in SSR, implement a minimal CSV parser

export async function generateStaticParams() {
  return dynamicChartConfigs.flatMap((config) => 
    ['en', 'zh'].map((lang) => ({
      lang,
      chartId: config.id,
    }))
  );
}

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];
  const headers = lines[0].split(',').map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const cols = line.split(',');
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = (cols[i] ?? '').trim();
    });
    return obj;
  });
  return { headers, rows };
}

async function fetchChartData(dataFile, config) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'racechart', dataFile);
    const content = await fs.readFile(filePath, 'utf8');
    let parsedData;

    if (dataFile.endsWith('.json')) {
      parsedData = JSON.parse(content);
    } else if (dataFile.endsWith('.csv')) {
      const { headers, rows } = parseCSV(content);
      parsedData = { headers, rows };
    } else {
      throw new Error("Unsupported file format");
    }

    
    if (dataFile.endsWith('.json')) {
      if (Array.isArray(parsedData) && parsedData.length > 1) {
        return parsedData;
      }
      throw new Error("Invalid JSON data format");
    }

    // CSV path
    if (!parsedData || !parsedData.headers || !parsedData.rows || parsedData.rows.length === 0) {
      throw new Error("Invalid CSV data format");
    }
    const headers = parsedData.headers;
    const timeIndex = headers.indexOf(config.columns.time);
    const valueIndex = headers.indexOf(config.columns.value);
    if (timeIndex === -1 || valueIndex === -1) {
      throw new Error("Missing required columns in CSV");
    }
    const processedData = parsedData.rows.map((rowObj) => {
      return headers.map((header, index) => {
        const v = rowObj[header];
        if (index === timeIndex || index === valueIndex) {
          const num = Number(v);
          return Number.isNaN(num) ? 0 : num;
        }
        return v;
      });
    });
    return [headers, ...processedData];
  } catch (error) {
    console.error("Error loading data:", error);
    return null;
  }
}

export async function generateMetadata(props) {
  const params = await props.params;

  const {
    chartId,
    lang
  } = params;

  const dict = await getDictionary(lang);
  const chartConfig = dynamicChartConfigs.find((c) => c.id === chartId);

  if (chartConfig) {
    return PageMeta({
      title: dict.seo.chartrace[chartId]?.title || chartConfig.title,
      description: dict.seo.chartrace[chartId]?.description || chartConfig.description,
      keywords: dict.seo.chartrace[chartId]?.keywords || chartConfig.keywords,
      canonicalUrl: `https://gallery.selfboot.cn/${lang}/tools/chartrace/dynamic/${chartId}`,
      publishedDate: chartConfig.publishedDate || "2024-10-01T02:00:00.000Z",
      updatedDate: chartConfig.updatedDate || "2024-10-03T09:00:00.000Z",
    });
  }
}

export default async function DynamicChartPage(props) {
  const params = await props.params;
  const { chartId, lang } = params;
  const config = dynamicChartConfigs.find((c) => c.id === chartId);
  const dict = await getDictionary(lang);

  if (!config) {
    return <div className="text-center py-10">{dict.loading}</div>;
  }

  const chartData = await fetchChartData(config.dataFile, config);

  // console.log("chartData", chartData);
  if (!chartData) {
    return <div className="text-center py-10">{dict.loading}</div>;
  }

  return (
    <div>
      <DynamicChart config={config} initialData={chartData} />
      <CommonComments lang={lang} />
    </div>
  );
}

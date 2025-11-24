"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { CustomListbox } from "@/app/components/ListBox";
import { useI18n } from "@/app/i18n/client";
import { trackEvent, EVENTS, CATEGORIES } from '@/app/utils/analytics';

const DISK_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#FFD700",
  "#FF69B4",
  "#20B2AA",
  "#8A2BE2",
  "#00FA9A",
  "#FF4500",
  "#1E90FF",
  "#FF1493",
  "#32CD32",
  "#FF8C00",
  "#4169E1",
];

const DISK_HEIGHT = 20;
const MAX_DISKS = 30;

const HanoiTower = () => {
  const [disks, setDisks] = useState(6);
  const [speed, setSpeed] = useState(500);
  const [towers, setTowers] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalMoves, setTotalMoves] = useState(0);
  const [mode, setMode] = useState("manual");
  const [message, setMessage] = useState("");
  const [hintMove, setHintMove] = useState(null);
  const [selectedTower, setSelectedTower] = useState(null);
  const { t } = useI18n();
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [showLoadNotification, setShowLoadNotification] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const resetTowers = useCallback(() => {
    setTowers([Array.from({ length: disks }, (_, i) => disks - i), [], []]);
    setIsPlaying(false);
    setTotalMoves(0);
    setMessage("");
    setHintMove(null);
  }, [disks]);

  // 从 localStorage 加载保存的进度
  useEffect(() => {
    // 检查是否在测试环境中
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
      // 测试环境中不加载保存的进度
      resetTowers();
      setIsInitialLoad(false);
      return;
    }
    
    try {
      const savedProgress = localStorage.getItem('hanoiTowerProgress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        
        // 恢复游戏状态
        if (progress.towers && Array.isArray(progress.towers) && progress.towers.length > 0) {
          setTowers(progress.towers);
          setDisks(progress.disks || 6);
          setTotalMoves(progress.totalMoves || 0);
          setMode(progress.mode || "manual");
          setIsPlaying(false);
          setHasSavedProgress(true);
          setShowLoadNotification(true);
          setIsInitialLoad(false);
          
          // 3秒后隐藏加载提示
          const timer = setTimeout(() => {
            setShowLoadNotification(false);
          }, 3000);
          
          return () => clearTimeout(timer);
        }
      }
    } catch (error) {
      console.error('Failed to load saved progress:', error);
    }
    
    // 如果没有保存的进度，初始化默认状态
    resetTowers();
    setIsInitialLoad(false);
  }, [resetTowers]);

  // 自动保存进度到 localStorage
  useEffect(() => {
    // 只在 towers 被初始化后才保存
    if (towers.length > 0 && !isInitialLoad) {
      try {
        const progress = {
          disks: disks,
          towers: towers,
          totalMoves: totalMoves,
          mode: mode,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('hanoiTowerProgress', JSON.stringify(progress));
        setHasSavedProgress(true);
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }
  }, [disks, towers, totalMoves, mode, isInitialLoad]);

  const handleClearProgress = useCallback(() => {
    try {
      localStorage.removeItem('hanoiTowerProgress');
      setHasSavedProgress(false);
      setShowLoadNotification(false);
      resetTowers();
    } catch (error) {
      console.error('Failed to clear progress:', error);
    }
  }, [resetTowers]);

  // 当 disks 改变时重置游戏
  useEffect(() => {
    // 只有在不是初始加载且 hasSavedProgress 为 false 时才重置
    // 这确保加载保存的进度时不会触发重置
    if (!isInitialLoad && !hasSavedProgress) {
      resetTowers();
    }
  }, [disks, resetTowers, hasSavedProgress, isInitialLoad]);

  const findNextMove = useCallback((h, t, conf) => {
    if (h > 0) {
      const f = conf[h - 1];
      if (f !== t) {
        const r = 3 - f - t;
        const move = findNextMove(h - 1, r, conf);
        if (move) return move;
        return { disk: h - 1, from: f, to: t };
      }
      return findNextMove(h - 1, t, conf);
    }
    return null;
  }, []);

  const towersToConf = useCallback(
    (towers) => {
      const conf = new Array(disks).fill(0);
      towers.forEach((tower, tIndex) => {
        tower.forEach((disk) => {
          conf[disk - 1] = tIndex;
        });
      });
      return conf;
    },
    [disks]
  );

  const getHint = useCallback(() => {
    const conf = towersToConf(towers);
    const move = findNextMove(disks, 2, conf);
    if (move) {
      setHintMove(move);
      setMessage(
        t("hintMessage", { from: String.fromCharCode(65 + move.from), to: String.fromCharCode(65 + move.to) })
      );
    } else {
      setHintMove(null);
      setMessage(t("noHintAvailable"));
    }
  }, [towers, disks, findNextMove, towersToConf, t]);

  const startVisualization = useCallback(() => {
    setIsPlaying(true);
    setMode("auto");
    setMessage("");
  }, []);

  const handleModeChange = useCallback((newMode) => {
    setMode(newMode);
    if (newMode === "manual") {
      setIsPlaying(false);
    } else {
      // When switching to auto, prepare for visualization but don't start immediately
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    if (mode === "auto" && isPlaying) {
      const timer = setTimeout(() => {
        // 使用函数式更新避免依赖towers状态
        setTowers((prevTowers) => {
          const conf = towersToConf(prevTowers);
          const move = findNextMove(disks, 2, conf);
          if (move) {
            const newTowers = prevTowers.map((tower) => [...tower]);
            const disk = newTowers[move.from].pop();
            newTowers[move.to].push(disk);
            setTotalMoves((prev) => prev + 1);
            setMessage("");
            return newTowers;
          } else {
            setIsPlaying(false);
            setMessage(t("gameCompleted"));
            trackEvent(CATEGORIES.HanoiTower, EVENTS.HanoiTower.Success, {
              disks: disks,
              mode: "auto",
            });
            return prevTowers; // 没有移动时返回原状态
          }
        });
      }, speed);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isPlaying, speed, disks, mode, findNextMove, towersToConf, t]);

  const handleDragStart = (e, fromTower, diskIndex) => {
    if (mode !== "manual") return;
    if (diskIndex !== towers[fromTower].length - 1) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", JSON.stringify({ fromTower, diskSize: towers[fromTower][diskIndex] }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, toTower) => {
    e.preventDefault();
    if (mode !== "manual") return;

    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const { fromTower, diskSize } = data;

    if (fromTower === toTower) return;

    const targetTower = towers[toTower];
    if (targetTower.length === 0 || diskSize < targetTower[targetTower.length - 1]) {
      setTowers((prev) => {
        const newTowers = prev.map((tower) => [...tower]);
        const disk = newTowers[fromTower].pop();
        newTowers[toTower].push(disk);
        return newTowers;
      });
      setTotalMoves((prev) => prev + 1);

      if (totalMoves === 50) {
        trackEvent(CATEGORIES.HanoiTower, EVENTS.HanoiTower.Move50, {
          disks: disks,
        });
      }

      setMessage(t("moveSuccess"));
      setHintMove(null);

      // Check if the game is completed
      if (towers[2].length === disks - 1 && toTower === 2) {
        setTimeout(() => {
          trackEvent(CATEGORIES.HanoiTower, EVENTS.HanoiTower.Success, {
            moves: totalMoves + 1, // 使用更新后的移动次数
            disks: disks,
            mode: "manual",
          });
          setMessage(t("gameCompleted"));
        }, 100);
      }
    } else {
      trackEvent(CATEGORIES.HanoiTower, EVENTS.HanoiTower.Fail, {
        moves: totalMoves,
        disks: disks,
      });
      setMessage(t("moveFailure"));
    }
  };

  const handleTowerClick = (towerIndex) => {
    if (mode !== "manual") return;

    if (selectedTower === null) {
      if (towers[towerIndex].length > 0) {
        setSelectedTower(towerIndex);
      }
    } else {
      const fromTower = selectedTower;
      const toTower = towerIndex;
      const diskSize = towers[fromTower][towers[fromTower].length - 1];

      if (fromTower !== toTower) {
        if (towers[toTower].length === 0 || diskSize < towers[toTower][towers[toTower].length - 1]) {
          setTowers((prev) => {
            const newTowers = prev.map((tower) => [...tower]);
            const disk = newTowers[fromTower].pop();
            newTowers[toTower].push(disk);
            return newTowers;
          });
          setTotalMoves((prev) => prev + 1);
          setMessage(t("moveSuccess"));
          setHintMove(null);

          if (towers[2].length === disks - 1 && toTower === 2) {
            setTimeout(() => {
              setMessage(t("gameCompleted"));
              trackEvent(CATEGORIES.HanoiTower, EVENTS.HanoiTower.Success, {
                moves: totalMoves + 1, // 使用更新后的移动次数
                disks: disks,
                mode: "manual",
              });
            }, 100);
          }
        } else {
          trackEvent(CATEGORIES.HanoiTower, EVENTS.HanoiTower.Fail, {
            moves: totalMoves,
            disks: disks,
          });
          setMessage(t("moveFailure"));
        }
      }
      setSelectedTower(null);
    }
  };

  const Tower = React.memo(({ disks, index, totalDisks }) => {
    const MIN_TOWER_HEIGHT = 400;
    const calculatedHeight = (totalDisks * DISK_HEIGHT) + 40;
    const [towerHeight, setTowerHeight] = useState(Math.max(MIN_TOWER_HEIGHT, calculatedHeight));
    
    useEffect(() => {
      const updateHeight = () => {
        const isMobile = window.innerWidth < 768;
        const newHeight = isMobile ? calculatedHeight : Math.max(MIN_TOWER_HEIGHT, calculatedHeight);
        setTowerHeight(newHeight);
      };
      
      updateHeight();
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }, [totalDisks, calculatedHeight]);
    
    return (
      <div
        data-testid={`tower-${index}`}
        className="relative flex flex-col items-center justify-end w-full md:w-1/3 mb-4 md:mb-0 ml-2"
        style={{ height: `${towerHeight}px` }}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, index)}
        onClick={() => handleTowerClick(index)}
      >
        <div className="absolute bottom-0 w-full h-2 bg-gray-400" />
        <div className="absolute bottom-2 w-2 bg-gray-400" style={{ height: `${towerHeight - 8}px` }} />
        {disks.map((disk, diskIndex) => (
          <div
            key={diskIndex}
            data-testid="hanoi-disk"  // For testing
            className={`absolute transition-all duration-500 ease-in-out rounded-md ${
              mode === "manual" ? "cursor-move" : ""
            } ${
              selectedTower === index && diskIndex === disks.length - 1
                ? "ring-2 ring-blue-500 ring-offset-2"
                : ""
            }`}
            style={{
              width: `${(disk / totalDisks) * 90}%`,
              height: `${DISK_HEIGHT}px`,
              backgroundColor: DISK_COLORS[disk % DISK_COLORS.length],
              bottom: `${diskIndex * DISK_HEIGHT + 8}px`,
              border:
                hintMove && hintMove.from === index && diskIndex === disks.length - 1
                  ? "2px solid yellow"
                  : "none",
            }}
            draggable={mode === "manual"}
            onDragStart={(e) => handleDragStart(e, index, diskIndex)}
          >
            <div 
              className="absolute inset-0 flex items-center justify-center font-bold text-white text-shadow"
              style={{
                fontSize: `${Math.max(12, Math.min(16, DISK_HEIGHT * 0.6))}px`,
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}
            >
              {disk}
            </div>
          </div>
        ))}
        <div className="absolute bottom-[-24px] text-center w-full">{String.fromCharCode(65 + index)}</div>
      </div>
    );
  });
  Tower.displayName = "Tower";

  const Controls = React.memo(() => {
    const diskOptions = useMemo(() => Array.from({ length: MAX_DISKS - 1 }, (_, i) => i + 2), []);

    const minMoves = 2 ** disks - 1;
    return (
      <div className="w-full md:w-1/5 p-4 flex flex-col space-y-4">
        <h2 className="text-2xl font-bold">{t("settings")}</h2>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">{t("numberOfDisks")}</label>
          <CustomListbox
            value={disks}
            onChange={(newValue) => {
              trackEvent(CATEGORIES.HanoiTower, EVENTS.HanoiTower.DiskChanged, {
                from: disks,
                to: newValue
              });
              try {
                localStorage.removeItem('hanoiTowerProgress');
              } catch {}
              setHasSavedProgress(false);
              setIsPlaying(false);
              setMode("manual");
              setDisks(newValue);
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }}
            options={diskOptions}
            disabled={isPlaying}
          />
        </div>
        <div className="opacity-100">
          <label className="block text-sm font-medium text-gray-700">{t("speed")}</label>
          <input
            type="range"
            min="1"
            max="1000"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full"
            disabled={mode === "manual"}
          />
          <span>{speed}ms</span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("mode")}</label>
          <select
            data-testid="mode-select"
            value={mode}
            onChange={(e) => {
              const newMode = e.target.value;
              trackEvent(CATEGORIES.HanoiTower, EVENTS.HanoiTower.ModeChanged, {
                from: mode,
                to: newMode
              });
              handleModeChange(newMode);
            }}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="manual">{t("manual")}</option>
            <option value="auto">{t("auto")}</option>
          </select>
        </div>
        {mode === "auto" && (
          <button
            onClick={startVisualization}
            disabled={isPlaying}
            data-testid="start-auto-button"
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {totalMoves > 0 ? t("continue") : t("start")}
          </button>
        )}
        {mode === "manual" && (
          <button
            onClick={() => {
              trackEvent(CATEGORIES.HanoiTower, EVENTS.HanoiTower.GetHint, {
                disks: disks,
                moves: totalMoves,
              });
              getHint();
            }}
            className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
          >
            {t("getHint")}
          </button>
        )}
        <button
          onClick={resetTowers}
          className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
        >
          {t("reset")}
        </button>
        {hasSavedProgress && (
          <button
            onClick={handleClearProgress}
            className="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline"
          >
            {t("clear_progress")}
          </button>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("movesCount", { total: totalMoves, minimum: minMoves })}
          </label>
        </div>
        {message && <div className="mt-4 text-yellow-700 rounded">{message}</div>}
      </div>
    );
  });
  Controls.displayName = "Controls";

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-4/5 p-4 bg-gray-100">
          <div className="flex flex-col md:flex-row justify-between h-full">
            {towers.map((tower, index) => (
              <Tower key={index} disks={tower} index={index} totalDisks={disks} />
            ))}
          </div>
        </div>
        <Controls />
      </div>

      {/* ads removed */}

      {showLoadNotification && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {t('progress_loaded')}
        </div>
      )}
    </div>
  );
};

export default HanoiTower;

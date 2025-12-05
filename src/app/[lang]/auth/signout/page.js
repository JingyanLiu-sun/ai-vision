"use client";
import { useI18n } from "@/app/i18n/client";
import { useEffect } from "react";

export default function SignOutPage(props) {
  const params = props.params || {};
  const { lang } = params;
  const { t } = useI18n();
  useEffect(() => {
    const logout = async () => {
      try {
        const res = await fetch(`/api/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callbackUrl: `/${lang}` }),
          redirect: "manual",
        });
        window.location.href = `/${lang}`;
      } catch {
        window.location.href = `/${lang}`;
      }
    };
    // 自动退出并重定向
    logout();
  }, [lang]);
  return (
    <div className="min-h-[40vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <h1 className="text-2xl font-bold mb-3 text-gray-900">{t("signout_title")}</h1>
        <p className="text-sm text-gray-600 mb-6">{t("signout_subtitle")}</p>
        <button
          onClick={() => { window.location.href = `/${lang}`; }}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition shadow-sm"
        >
          {t("signout_confirm")}
        </button>
      </div>
    </div>
  );
}

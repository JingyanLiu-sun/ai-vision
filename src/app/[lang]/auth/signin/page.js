"use client";
import { useState } from "react";
import { useI18n } from "@/app/i18n/client";

export default function SignInPage(props) {
  const params = props.params || {};
  const { lang } = params;
  const { t } = useI18n();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
    });
    if (!res.ok) {
      const msg = await res.text();
      setError(msg || "登录失败");
      return;
    }
    window.location.href = `/${lang}/algorithms`;
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <h1 className="text-2xl font-bold mb-3 text-gray-900">{t("signin_title")}</h1>
        <p className="text-sm text-gray-600 mb-6">{t("signin_phone_subtitle")}</p>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">{t("phone")}</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder={t("phone_placeholder")} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">{t("password")}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder={t("password_placeholder")} />
          </div>
          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition shadow-sm">{t("signin_submit")}</button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          <a href={`/${lang}/auth/register`} className="text-blue-600">{t("go_register")}</a>
        </div>
      </div>
    </div>
  );
}

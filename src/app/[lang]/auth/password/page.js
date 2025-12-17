"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useI18n } from "@/app/i18n/client";

export default function PasswordChangePage(props) {
  const params = useParams();
  const lang = params?.lang || "zh";
  const { t } = useI18n();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk(false);
    const res = await fetch(`/api/auth/password/change`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    if (!res.ok) {
      const msg = await res.text();
      setError(msg || "修改失败");
      return;
    }
    setOk(true);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <h1 className="text-2xl font-bold mb-3 text-gray-900">修改密码</h1>
        <p className="text-sm text-gray-600 mb-6">请输入旧密码与新密码</p>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        {ok && <p className="text-green-600 text-sm mb-3">修改成功</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">旧密码</label>
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="请输入旧密码" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">新密码</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="不少于6位" />
          </div>
          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition shadow-sm">提交</button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          <a href={`/${lang}`} className="text-blue-600">返回首页</a>
        </div>
      </div>
    </div>
  );
}

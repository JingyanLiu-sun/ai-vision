"use client";

import { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function ProfileForm({ user, lang }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    image: user?.image || "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage({ type: "success", text: "个人信息更新成功！" });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Section */}
      <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="relative">
          <Image
            src={formData.image || "/momo.jpg"}
            alt="Profile Avatar"
            width={100}
            height={100}
            className="rounded-full object-cover border-4 border-white shadow-lg"
            unoptimized
          />
          <button
            type="button"
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            title="Change Avatar"
          >
            <FontAwesomeIcon icon={faCamera} className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-medium text-gray-900">头像</h3>
          <p className="text-sm text-gray-500 mt-1">
            支持 JPG, GIF 或 PNG 格式。建议尺寸 200x200 像素。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        {/* Nickname */}
        <div className="sm:col-span-3">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            昵称
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            />
          </div>
        </div>

        {/* Phone (Read-only) */}
        <div className="sm:col-span-3">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            电话
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="phone"
              id="phone"
              value={formData.phone}
              readOnly
              className="shadow-sm bg-gray-50 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Email */}
        <div className="sm:col-span-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            邮箱
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="sm:col-span-6">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            个人简介
          </label>
          <div className="mt-1">
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
              placeholder="介绍一下你自己..."
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            简短的个人介绍，将展示在您的个人资料页。
          </p>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin -ml-1 mr-2 h-4 w-4" />
              保存中...
            </>
          ) : (
            "保存更改"
          )}
        </button>
      </div>
    </form>
  );
}

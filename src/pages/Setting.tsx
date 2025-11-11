import React from "react";
import { useNavigate } from "react-router-dom";

export default function Setting(): React.JSX.Element {
  const navigate = useNavigate();

  const navigationLinks = [
    { path: "/login", name: "🔒 로그인 페이지" },
    { path: "/onboarding", name: "👋 온보딩 페이지" },
    { path: "/main", name: "🏡 메인 페이지" },
    { path: "/data", name: "📚 자료 목록 페이지" },
    { path: "/data/upload", name: "⬆️ 자료 업로드 페이지" },
    { path: "/data/1", name: "📄 자료 상세 페이지 (ID: 1)" },
    { path: "/mypage", name: "👤 마이 페이지" },
    { path: "/loading", name: "🔄 로딩 페이지" },
  ];

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        ⚙️ Setting Page
      </h1>

      <div className="space-y-3">
        {navigationLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className="block w-full text-left p-3 bg-gray-50 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition duration-150 ease-in-out border border-gray-200"
          >
            {link.name}{" "}
            <span className="text-sm text-gray-500 ml-2">({link.path})</span>
          </button>
        ))}
      </div>
    </div>
  );
}

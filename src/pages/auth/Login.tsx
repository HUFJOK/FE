import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.svg";

export default function Login(): React.JSX.Element {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // 실제 연결 시 OAuth URL 사용
    navigate("/onboarding");
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-white">
      {/* 로고 */}
      <img
        src={Logo}
        alt="HUFS JOK 로고"
        draggable={false}
        className="w-[350px] h-[349px] aspect-[350/349] object-contain mb-[178px]"
      />

      {/* 학교 구글 로그인 버튼 */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        aria-label="학교 구글 로그인"
        className={[
          "btn",
          "h-[90px] px-[122px] rounded-2xl", 
          "text-[36px] tracking-[-0.9px] font-semibold",
          "shadow-[0_10px_24px_rgba(0,0,0,0.16)]",
          "hover:brightness-110 active:translate-y-[1px]",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-600/30",
        ].join(" ")}
      >
        학교 구글 로그인
      </button>
    </main>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import Button from "../../components/Button";

export default function Login(): React.JSX.Element {
  const navigate = useNavigate();

  //배포 후 소셜 로그인으로 변경
  const handleGoogleLogin = () => {
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
      <div className= {`w-[670px] h-[90px] flex items-center justify-center 
                      [&>div]:flex [&>div]:items-center [&>div]:justify-center [&>div]:h-full`}>
        <Button
          text="학교 구글 로그인"
          font="title-md"
          onClick={handleGoogleLogin}
          isFull
        />
      </div>
    </main>
  );
}

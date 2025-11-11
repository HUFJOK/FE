import React from "react";
import Logo from "../../assets/logo.svg";
import Button from "../../components/Button";

export default function Login(): React.JSX.Element {
  const handleGoogleLogin = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    window.location.href = `${baseUrl}/oauth2/authorization/google`;
  };

  return (
    <main className="min-h-screen w-170 py-30 m-auto flex flex-col justify-start items-center bg-white gap-25">
      <img
        src={Logo}
        alt="HUFS JOK 로고"
        draggable={false}
        className="w-[350px] h-[349px] aspect-[350/349] object-contain"
      />

      <Button
        text="학교 구글 로그인"
        font="title-md"
        onClick={handleGoogleLogin}
        isFull={true}
      />
    </main>
  );
}

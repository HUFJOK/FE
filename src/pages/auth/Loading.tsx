import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../api/users";
import { isAxiosError } from "axios"

export default function Loading(): React.JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const userData = await getUser();
        const isOnboarding = userData.onboarding;

        if (isOnboarding) {
          navigate("/main", { replace: true });
        } else {
          navigate("/onboarding", { replace: true });
        }
      } catch (error) {
        console.error("사용자 정보 확인 실패:", error);

        if (isAxiosError(error)) {
          if (error.response?.status !== 401) {
            navigate("/login", { replace: true });
          }
        } else {
          navigate("/login", { replace: true });
        }
      }
    };

    checkOnboarding();
  }, [navigate]);

  return (
    <main className="min-h-screen w-full flex justify-center items-center title-sm text-primary-600">
      <div>로그인 중입니다...</div>
    </main>
  );
}

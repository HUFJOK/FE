import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import { MajorOptions } from "../../data/OptionData";
import type { Option } from "../../data/OptionData";
import Button from "../../components/Button";
import { setOnboarding, getUser } from "../../api/users";

export default function Onboarding(): React.JSX.Element {
  const navigate = useNavigate();

  // UI 유지용 입력값
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // 실제 서버 연동 대상
  const [major, setMajor] = useState<Option | null>(null);
  const [minor, setMinor] = useState<Option | null>(null);
  const [loading, setLoading] = useState(false);

  // 사용자 정보 자동 입력
  useEffect(() => {
    const fillUserInfo = async () => {
      try {
        const user = await getUser(); // UserResponse 타입

        // 이메일, 닉네임 자동 입력
        setEmail(user.email ?? "");
        setName(user.nickname ?? "");

        // 본전공
        if (user.major) {
          const foundMajor =
            MajorOptions.find((opt) => opt.value === user.major) || null;
          setMajor(foundMajor);
        }

        // 이중전공/부전공
        if (user.minor) {
          const foundMinor =
            MajorOptions.find((opt) => opt.value === user.minor) || null;
          setMinor(foundMinor);
        }
      } catch (err) {
        console.error("온보딩용 사용자 정보 로딩 실패:", err);
      }
    };

    fillUserInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!major) {
      alert("본전공을 선택해 주세요.");
      return;
    }

    try {
      setLoading(true);

      // 서버 User 정보 업데이트
      await setOnboarding({
        major: major.value,
        minor: minor?.value ?? "",
      });

      // 완료 후 메인 페이지로 이동
      navigate("/main", { replace: true });
    } catch (err) {
      console.error("온보딩 저장 실패:", err);
      alert("온보딩 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-white">
      {/* 상단 로고 */}
      <header className="w-full">
        <img
          src={Logo}
          alt="HUFSJOK 로고"
          className="w-[100px] h-[100px] ml-[28px] mt-[24px] object-contain"
          draggable={false}
        />
      </header>

      {/* 폼 영역 */}
      <section className="w-195 max-w-[920px] mx-auto mt-[49px]">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex flex-col gap-[40px]">
            {/* 학교 이메일 */}
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="학교 이메일"
              value={email}
              readOnly
              className="
                w-full box-border px-5 py-2.5
                rounded-xl border-2 border-primary-600
                title-sm text-gray-700 placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-primary-600/20
              "
            />

            {/* 닉네임 */}
            <input
              type="text"
              autoComplete="name"
              required
              placeholder="닉네임"
              value={name}
              readOnly
              className="
                w-full box-border px-5 py-2.5
                rounded-xl border-2 border-primary-600
                title-sm text-gray-700 placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-primary-600/20
              "
            />

            {/* 본전공 */}
            <select
              value={major ? major.value : ""}
              onChange={(e) => {
                const val = e.target.value;
                const found =
                  MajorOptions.find((opt) => opt.value === val) || null;
                setMajor(found);
              }}
              required
              className={`
                w-full box-border px-5 py-2.5
                rounded-xl border-2 border-primary-600 bg-white
                title-sm ${major ? "text-gray-700" : "text-gray-400"}
                focus:outline-none focus:ring-4 focus:ring-primary-600/20
                appearance-none                
              `}
            >
              <option value="" disabled hidden>
                본전공
              </option>
              {MajorOptions.map((opt) => (
                <option key={opt.index} value={opt.value}>
                  {opt.value}
                </option>
              ))}
            </select>

            {/* 이중전공 / 부전공 */}
            <select
              value={minor ? minor.value : ""}
              onChange={(e) => {
                const val = e.target.value;
                const found =
                  MajorOptions.find((opt) => opt.value === val) || null;
                setMinor(found);
              }}
              className={`
                w-full box-border px-5 py-2.5
                rounded-xl border-2 border-primary-600 bg-white
                title-sm ${major ? "text-gray-700" : "text-gray-400"}
                focus:outline-none focus:ring-4 focus:ring-primary-600/20
                appearance-none                
              `}
            >
              <option value="" disabled hidden>
                이중전공 / 부전공
              </option>
              {MajorOptions.map((opt) => (
                <option key={opt.index} value={opt.value}>
                  {opt.value}
                </option>
              ))}
            </select>
          </div>

          {/* 완료 버튼 */}
          <div className="w-full flex justify-center mt-[100px]">
            <button type="submit" className="w-35 h-12.5" disabled={loading}>
              <Button
                text={loading ? "저장 중..." : "완료"}
                font="title-sm"
                color={600}
                isFull
              />
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

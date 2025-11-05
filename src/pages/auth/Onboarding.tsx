import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import type { Option } from "../../data/OptionData";
import { MajorOptions } from "../../data/OptionData";
import { BiChevronDown } from "react-icons/bi";

export default function Onboarding(): React.JSX.Element {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [major, setMajor] = useState<Option | null>(null);
  const [major2, setMajor2] = useState<Option | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 서버 전송 로직
    navigate("/main");
  };

  return (
    <main className="min-h-screen w-full bg-white">
      {/* 상단 좌측 로고 */}
      <header className="w-full">
        <img
          src={Logo}
          alt="HUFS JOK 로고"
          className="w-[100px] h-[100px] ml-[28px] mt-[24px] object-contain"
          draggable={false}
        />
      </header>

      {/* 폼 영역 */}
      <section className="max-w-[920px] mx-auto mt-[49px] px-4">
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
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full box-border h-[53px] px-[19px] py-[9px]
                rounded-[12px] border-2 border-primary-600
                font-[Pretendard] font-semibold text-[24px] leading-[140%] tracking-[-0.6px]
                text-gray-700 placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-primary-600/20
              "
            />

            {/* 이름 */}
            <input
              type="text"
              autoComplete="name"
              required
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full box-border h-[53px] px-[19px] py-[9px]
                rounded-[12px] border-2 border-primary-600
                font-[Pretendard] font-semibold text-[24px] leading-[140%] tracking-[-0.6px]
                text-gray-700 placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-primary-600/20
              "
            />

            {/* 본전공 */}
            <div className="relative">
              <select
                value={major?.index ?? ""}
                onChange={(e) => {
                  const idx = Number(e.target.value);
                  const found = MajorOptions.find((m) => m.index === idx) || null;
                  setMajor(found);
                }}
                className={`
                  appearance-none w-full box-border h-[53px] px-[19px] py-[9px]
                  rounded-[12px] border-2 border-primary-600 bg-white
                  font-[Pretendard] font-semibold text-[24px] leading-[140%] tracking-[-0.6px]
                  focus:outline-none focus:ring-4 focus:ring-primary-600/20
                  ${major ? "text-gray-700" : "text-gray-400"}
                `}
              >
                <option value="" disabled hidden>
                  본전공
                </option>
                {MajorOptions.map((opt) => (
                  <option key={opt.index} value={opt.index}>
                    {opt.value}
                  </option>
                ))}
              </select>
              <BiChevronDown
                className="pointer-events-none absolute right-[16px] top-1/2 -translate-y-1/2"
                size={24}
                color="#5F372F"
                aria-hidden
              />
            </div>

            {/* 이중/부전공 */}
            <div className="relative">
              <select
                value={major2?.index ?? ""}
                onChange={(e) => {
                  const idx = Number(e.target.value);
                  const found = MajorOptions.find((m) => m.index === idx) || null;
                  setMajor2(found);
                }}
                className={`
                  appearance-none w-full box-border h-[53px] px-[19px] py-[9px]
                  rounded-[12px] border-2 border-primary-600 bg-white
                  font-[Pretendard] font-semibold text-[24px] leading-[140%] tracking-[-0.6px]
                  focus:outline-none focus:ring-4 focus:ring-primary-600/20
                  ${major2 ? "text-gray-700" : "text-gray-400"}
                `}
              >
                <option value="" disabled hidden>
                  이중전공 / 부전공
                </option>
                {MajorOptions.map((opt) => (
                  <option key={opt.index} value={opt.index}>
                    {opt.value}
                  </option>
                ))}
              </select>
              <BiChevronDown
                className="pointer-events-none absolute right-[16px] top-1/2 -translate-y-1/2"
                size={24}
                color="#5F372F"
                aria-hidden
              />
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="w-full flex justify-center mt-[100px]">
            <button
              type="submit"
              className="
                inline-flex items-center justify-center gap-[10px]
                box-border w-[141px] h-[51px] px-[47.5px] py-[8.5px]
                rounded-[12px] bg-primary-600 border-2 border-primary-600
                text-white font-[Pretendard] font-semibold
                text-[24px] leading-[140%] tracking-[-0.6px]
                shadow-[0_6px_8px_0_rgba(143,116,110,1)]
                transition hover:brightness-110 active:translate-y-[1px]
                focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-600/30
              "
              disabled={!email || !name || !major} /* 최소 검증 */
            >
              완료
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

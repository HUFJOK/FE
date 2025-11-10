import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import { MajorOptions } from "../../data/OptionData";
import type { Option } from "../../data/OptionData";
import Button from "../../components/Button";

export default function Onboarding(): React.JSX.Element {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [major, setMajor] = useState<Option | null>(null);
  const [major2, setMajor2] = useState<Option | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/main");
  };

  return (
    <main className="min-h-screen w-full bg-white">
      {/* 상단 로고 */}
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
            <select
              value={major ? major.index : ""}
              onChange={(e) => {
                const idx = Number(e.target.value);
                const found = MajorOptions.find((opt) => opt.index === idx);
                setMajor(found || null);
              }}
              required
              className={`
                w-full box-border h-[53px] px-[19px] py-[9px]
                rounded-[12px] border-2 border-primary-600 bg-white
                font-[Pretendard] font-semibold text-[24px] leading-[140%] tracking-[-0.6px]
                focus:outline-none focus:ring-4 focus:ring-primary-600/20
                appearance-none
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

            {/* 이중전공 / 부전공 */}
            <select
              value={major2 ? major2.index : ""}
              onChange={(e) => {
                const idx = Number(e.target.value);
                const found = MajorOptions.find((opt) => opt.index === idx);
                setMajor2(found || null);
              }}
              className={`
                w-full box-border h-[53px] px-[19px] py-[9px]
                rounded-[12px] border-2 border-primary-600 bg-white
                font-[Pretendard] font-semibold text-[24px] leading-[140%] tracking-[-0.6px]
                focus:outline-none focus:ring-4 focus:ring-primary-600/20
                appearance-none
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
          </div>

          {/* 완료 버튼 */}
          <div className="w-full flex justify-center mt-[100px]">
            <div
              className="
                w-[141px] h-[51px] flex items-center justify-center
                [&>div]:flex [&>div]:items-center [&>div]:justify-center [&>div]:h-full
              "
            >
              <Button
                text="완료"
                font="title-sm"
                color={600}
                isFull
                onClick={handleSubmit as any}
              />
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}

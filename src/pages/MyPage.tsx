import React, { useEffect, useState } from "react";
import InfoRow from "../components/MyPage/InfoRow";
import Input from "../components/Input";
import Dropdown from "../components/Dropdown";
import PointDropdown from "../components/MyPage/PointDropdown";
import { MajorData } from "../data/MajorData";

interface Option {
  index: number;
  value: string;
}

interface HistoryItem {
  id: number;
  description: string;
  date: string;
  amount: number;
}

// 임시 데이터
const sampleHistory: HistoryItem[] = [
  { id: 1, description: "족보 구매", date: "2025.10.01 00:00", amount: -200 },
  { id: 2, description: "족보 업로드", date: "2025.10.01 00:00", amount: 200 },
  { id: 3, description: "족보 구매", date: "2025.10.01 00:00", amount: -100 },
  { id: 4, description: "족보 구매", date: "2025.10.01 00:00", amount: -100 },
];

export default function MyPage(): React.JSX.Element {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>("");
  const [nameInput, setNameInput] = useState<string>("");
  const [majorOption, setMajorOption] = useState<Option | null>(null);
  const [minorOption, setMinorOption] = useState<Option | null>(null);
  const [point, setPoint] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setEmailInput("202500000@hufs.ac.kr");
    setNameInput("홍길동");
    setMajorOption(MajorData[0]);
    setMinorOption(MajorData[MajorData.length - 1]);
    setPoint(500);
    setHistory(sampleHistory);
  }, []);

  const handleEdit = () => {
    if (isEdit) {
      console.log("저장하기");
    }
    setIsEdit((prev) => !prev);
  };

  return (
    <div className="max-w-195 py-17.5 mx-auto flex flex-col justify-start items-center gap-7.5">
      <div className="w-full flex justify-between items-center">
        <h1 className="title-md text-primary-600">내 정보</h1>
        <div className="btn body-lg" onClick={handleEdit}>
          {isEdit ? "저장하기" : "변경하기"}
        </div>
      </div>
      <div className="w-full flex flex-col justify-start items-center gap-5">
        <InfoRow label="학교 이메일">
          <Input
            type="email"
            id="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            disabled={true}
          />
        </InfoRow>
        <InfoRow label="이름">
          <Input
            type="text"
            id="name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            disabled={!isEdit}
          />
        </InfoRow>
        <InfoRow label="본전공">
          <Dropdown
            options={MajorData}
            value={majorOption}
            onChange={setMajorOption}
            disabled={!isEdit}
          />
        </InfoRow>
        <InfoRow label="이중전공 / 부전공">
          <Dropdown
            options={MajorData}
            value={minorOption}
            onChange={setMinorOption}
            disabled={!isEdit}
          />
        </InfoRow>
        <InfoRow label="포인트">
          <PointDropdown point={point} history={history} />
        </InfoRow>
      </div>
    </div>
  );
}

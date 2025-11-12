import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import LabelField from "../components/LabelField";
import Input from "../components/Input";
import Dropdown from "../components/Dropdown";
import PointDropdown from "../components/MyPage/PointDropdown";
import type { Option } from "../data/OptionData";
import { MajorOptions } from "../data/OptionData";
import { getPointHistory, getUser, updateUser } from "../api/users";
import { usePointStore } from "../store/pointStore";
import type { PointResponse, UserUpdateRequest } from "../api/types";

interface HistoryItem {
  id: number;
  description: string;
  date: string;
  amount: number;
}

export default function MyPage(): React.JSX.Element {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>("");
  const [nicknameInput, setNicknameInput] = useState<string>("");
  const [majorOption, setMajorOption] = useState<Option | null>(null);
  const [minorOption, setMinorOption] = useState<Option | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { point, isPointLoading } = usePointStore();

  useEffect(() => {
    const fetchMyPage = async () => {
      try {
        setIsPageLoading(true);
        setError(null);

        const [userData, historyData] = await Promise.all([
          getUser(),
          getPointHistory(),
        ]);

        setEmailInput(userData.email);
        setNicknameInput(userData.nickname);

        const major =
          MajorOptions.find((opt) => opt.value === userData.major) || null;
        setMajorOption(major);

        let minor: Option | null;
        if (userData.minor === null) {
          minor = MajorOptions.find((opt) => opt.value === "없음") || null;
        } else {
          minor =
            MajorOptions.find((opt) => opt.value === userData.minor) || null;
        }
        setMinorOption(minor);

        const formattedHistory: HistoryItem[] = historyData.map(
          (item: PointResponse, index: number) => ({
            id: index,
            description: item.reason,
            date: item.createdAt,
            amount: item.amount,
          }),
        );
        setHistory(formattedHistory);
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchMyPage();
  }, []);

  const handleEdit = async (): Promise<void> => {
    if (isEdit) {
      if (!majorOption) {
        alert("본전공을 선택해주세요.");
        return;
      }

      setIsSaving(true);
      try {
        const updateData: UserUpdateRequest = {
          nickname: nicknameInput,
          major: majorOption.value,
          minor: !minorOption ? "없음" : minorOption.value,
        };

        const updatedUserData = await updateUser(updateData);
        setNicknameInput(updatedUserData.nickname);

        alert("정보가 성공적으로 저장되었습니다.");
        setIsEdit(false);
      } catch (err) {
        console.error("정보 저장 실패:", err);
        alert("정보 저장 중 오류가 발생했습니다.");
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsEdit(true);
    }
  };

  const isLoading = isPageLoading || isPointLoading;

  if (isLoading) {
    return (
      <main className="min-h-screen w-full flex justify-center items-center title-sm text-primary-600">
        <div>로딩 중입니다...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen w-full flex justify-center items-center title-sm text-red-500">
        <div>{error}</div>
      </main>
    );
  }

  return (
    <div className="max-w-195 py-17.5 mx-auto flex flex-col justify-start items-center gap-7.5">
      <div className="w-full flex justify-between items-center">
        <h1 className="title-md text-primary-600">내 정보</h1>
        <Button
          text={isEdit ? "저장하기" : "변경하기"}
          font="body-lg"
          onClick={handleEdit}
        />
      </div>
      <div className="w-full flex flex-col justify-start items-center gap-5">
        <LabelField label="학교 이메일">
          <Input
            type="email"
            id="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            disabled={true}
          />
        </LabelField>
        <LabelField label="닉네임">
          <Input
            type="text"
            id="nickname"
            value={nicknameInput}
            onChange={(e) => setNicknameInput(e.target.value)}
            disabled={!isEdit || isSaving}
          />
        </LabelField>
        <LabelField label="본전공">
          <Dropdown
            options={MajorOptions}
            value={majorOption}
            onChange={setMajorOption}
            disabled={!isEdit || isSaving}
          />
        </LabelField>
        <LabelField label="이중전공 / 부전공">
          <Dropdown
            options={MajorOptions}
            value={minorOption}
            onChange={setMinorOption}
            disabled={!isEdit || isSaving}
          />
        </LabelField>
        <LabelField label="포인트">
          <PointDropdown point={point} history={history} />
        </LabelField>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import LabelField from "../../components/LabelField";
import Dropdown from "../../components/Dropdown";
import Textarea from "../../components/Textarea";
import {
  YearOptions,
  SemesterOptions,
  GradeOptions,
  CategoryOptions,
} from "../../data/OptionData";
import type { Option } from "../../data/OptionData";

export default function DataUpload(): React.JSX.Element {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [year, setYear] = useState<Option | null>(null);
  const [semester, setSemester] = useState<Option | null>(null);
  const [professor, setProfessor] = useState<string>("");
  const [grade, setGrade] = useState<Option | null>(null);
  const [category, setCategory] = useState<Option | null>(null);
  const [course, setCourse] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    setYear(YearOptions[0]);
    setSemester(SemesterOptions[0]);
    setGrade(GradeOptions[0]);
    setCategory(CategoryOptions[0]);
  }, []);

  const handleFileUpload = (): void => {
    console.log("파일 업로드");
  };

  const handleComplete = (): void => {
    console.log("완료");
  };

  return (
    <div className="max-w-6xl py-7.5 mx-auto flex justify-center items-start gap-16.25">
      <div className="flex flex-col gap-6.25">
        <Button
          text="구매 족보"
          font="title-sm"
          isOutline={true}
          onClick={() => navigate("/data")}
        />
        <Button
          text="판매 족보"
          font="title-sm"
          onClick={() => navigate("/data")}
        />
      </div>

      <div className="w-235 bg-primary-100 rounded-xl p-10 flex flex-col justify-start items-center gap-7.5">
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          font="title-sm"
        />

        <div className="w-full flex justify-start items-center gap-5">
          <div className="flex-shrink-0 flex flex-col gap-5">
            <LabelField label="연도" color="gray-700" isFit={true}>
              <Dropdown
                options={YearOptions}
                value={year}
                onChange={setYear}
                font="body-md"
              />
            </LabelField>
            <LabelField label="학년" color="gray-700" isFit={true}>
              <Dropdown
                options={GradeOptions}
                value={grade}
                onChange={setGrade}
                font="body-md"
              />
            </LabelField>
          </div>
          <div className="flex-shrink-0 flex flex-col gap-5">
            <LabelField label="학기" color="gray-700" isFit={true}>
              <Dropdown
                options={SemesterOptions}
                value={semester}
                onChange={setSemester}
                font="body-md"
              />
            </LabelField>
            <LabelField label="구분" color="gray-700" isFit={true}>
              <Dropdown
                options={CategoryOptions}
                value={category}
                onChange={setCategory}
                font="body-md"
              />
            </LabelField>
          </div>
          <div className="flex-grow flex flex-col gap-5">
            <LabelField label="담당교수" color="gray-700" isFit={true}>
              <Input
                type="text"
                id="professor"
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
                placeholder="담당교수 성함을 입력하세요"
                font="body-md"
              />
            </LabelField>
            <LabelField label="교과목명" color="gray-700" isFit={true}>
              <Input
                type="text"
                id="course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="교과목명을 입력하세요"
                font="body-md"
              />
            </LabelField>
          </div>
        </div>

        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="족보에 대한 설명을 입력하세요"
        />

        <Button
          text="파일 업로드"
          font="body-lg"
          color={500}
          isFull={true}
          onClick={handleFileUpload}
        />

        <div className="flex gap-5">
          <Button
            text="취소"
            font="body-lg"
            color={500}
            isOutline={true}
            onClick={() => navigate("/main")}
          />
          <Button
            text="완료"
            font="body-lg"
            color={500}
            onClick={handleComplete}
          />
        </div>
      </div>
    </div>
  );
}

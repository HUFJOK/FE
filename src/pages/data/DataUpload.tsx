import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import LabelField from "../../components/LabelField";
import Dropdown from "../../components/Dropdown";
import Textarea from "../../components/Textarea";
import {
  YearOptions,
  SemesterOptions,
  GradeOptions,
  TypeOptions,
} from "../../data/OptionData";
import type { Option } from "../../data/OptionData";
import { BiX } from "react-icons/bi";
import { usePointStore } from "../../store/pointStore";
import {
  createMaterial,
  getMaterial,
  updateMaterial,
} from "../../api/materials";
import type {
  AttachmentDto,
  MaterialCreateResponse,
  MaterialRequest,
  MaterialUpdateResponse,
} from "../../api/types";

export default function DataUpload(): React.JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const materialId = Number(id);
  const isEdit = Boolean(id);
  const fetchPoint = usePointStore((state) => state.fetchPoint);

  const [title, setTitle] = useState<string>("");
  const [year, setYear] = useState<Option | null>(null);
  const [semester, setSemester] = useState<Option | null>(null);
  const [professor, setProfessor] = useState<string>("");
  const [grade, setGrade] = useState<Option | null>(null);
  const [type, setType] = useState<Option | null>(null);
  const [course, setCourse] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<AttachmentDto[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEdit && materialId) {
      const fetchMaterial = async () => {
        setIsLoading(true);
        try {
          const data = await getMaterial(materialId);

          setTitle(data.title);
          setProfessor(data.professorName);
          setCourse(data.courseName);
          setDescription(data.description);
          setAttachments(data.attachments);

          setYear(
            YearOptions.find((opt) => opt.value === String(data.year)) || null,
          );
          setSemester(
            SemesterOptions.find(
              (opt) => opt.value === String(data.semester),
            ) || null,
          );
          setGrade(
            GradeOptions.find((opt) => String(opt.value) === data.grade) ||
            null,
          );
          setType(
            TypeOptions.find(
              (opt) => String(opt.value) === data.courseDivision,
            ) || null,
          );
        } catch (error) {
          console.error("자료 로딩 실패:", error);
          alert("자료 정보를 불러오는데 실패했습니다.");
          navigate("/data");
        } finally {
          setIsLoading(false);
        }
      };

      fetchMaterial();
    } else {
      setYear(YearOptions[0]);
      setSemester(SemesterOptions[0]);
      setGrade(GradeOptions[0]);
      setType(TypeOptions[0]);
    }
  }, [isEdit, materialId, navigate]);

  const handleFileUpload = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (fileName: string): void => {
    setFiles(files.filter((file) => file.name !== fileName));
  };

  const handleComplete = async (): Promise<void> => {
    if (
      !title ||
      !year ||
      !semester ||
      !professor ||
      !grade ||
      !type ||
      !course
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    if (!isEdit && files.length === 0) {
      alert("하나 이상의 파일을 업로드해야 합니다.");
      return;
    }

    const metadata: MaterialRequest = {
      title,
      year: Number(year.value),
      semester: Number(semester.value),
      professorName: professor,
      grade: String(grade.value),
      courseDivision: String(type.value),
      courseName: course,
      description,
    };

    setIsLoading(true);

    try {
      if (isEdit && materialId) {
        const response: MaterialUpdateResponse = await updateMaterial(
          materialId,
          metadata,
        );
        alert("자료가 성공적으로 수정되었습니다.");
        navigate(`/data/${response.id}`);
      } else {
        const response: MaterialCreateResponse = await createMaterial(
          metadata,
          files,
        );
        alert(`업로드 성공! ${response.pointMessage}`);
        fetchPoint();
        navigate(`/data/${response.materialId}`);
      }
    } catch (error) {
      console.error("자료 처리 실패:", error);
      alert(
        `자료 ${isEdit ? "수정" : "업로드"}에 실패했습니다. 다시 시도해주세요.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl py-7.5 mx-auto flex justify-center items-start gap-16.25">
      <div className="flex flex-col gap-6.25">
        <Button
          text="구매 족보"
          font="title-sm"
          isOutline={true}
          onClick={() => navigate("/data", { state: { tab: "buy" } })}
        />
        <Button
          text="판매 족보"
          font="title-sm"
          onClick={() => navigate("/data", { state: { tab: "sell" } })}
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
          disabled={isLoading}
        />

        <div className="w-full flex justify-start items-center gap-5">
          <div className="flex-shrink-0 flex flex-col gap-5">
            <LabelField label="연도" color="gray-700" isFit={true}>
              <Dropdown
                options={YearOptions}
                value={year}
                onChange={setYear}
                font="body-md"
                disabled={isLoading}
              />
            </LabelField>
            <LabelField label="학년" color="gray-700" isFit={true}>
              <Dropdown
                options={GradeOptions}
                value={grade}
                onChange={setGrade}
                font="body-md"
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </LabelField>
            <LabelField label="구분" color="gray-700" isFit={true}>
              <Dropdown
                options={TypeOptions}
                value={type}
                onChange={setType}
                font="body-md"
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </LabelField>
          </div>
        </div>

        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="족보에 대한 설명을 입력하세요"
          disabled={isLoading}
        />

        {isEdit ? (
          attachments.length > 0 ? (
            <div className="w-full body-sm text-gray-600">
              <ul className="w-full flex flex-col justify-start items-start gap-2.5">
                {attachments.map((file) => (
                  <li key={file.id} className="flex justify-start items-center">
                    {file.originalFileName}
                  </li>
                ))}
              </ul>
            </div>
          ) : (<></>))
          : (
            <>
              <div className="w-full flex flex-col justify-start items-center gap-2.5">
                <div className="caption text-gray-500">
                  PDF 파일만 업로드 가능
                </div>
                <Button
                  text="파일 업로드"
                  font="body-lg"
                  color={500}
                  isFull={true}
                  onClick={handleFileUpload}
                  disabled={isLoading}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple // 여러 파일 선택 가능
                  style={{ display: "none" }}
                  accept=".pdf" // 파일 형식 제한
                />
              </div>
              {files.length > 0 && (
                <div className="w-full body-sm text-gray-600">
                  <ul className="w-full flex flex-col justify-start items-start gap-2.5">
                    {files.map((file, index) => (
                      <li
                        key={index}
                        className="flex justify-start items-center gap-2.5"
                      >
                        {file.name}
                        <BiX
                          className="w-5 h-5 text-primary-500"
                          onClick={() => handleRemoveFile(file.name)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

        <div className="flex gap-5">
          <Button
            text="취소"
            font="body-lg"
            color={500}
            isOutline={true}
            onClick={() => navigate(-1)}
            disabled={isLoading}
          />
          <Button
            text={isLoading ? "처리 중..." : isEdit ? "수정" : "완료"}
            font="body-lg"
            color={500}
            onClick={handleComplete}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import Button from "./Button";
import { usePointStore } from "../store/pointStore";
import { logout } from "../api/users";

const menuItems = [
  { name: "MAIN", path: "/main" },
  { name: "DATA", path: "/data" },
  { name: "MY", path: "/mypage" },
];

export default function Navigation(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { point, fetchPoint } = usePointStore();

  useEffect(() => {
    fetchPoint();
  }, [fetchPoint]);

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("로그아웃에 실패했습니다:", error);
      alert("로그아웃 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="flex justify-between items-center mx-11 pt-10 pb-5 border-b-2 border-primary-600">
      <div className="w-20">
        <img src={logo} alt="로고" />
      </div>

      <div className="flex gap-20 title-md">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`
                transition duration-150 ease-in-out
                ${isActive ? "text-primary-600" : "text-gray-400"} 
                hover:text-primary-600
                cursor-pointer
              `}
            >
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-6">
        <div className="title-sm text-primary-600">{point}P</div>
        <Button text="로그아웃" font="body-lg" onClick={handleLogout} />
      </div>
    </div>
  );
}

import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";
import Button from "./Button";

const menuItems = [
  { name: "MAIN", path: "/main" },
  { name: "DATA", path: "/data" },
  { name: "MY", path: "/mypage" },
];

export default function Navigation(): React.JSX.Element {
  const location = useLocation();

  const point = 500;

  const logout = (): void => {
    console.log("로그아웃");
  };

  return (
    <div className="flex justify-between items-center px-11 pt-10">
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
        <Button text="로그아웃" font="body-lg" onClick={logout} />
      </div>
    </div>
  );
}

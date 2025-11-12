import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Setting from "./pages/Setting";
import Login from "./pages/auth/Login";
import Loading from "./pages/auth/Loading";
import Onboarding from "./pages/auth/Onboarding";
import Main from "./pages/Main";
import Data from "./pages/data/Data";
import DataUpload from "./pages/data/DataUpload";
import DataDetail from "./pages/data/DataDetail";
import MyPage from "./pages/MyPage";
import Navigation from "./components/Navigation";

function NavigationLayout() {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
}

export default function AppRouter(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Setting />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/onboarding" element={<Onboarding />} />

        <Route element={<NavigationLayout />}>
          <Route path="/main" element={<Main />} />
          <Route path="/data" element={<Data />} />
          <Route path="/data/upload" element={<DataUpload />} />
          <Route path="/data/edit/:id" element={<DataUpload />} />
          <Route path="/data/:id" element={<DataDetail />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

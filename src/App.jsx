import { useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import AmenitiesPage from "./pages/AmenitiesPage.jsx";
import DetailPage from "./pages/DetailPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const readUser = () => {
      const stored = localStorage.getItem("authUser");
      if (!stored) {
        setUser(null);
        return;
      }
      try {
        setUser(JSON.parse(stored));
      } catch (error) {
        setUser(null);
      }
    };
    readUser();
    window.addEventListener("storage", readUser);
    window.addEventListener("authchange", readUser);
    return () => {
      window.removeEventListener("storage", readUser);
      window.removeEventListener("authchange", readUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    window.dispatchEvent(new Event("authchange"));
  };

  return (
    <div className="page">
      <div className="noise" aria-hidden="true" />
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">Harborstay</div>
          <div className="brand-sub">Hotel Booking</div>
        </div>
        <nav className="topnav">
          <NavLink to="/search" className={({ isActive }) => (isActive ? "active" : "")}>
            예약
          </NavLink>
          <NavLink to="/results" className={({ isActive }) => (isActive ? "active" : "")}>
            검색 결과
          </NavLink>
          <NavLink to="/amenities" className={({ isActive }) => (isActive ? "active" : "")}>
            편의시설
          </NavLink>
          <NavLink to="/detail/1" className={({ isActive }) => (isActive ? "active" : "")}>
            숙소 상세
          </NavLink>
        </nav>
        <div className="top-actions">
          {user ? (
            <div className="profile">
              <NavLink className="profile-link" to="/profile">
                <div className="avatar">{user.name?.slice(0, 1) || "G"}</div>
                <span className="profile-name">{user.name || "게스트"}</span>
              </NavLink>
              <button className="ghost" type="button" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          ) : (
            <>
              <NavLink className="ghost" to="/login">
                로그인
              </NavLink>
              <NavLink className="primary" to="/search">
                예약하기
              </NavLink>
            </>
          )}
        </div>
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/amenities" element={<AmenitiesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>

      <footer className="footer">
        <div>하버스테이 호텔 · 부산, 대한민국</div>
        <div>예약 문의: +82 02-1234-5678</div>
      </footer>
    </div>
  );
}

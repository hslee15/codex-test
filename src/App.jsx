import { NavLink, Route, Routes } from "react-router-dom";
import AmenitiesPage from "./pages/AmenitiesPage.jsx";
import DetailPage from "./pages/DetailPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";

export default function App() {
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
          <NavLink to="/detail" className={({ isActive }) => (isActive ? "active" : "")}>
            숙소 상세
          </NavLink>
        </nav>
        <div className="top-actions">
          <NavLink className="ghost" to="/login">
            로그인
          </NavLink>
          <NavLink className="primary" to="/search">
            예약하기
          </NavLink>
        </div>
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/amenities" element={<AmenitiesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/detail" element={<DetailPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <div>하버스테이 호텔 · 부산, 대한민국</div>
        <div>예약 문의: +82 02-1234-5678</div>
      </footer>
    </div>
  );
}

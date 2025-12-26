import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("로그인 중...");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        throw new Error("login failed");
      }
      const data = await res.json();
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authchange"));
      setStatus("로그인 완료! 예약을 진행해 주세요.");
      navigate("/search");
    } catch (error) {
      setStatus("로그인 실패. 이메일/비밀번호를 확인해 주세요.");
    }
  };

  return (
    <section className="login-page">
      <div className="login-shell">
        <div className="login-panel">
          <span className="eyebrow">Member Access</span>
          <h1>여행을 더 간편하게.</h1>
          <p>로그인 후 예약 관리와 맞춤 혜택을 확인하세요.</p>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="field">
              <label>이메일</label>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                onChange={handleChange}
                value={form.email}
              />
            </div>
            <div className="field">
              <label>비밀번호</label>
              <input
                name="password"
                type="password"
                placeholder="********"
                onChange={handleChange}
                value={form.password}
              />
            </div>
            <button className="primary" type="submit">
              로그인
            </button>
          </form>
          {status && <div className="login-status">{status}</div>}
          <div className="login-meta">
            <span>비밀번호 찾기</span>
            <span>회원가입 문의</span>
          </div>
          <Link className="ghost login-back" to="/search">
            예약 페이지로 돌아가기
          </Link>
        </div>
        <div className="login-side">
          <div>
            <h2>Harborstay Club</h2>
            <p>멤버 전용 요금, 우선 체크인, 환영 기프트 제공.</p>
          </div>
          <div className="login-card">
            <strong>오늘의 특가</strong>
            <p>로프트 스위트 20% 할인 · 오션뷰 보장</p>
          </div>
        </div>
      </div>
    </section>
  );
}

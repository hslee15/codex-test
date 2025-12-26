import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("불러오는 중...");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setStatus("로그인이 필요합니다.");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch("/api/me", { headers }).then((res) =>
        res.ok ? res.json() : Promise.reject(res)
      ),
      fetch("/api/bookings/me", { headers }).then((res) =>
        res.ok ? res.json() : Promise.reject(res)
      ),
    ])
      .then(([userData, bookingsData]) => {
        setUser(userData);
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setStatus("");
      })
      .catch(() => {
        setStatus("프로필 정보를 불러오지 못했습니다.");
      });
  }, []);

  return (
    <section className="profile-page">
      <header className="profile-header">
        <div>
          <span className="eyebrow">My Profile</span>
          <h1>예약 관리</h1>
          <p>내 예약 내역과 계정 정보를 확인할 수 있습니다.</p>
        </div>
        {user && (
          <div className="profile-card">
            <div className="avatar">{user.name?.slice(0, 1) || "G"}</div>
            <div>
              <strong>{user.name}</strong>
              <div>{user.email}</div>
            </div>
          </div>
        )}
      </header>

      {status && <div className="panel">{status}</div>}

      {!status && (
        <div className="profile-grid">
          <div className="panel">
            <h2>예약 내역</h2>
            {bookings.length === 0 ? (
              <p>예약 내역이 없습니다.</p>
            ) : (
              <div className="booking-list">
                {bookings.map((booking) => (
                  <div className="booking-card" key={booking.id}>
                    <div>
                      <strong>{booking.roomName}</strong>
                      <p>
                        {booking.checkIn} ~ {booking.checkOut}
                      </p>
                      <p>투숙 인원: {booking.guests}명</p>
                    </div>
                    <div className="booking-meta">
                      <span>예약 번호 {booking.id}</span>
                      <span>결제 완료</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="panel">
            <h2>계정 정보</h2>
            <div className="profile-info-list">
              <div>
                <strong>이름</strong>
                <p>{user?.name || "-"}</p>
              </div>
              <div>
                <strong>이메일</strong>
                <p>{user?.email || "-"}</p>
              </div>
              <div>
                <strong>멤버 등급</strong>
                <p>Harborstay Club · Silver</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

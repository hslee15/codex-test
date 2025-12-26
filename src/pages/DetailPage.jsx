import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { rooms as fallbackRooms } from "../data.js";

const fallbackGallery = [
  {
    label: "바다 전망 테라스",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "우드 톤 침실",
    src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "라운지 코너",
    src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "욕실 + 어메니티",
    src: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=900&q=80",
  },
];

const policies = [
  { title: "체크인", detail: "15:00 이후" },
  { title: "체크아웃", detail: "11:00 이전" },
  { title: "취소 정책", detail: "48시간 전 무료 취소" },
  { title: "결제", detail: "카드/현금 모두 가능" },
];

export default function DetailPage() {
  const { id } = useParams();
  const [room, setRoom] = useState(fallbackRooms[0]);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState("");
  const [form, setForm] = useState({
    checkIn: "",
    checkOut: "",
    guests: 2,
    name: "",
    email: "",
  });

  useEffect(() => {
    let active = true;
    fetch(`/api/rooms/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (active && data) {
          setRoom(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  const gallery = room.gallery?.length
    ? room.gallery.map((src, index) => ({
        src,
        label: fallbackGallery[index % fallbackGallery.length].label,
      }))
    : fallbackGallery;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooking = async (event) => {
    event.preventDefault();
    setBookingStatus("예약을 진행 중입니다...");
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          roomId: room.id,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          guests: Number(form.guests),
          name: form.name,
          email: form.email,
        }),
      });
      if (!res.ok) {
        throw new Error("booking failed");
      }
      setBookingStatus("예약이 완료되었습니다. 이메일을 확인해 주세요.");
    } catch (error) {
      setBookingStatus("예약에 실패했습니다. 입력 정보를 확인해 주세요.");
    }
  };

  return (
    <section className="detail-page">
      <div className="detail-header">
        <div>
          <span className="eyebrow">Harborstay Hotel</span>
          <h1>{room.name}</h1>
          <p>{room.description}</p>
        </div>
        <div className="detail-rating">
          <span>{room.rating}</span>
          <div>
            <strong>매우 좋음</strong>
            <div>{room.reviews}</div>
          </div>
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-gallery">
          {loading && <div className="panel">객실 정보를 불러오는 중입니다.</div>}
          <div className="detail-main">
            <img src={gallery[0].src} alt={gallery[0].label} />
          </div>
          <div className="detail-thumbs">
            {gallery.slice(1).map((item) => (
              <div className="detail-thumb" key={item.label}>
                <img src={item.src} alt={item.label} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="detail-book">
          <div>
            <div className="detail-price">{room.price} / 1박</div>
            <div className="detail-note">세금 포함 · 무료 취소</div>
          </div>
          <div className="detail-tags">
            {room.highlights.map((item) => (
              <span className="chip" key={item}>
                {item}
              </span>
            ))}
          </div>
          <form className="detail-form" onSubmit={handleBooking}>
            <div className="field">
              <label>체크인</label>
              <input name="checkIn" type="date" onChange={handleChange} />
            </div>
            <div className="field">
              <label>체크아웃</label>
              <input name="checkOut" type="date" onChange={handleChange} />
            </div>
            <div className="field">
              <label>투숙 인원</label>
              <select name="guests" onChange={handleChange} value={form.guests}>
                <option value={1}>성인 1명</option>
                <option value={2}>성인 2명</option>
                <option value={3}>성인 3명</option>
              </select>
            </div>
            <div className="field">
              <label>예약자 이름</label>
              <input name="name" type="text" onChange={handleChange} />
            </div>
            <div className="field">
              <label>이메일</label>
              <input name="email" type="email" onChange={handleChange} />
            </div>
            <button className="primary" type="submit">
              이 객실 예약하기
            </button>
            {bookingStatus && <div className="detail-status">{bookingStatus}</div>}
          </form>
          <div className="detail-meta">
            <div>
              <strong>객실 구성</strong>
              <p>
                {room.bed} · {room.size} · {room.perks}
              </p>
            </div>
            <div>
              <strong>체크인 안내</strong>
              <p>비대면 체크인 가능 · 프런트 24시간 운영</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="detail-body">
        <div className="panel">
          <h2>객실 하이라이트</h2>
          <ul className="detail-list">
            <li>고층 오션뷰 발코니 제공</li>
            <li>블루투스 스피커 & 스마트 TV</li>
            <li>네스프레소 커피머신</li>
            <li>에어컨 · 가습기 · 공기청정기</li>
          </ul>
        </div>
        <div className="panel">
          <h2>이용 정책</h2>
          <div className="policy-grid">
            {policies.map((policy) => (
              <div key={policy.title}>
                <strong>{policy.title}</strong>
                <p>{policy.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h2>객실 선택 안내</h2>
          <p>
            동일 타입 내에서도 전망과 층수가 다를 수 있습니다. 체크인 당일
            객실 배정 시 요청사항을 반영해 드립니다.
          </p>
          <Link className="ghost detail-back" to="/results">
            검색 결과로 돌아가기
          </Link>
        </div>
      </div>
    </section>
  );
}

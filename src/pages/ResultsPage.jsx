import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { filters, rooms as fallbackRooms } from "../data.js";

export default function ResultsPage() {
  const [rooms, setRooms] = useState(fallbackRooms);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/rooms")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (active && Array.isArray(data)) {
          setRooms(data);
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
  }, []);

  return (
    <section className="results-layout">
      <div className="results-head">
        <div>
          <h1>부산 · 검색 결과</h1>
          <p>총 {rooms.length}개 객실이 선택하신 날짜에 가능합니다.</p>
        </div>
        <div className="results-sort">
          <label>정렬</label>
          <select>
            <option>추천순</option>
            <option>가격 낮은 순</option>
            <option>평점 높은 순</option>
          </select>
        </div>
      </div>

      <div className="results-body">
        <div className="results-grid">
          {loading && <div className="panel">객실 정보를 불러오는 중입니다.</div>}
          {rooms.map((room) => (
            <article className="room-card" key={room.name}>
              <div className="room-photo">
                <img src={room.image} alt={`${room.name} 객실`} />
                <span className="tag">{room.tag}</span>
              </div>
              <div className="room-content">
                <div>
                  <h3>{room.name}</h3>
                  <p className="room-sub">
                    {room.bed} · {room.size} · {room.perks}
                  </p>
                </div>
                <div className="room-rating">
                  <span>{room.rating}</span>
                  <div>
                    <strong>매우 좋음</strong>
                    <div>{room.reviews}</div>
                  </div>
                </div>
                <div className="room-footer">
                  <div>
                    <div className="room-price">{room.price} / 1박</div>
                    <div className="room-total">총 {room.total}</div>
                  </div>
                  <Link className="primary" to={`/detail/${room.id || 1}`}>
                    상세 보기
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="filters-panel">
          <div className="panel">
            <h2>검색 필터</h2>
            <div className="filter-list">
              {filters.map((item) => (
                <label className="checkbox" key={item}>
                  <input type="checkbox" defaultChecked />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="panel highlight">
            <h2>예약 요약</h2>
            <p>2박 · 성인 2명</p>
            <p>체크인: 금 · 체크아웃: 일</p>
            <div className="button-row">
              <button className="primary">예약하기</button>
              <button className="ghost">여행 저장</button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

import { filters, rooms } from "../data.js";

export default function SearchPage() {
  return (
    <>
      <section className="hero-splash">
        <div className="hero-copy">
          <span className="eyebrow">Busan · Oceanfront</span>
          <h1>바다 옆 휴식을 위한 예약 플랫폼.</h1>
          <p>
            하버스테이에서 가장 인기 있는 객실과 특가 요금을 한 번에 확인하세요.
            체크인부터 예약까지 2분이면 충분합니다.
          </p>
          <div className="hero-badges">
            <span>무료 취소</span>
            <span>최저가 보장</span>
            <span>도심 접근성</span>
          </div>
        </div>
        <div className="hero-media">
          <img src={rooms[0].image} alt="하버스테이 호텔 대표 객실" />
          <div className="hero-overlay">
            <div>
              <strong>Harbor Queen</strong>
              <span>오션뷰 · 킹 침대 · 발코니</span>
            </div>
            <div className="hero-price">₩148,000 / 1박</div>
          </div>
        </div>
      </section>

      <section className="booking-strip">
        <div className="field">
          <label>목적지</label>
          <input type="text" defaultValue="부산, 대한민국" />
        </div>
        <div className="field">
          <label>체크인</label>
          <input type="date" />
        </div>
        <div className="field">
          <label>체크아웃</label>
          <input type="date" />
        </div>
        <div className="field">
          <label>투숙 인원</label>
          <select>
            <option>성인 2명</option>
            <option>성인 2명, 아동 1명</option>
            <option>성인 3명</option>
          </select>
        </div>
        <button className="primary">객실 검색</button>
      </section>

      <section className="trust-bar">
        <div>
          <strong>8.9</strong>
          <span>고객 평점</span>
        </div>
        <div>
          <strong>48h</strong>
          <span>무료 취소</span>
        </div>
        <div>
          <strong>24h</strong>
          <span>컨시어지</span>
        </div>
        <div>
          <strong>₩128k</strong>
          <span>1박 최저가</span>
        </div>
      </section>

      <section className="filter-row">
        {filters.map((item) => (
          <span className="chip" key={item}>
            {item}
          </span>
        ))}
      </section>
    </>
  );
}

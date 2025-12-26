import { amenities } from "../data.js";

export default function AmenitiesPage() {
  return (
    <section className="amenities-page">
      <header className="amenities-hero">
        <div>
          <span className="eyebrow">Amenities</span>
          <h1>머무는 동안 모든 순간이 편안하도록.</h1>
          <p>
            하버스테이는 도시의 활기와 휴식의 균형을 위해 필요한 모든 서비스를
            제공합니다.
          </p>
        </div>
        <div className="amenities-card">
          <h3>투숙객 전용 서비스</h3>
          <ul>
            <li>체크인 전 짐 보관 가능</li>
            <li>공항 픽업 예약 서비스</li>
            <li>모닝콜 · 룸서비스</li>
          </ul>
        </div>
      </header>

      <div className="amenity-grid">
        {amenities.map((amenity) => (
          <div className="amenity" key={amenity.title}>
            <h3>{amenity.title}</h3>
            <p>{amenity.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

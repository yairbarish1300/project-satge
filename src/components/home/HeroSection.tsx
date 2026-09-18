import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="rp-hero">
      <div className="rp-hero-badge">Professional Event Production</div>
      <h1>STAGE - תכנון סאונד | הגברה | מסכים | תאורה</h1>
      <p>
        הסטנדרט הגבוה ביותר להפקות אירועים חיים. אנו מספקים פתרונות טכניים מקצה לקצה,
        החל מתכנון אקוסטי מורכב ועד לעיצוב תאורה אומנותי.
      </p>
      <div className="rp-cta-row">
        <button className="rp-btn-primary" onClick={() => navigate('/shop')}>מעבר לחנות הציוד</button>
        <button className="rp-btn-secondary" onClick={() => navigate('/contact')}>צרו קשר לייעוץ</button>
      </div>
    </section>
  );
}

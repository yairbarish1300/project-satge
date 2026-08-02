import './PageFooters.css';

type FooterLink = {
  label: string;
  href: string;
};

type SimpleFooterProps = {
  copyright: string;
  links: FooterLink[];
};

export function SimpleFooter({ copyright, links }: SimpleFooterProps) {
  return (
    <footer className="rp-footer">
      <div className="rp-muted">{copyright}</div>
      <div className="rp-footer-group">
        {links.map((link) => (
          <a key={link.label} href={link.href} className="rp-footer-link">
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}

type AdminFooterProps = {
  copyright: string;
};

export function AdminFooter({ copyright }: AdminFooterProps) {
  return (
    <footer className="admin-footer">
      <div className="admin-footer-copy">{copyright}</div>
      <div className="admin-footer-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Contact Support</a>
      </div>
    </footer>
  );
}

export function CheckoutFooter() {
  return (
    <footer className="checkout-footer">
      <div className="checkout-footer-grid">
        <div className="checkout-footer-col">
          <span className="checkout-footer-brand">STAGE</span>
          <p className="checkout-footer-text">פתרונות טכניים מתקדמים לאירועים, הופעות וכנסים. הסטנדרט הגבוה ביותר בתחום הסאונד והתאורה.</p>
        </div>
        <div className="checkout-footer-col">
          <h4 className="checkout-footer-title">צור קשר</h4>
          <ul className="checkout-footer-list">
            <li className="checkout-footer-item">
              <span className="msym">call</span>
              <span>+1 (555) 012-3456</span>
            </li>
            <li className="checkout-footer-item">
              <span className="msym">mail</span>
              <span>rentals@stage-events.com</span>
            </li>
          </ul>
        </div>
        <div className="checkout-footer-col">
          <h4 className="checkout-footer-title">ניווט מהיר</h4>
          <ul className="checkout-footer-list">
            <li><a href="#" className="checkout-footer-link">ציוד להשכרה</a></li>
            <li><a href="#" className="checkout-footer-link">פרויקטים</a></li>
            <li><a href="#" className="checkout-footer-link">אודות החברה</a></li>
            <li><a href="#" className="checkout-footer-link">שאלות נפוצות</a></li>
          </ul>
        </div>
        <div className="checkout-footer-col">
          <h4 className="checkout-footer-title">משפטי</h4>
          <ul className="checkout-footer-list">
            <li><a href="#" className="checkout-footer-link">Terms of Service</a></li>
            <li><a href="#" className="checkout-footer-link">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="checkout-footer-bottom">
        <p className="checkout-copyright">© 2024 STAGE Event Production Services</p>
        <div className="checkout-social">
          <span className="msym">brand_awareness</span>
          <span className="msym">groups</span>
          <span className="msym">hub</span>
        </div>
      </div>
    </footer>
  );
}
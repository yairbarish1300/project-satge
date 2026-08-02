import { COMMITMENTS } from './checkoutData';

export default function CommitmentsList() {
  return (
    <div className="checkout-commit">
      <h4>
        <span className="msym">verified_user</span>
        התחייבות למקצועיות
      </h4>
      <ul className="checkout-commit-list">
        {COMMITMENTS.map((commitment, idx) => (
          <li key={idx}>
            <span className="msym">check_circle</span>
            <span>{commitment}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

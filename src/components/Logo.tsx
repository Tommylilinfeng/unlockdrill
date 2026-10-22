import { Link } from 'react-router-dom';

export function Lockup({ to = '/' }: { to?: string }) {
  return (
    <Link to={to} className="lockup" aria-label="UnlockDrill home">
      <img src={`${import.meta.env.BASE_URL}logo/mark-small.svg`} alt="" width={28} height={28} />
      <span>UnlockDrill</span>
    </Link>
  );
}

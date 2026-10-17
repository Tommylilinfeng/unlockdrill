import { Link } from 'react-router-dom';
import { Shell } from '../components/Shell';
export default function NotFound() {
  return <Shell><div className="wrap" style={{ paddingTop: 64 }}><h1>There’s no page here.</h1><p style={{ marginTop: 14 }}><Link to="/">Go to the homepage</Link></p></div></Shell>;
}

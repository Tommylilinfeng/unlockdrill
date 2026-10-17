import { Link } from 'react-router-dom';
import { Shell } from '../components/Shell';
export default function NotFound() {
  return <Shell><section className="hero"><div className="container"><h1>Page not found</h1><p><Link to="/">Back to the homepage</Link></p></div></section></Shell>;
}

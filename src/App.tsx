import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Setup from './pages/Setup';
import Question from './pages/Question';
import Settings from './pages/Settings';
import Thanks from './pages/Thanks';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import { pageview } from './lib/analytics';

function PageViews() {
  const loc = useLocation();
  useEffect(() => { pageview(loc.pathname + loc.search); window.scrollTo(0, 0); }, [loc.pathname, loc.search]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <PageViews />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/for/:slug" element={<Landing />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/q" element={<Question />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/thanks" element={<Thanks />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

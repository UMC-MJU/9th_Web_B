import { useEffect, useState } from 'react';
import Home from './router/Home';
import About from './router/About';
import NotFound from './router/NotFound';

export default function App() {
  const [path, setPath] = useState<string>(window.location.pathname);

  // 뒤로가기/앞으로가기 감지
  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // 페이지 이동 함수
  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setPath(to);
  };

  // 라우팅 분기
  let Page;
  if (path === '/') Page = <Home navigate={navigate} />;
  else if (path === '/about') Page = <About navigate={navigate} />;
  else Page = <NotFound />;

  return (
    <div>
      <nav>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
        >
          Home
        </a>
        {' | '}
        <a
          href="/about"
          onClick={(e) => {
            e.preventDefault();
            navigate('/about');
          }}
        >
          About
        </a>
      </nav>
      <hr />
      {Page}
    </div>
  );
}

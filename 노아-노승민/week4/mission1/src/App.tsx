import { BrowserRouter, Routes, Route } from "react-router-dom";
import MoviesPage from "./pages/MoviesPage";
import MovieDetailPage from "./pages/MovieDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MoviesPage />} />
        <Route path="/movies/:id" element={<MovieDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

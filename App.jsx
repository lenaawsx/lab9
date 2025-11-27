import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [breeds, setBreeds] = useState([]);
  const [selected, setSelected] = useState("");
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Загружаем список пород
  useEffect(() => {
    async function loadBreeds() {
      try {
        setError("");
        const res = await fetch("https://api.thecatapi.com/v1/breeds");
        const data = await res.json();
        setBreeds(data);
      } catch (e) {
        setError("Ошибка загрузки списка пород");
      }
    }
    loadBreeds();
  }, []);

  // Загружаем картинки по породе
  useEffect(() => {
    async function loadCats() {
      if (!selected) return;
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `https://api.thecatapi.com/v1/images/search?breed_ids=${selected}&limit=12`
        );
        const data = await res.json();
        setCats(data);
      } catch (e) {
        setError("Ошибка загрузки изображений");
      } finally {
        setLoading(false);
      }
    }

    loadCats();
  }, [selected]);

  return (
    <div className="container">
      <h1>Каталог котиков по породам</h1>

      {/* Выбор породы */}
      <select value={selected} onChange={(e) => setSelected(e.target.value)}>
        <option value="">Выберите породу</option>
        {breeds.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      {/* Ошибка */}
      {error && <div className="message error">{error}</div>}

      {/* Загрузка */}
      {loading && <div className="message">Загрузка...</div>}

      {/* Сетка картинок */}
      <div className="grid">
        {cats.map((c) => (
          <div className="card" key={c.id}>
            <img src={c.url} alt="cat" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

import { useState } from "react";

function FishFinder() {
  const [query, setQuery] = useState("");
  const [fish, setFish] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchFish(e) {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setFish(null);

    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          query
        )}`
      );

      if (!res.ok) {
        throw new Error("Fish not found");
      }

      const data = await res.json();

      if (data.type === "disambiguation") {
        setError("Try being more specific, like 'largemouth bass' or 'bluegill'.");
        return;
      }

      setFish(data);
    } catch {
      setError("Could not find that fish species. Try another search.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="hero-card">
        <h1>Fish Species Finder 🎣</h1>
        <p>Search for a fish species and learn quick facts.</p>

        <form onSubmit={searchFish} className="form">
          <input
            type="text"
            placeholder="Try: largemouth bass"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search Fish</button>
        </form>
      </section>

      {loading && <p className="loading">Casting your line...</p>}

      {error && <p className="error">{error}</p>}

      {fish && (
        <section className="card fish-result">
          <h2>{fish.title}</h2>

          {fish.thumbnail && (
            <img
              src={fish.thumbnail.source}
              alt={fish.title}
              className="post-image"
            />
          )}

          <p>{fish.extract}</p>

          {fish.content_urls?.desktop?.page && (
            <a
              href={fish.content_urls.desktop.page}
              target="_blank"
              rel="noreferrer"
            >
              Read more on Wikipedia
            </a>
          )}
        </section>
      )}
    </main>
  );
}

export default FishFinder;
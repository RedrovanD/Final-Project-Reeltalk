import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import PostCard from '../components/PostCard.jsx';
import Loader from '../components/Loader.jsx';
import { flags } from '../lib/helpers.js';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState('created_at');
  const [search, setSearch] = useState('');
  const [flag, setFlag] = useState('All');
  const [showPreview, setShowPreview] = useState(
    localStorage.getItem('show-preview') === 'true'
  );

  const fetchPosts = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from('posts')
      .select('*')
      .order(orderBy, { ascending: false });

    if (flag !== 'All') {
      query = query.eq('flag', flag);
    }

    const { data, error } = await query;

    if (error) {
      alert(error.message);
      setPosts([]);
    } else {
      setPosts(data || []);
    }

    setLoading(false);
  }, [orderBy, flag]);

  useEffect(() => {
    localStorage.setItem('show-preview', showPreview);
  }, [showPreview]);

  useEffect(() => {
  const loadPosts = async () => {
    await fetchPosts();
  };

  loadPosts();
}, [fetchPosts]);

  const filtered = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="page">
      <div className="hero">
        <p className="eyebrow">Fishing forum</p>
        <h1>Cast a question, share a catch, or reel in new advice.</h1>
        <p>Welcome to ReelTalk, a HobbyHub community for anglers.</p>
      </div>

      <div className="controls">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts by title..."
        />

        <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
          <option value="created_at">Newest first</option>
          <option value="upvotes">Most upvoted</option>
        </select>

        <select value={flag} onChange={(e) => setFlag(e.target.value)}>
          {flags.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>

        <label className="toggle">
          <input
            type="checkbox"
            checked={showPreview}
            onChange={(e) => setShowPreview(e.target.checked)}
          />
          Show previews
        </label>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="feed">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} showPreview={showPreview} />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <p className="empty">No bites yet. Create the first post!</p>
      )}
    </section>
  );
}
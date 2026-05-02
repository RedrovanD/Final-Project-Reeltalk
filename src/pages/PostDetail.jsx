import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowUpCircle, Trash2, Edit, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient.js';
import Loader from '../components/Loader.jsx';
import { formatDate, getYouTubeEmbedUrl } from '../lib/helpers.js';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [referencedPost, setReferencedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);

  const fetchPost = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      alert(error.message);
      setPost(null);
      setLoading(false);
      return;
    }

    setPost(data);

    if (data?.repost_id) {
      const { data: ref } = await supabase
        .from('posts')
        .select('id,title,created_at,upvotes')
        .eq('id', data.repost_id)
        .single();

      setReferencedPost(ref);
    } else {
      setReferencedPost(null);
    }

    setLoading(false);
  }, [id]);

  useEffect(() => {
    const loadPost = async () => {
      await fetchPost();
    };

    loadPost();
  }, [fetchPost]);

  async function upvote() {
    const { error } = await supabase
      .from('posts')
      .update({ upvotes: (post.upvotes || 0) + 1 })
      .eq('id', id);

    if (error) return alert(error.message);

    setPost({ ...post, upvotes: (post.upvotes || 0) + 1 });
  }

  async function addComment(event) {
    event.preventDefault();

    if (!comment.trim()) return;

    const nextComments = [
      ...(post.comments || []),
      {
        text: comment,
        created_at: new Date().toISOString()
      }
    ];

    const { error } = await supabase
      .from('posts')
      .update({ comments: nextComments })
      .eq('id', id);

    if (error) return alert(error.message);

    setPost({ ...post, comments: nextComments });
    setComment('');
  }

  async function deleteComment(index) {
    const enteredKey = prompt('Enter the post secret key to delete this comment:');

    if (enteredKey !== post.secret_key) {
      return alert('Wrong secret key.');
    }

    const nextComments = (post.comments || []).filter((_, i) => i !== index);

    const { error } = await supabase
      .from('posts')
      .update({ comments: nextComments })
      .eq('id', id);

    if (error) return alert(error.message);

    setPost({ ...post, comments: nextComments });
  }

  async function deletePost() {
    const enteredKey = prompt('Enter the secret key for this post:');

    if (enteredKey !== post.secret_key) {
      return alert('Wrong secret key.');
    }

    if (!confirm('Delete this post for good?')) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) return alert(error.message);

    navigate('/');
  }

  async function generateSummary() {
    setSummaryLoading(true);
    setAiSummary('');

    const { data, error } = await supabase.functions.invoke('summarize-post', {
      body: {
        title: post.title,
        content: post.content,
        upvotes: post.upvotes,
        comments: post.comments
      }
    });

    if (error) {
      alert(error.message);
      setSummaryLoading(false);
      return;
    }

    setAiSummary(data.summary);
    setSummaryLoading(false);
  }

  if (loading) return <Loader />;
  if (!post) return <p className="empty">Post not found.</p>;

  const embedUrl = getYouTubeEmbedUrl(post.video_url);

  return (
    <section className="page narrow">
      <article className="detail-card">
        <div className="card-topline">
          <span className="flag">{post.flag}</span>
          <span>{formatDate(post.created_at)}</span>
        </div>

        <h1>{post.title}</h1>
        <p className="meta">Post ID: {post.id}</p>

        {referencedPost && (
          <div className="repost-box">
            Reposted from{' '}
            <Link to={`/posts/${referencedPost.id}`}>
              {referencedPost.title}
            </Link>
          </div>
        )}

        {post.content && <p className="content">{post.content}</p>}

        <div className="info-grid">
          {post.species && (
            <span>
              <b>Species:</b> {post.species}
            </span>
          )}

          {post.location && (
            <span>
              <b>Location:</b> {post.location}
            </span>
          )}

          {post.bait && (
            <span>
              <b>Bait:</b> {post.bait}
            </span>
          )}

          {post.water_type && (
            <span>
              <b>Water:</b> {post.water_type}
            </span>
          )}
        </div>

        {post.image_url && (
          <img className="post-image" src={post.image_url} alt={post.title} />
        )}

        {embedUrl && (
          <iframe
            className="video"
            src={embedUrl}
            title="Fishing video"
            allowFullScreen
          />
        )}

        <div className="ai-summary-box">
          <button onClick={generateSummary} className="secondary">
            Generate AI Summary
          </button>

          {summaryLoading && (
            <p className="loading">Summarizing the catch...</p>
          )}

          {aiSummary && (
            <div className="summary-card">
              <h2>AI Post Summary</h2>
              <p>{aiSummary}</p>
            </div>
          )}
        </div>

        <div className="actions">
          <button onClick={upvote}>
            <ArrowUpCircle size={18} /> Upvote ({post.upvotes || 0})
          </button>

          <Link className="button secondary" to={`/posts/${post.id}/edit`}>
            <Edit size={18} /> Edit
          </Link>

          <button className="danger" onClick={deletePost}>
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </article>

      <section className="comments-card">
        <h2>
          <MessageCircle size={22} /> Dock Talk
        </h2>

        <form onSubmit={addComment} className="comment-form">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Leave a comment..."
          />
          <button>Add Comment</button>
        </form>

        <div className="comments-list">
          {(post.comments || []).map((item, index) => (
            <div className="comment" key={`${item.created_at}-${index}`}>
              <p>{item.text}</p>
              <small>{formatDate(item.created_at)}</small>

              <button
                className="text-danger"
                onClick={() => deleteComment(index)}
              >
                Delete comment
              </button>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
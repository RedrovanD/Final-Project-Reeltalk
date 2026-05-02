import { Link } from 'react-router-dom';
import { Anchor, ArrowUpCircle, Image as ImageIcon } from 'lucide-react';
import { formatDate } from '../lib/helpers.js';

export default function PostCard({ post, showPreview }) {
  return (
    <article className="post-card">
      <div className="card-topline">
        <span className="flag">{post.flag || 'Question'}</span>
        <span>{formatDate(post.created_at)}</span>
      </div>
      <Link to={`/posts/${post.id}`} className="post-title">{post.title}</Link>
      <div className="post-stats">
        <span><ArrowUpCircle size={17} /> {post.upvotes || 0} upvotes</span>
        {post.species && <span><Anchor size={17} /> {post.species}</span>}
      </div>
      {showPreview && post.content && <p className="preview">{post.content}</p>}
      {showPreview && post.image_url && (
        <div className="thumb-row"><ImageIcon size={16} /> Image attached</div>
      )}
    </article>
  );
}

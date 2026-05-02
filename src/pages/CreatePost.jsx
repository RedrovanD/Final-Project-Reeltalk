import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient.js';
import PostForm from '../components/PostForm.jsx';

export default function CreatePost() {
  const navigate = useNavigate();

  async function createPost(form) {
    const { data, error } = await supabase.from('posts').insert({ ...form, comments: [] }).select().single();
    if (error) return alert(error.message);
    navigate(`/posts/${data.id}`);
  }

  return <section className="page narrow"><h1>Make a New Cast</h1><PostForm onSubmit={createPost} submitLabel="Create Post" /></section>;
}

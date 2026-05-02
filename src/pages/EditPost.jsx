import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient.js';
import PostForm from '../components/PostForm.jsx';
import Loader from '../components/Loader.jsx';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      alert(error.message);
    }

    setPost(data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    const loadPost = async () => {
      await fetchPost();
    };

    loadPost();
  }, [fetchPost]);

  async function updatePost(form) {
    const enteredKey = prompt('Enter the secret key for this post:');

    if (enteredKey !== post.secret_key) {
      return alert('Wrong secret key.');
    }

    const { error } = await supabase
      .from('posts')
      .update(form)
      .eq('id', id);

    if (error) {
      return alert(error.message);
    }

    navigate(`/posts/${id}`);
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="page narrow">
      <h1>Edit Post</h1>
      <PostForm
        initialValues={post}
        onSubmit={updatePost}
        submitLabel="Save Changes"
      />
    </section>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient.js';

export default function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) return alert(error.message);

    alert('Signup successful! Check your email if confirmation is enabled.');
  }

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) return alert(error.message);

    navigate('/');
  }

  async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
      queryParams: {
        prompt: 'select_account'
      }
    }
  });

  if (error) return alert(error.message);
}

  async function resetPassword() {
    if (!email) return alert('Enter your email first.');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`
    });

    if (error) return alert(error.message);

    alert('Password reset email sent.');
  }

  return (
    <section className="page narrow">
      <div className="form-card">
        <h1>Login or Sign Up</h1>

        <label>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>

        <button onClick={signUp} className="secondary">
          Sign Up
        </button>

        <button onClick={loginWithGoogle}>Continue with Google</button>

        <button onClick={resetPassword} className="secondary">
          Reset Password
        </button>
      </div>
    </section>
  );
}
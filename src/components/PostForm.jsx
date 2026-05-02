import { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { flags, waterTypes } from '../lib/helpers.js';

export default function PostForm({ initialValues = {}, onSubmit, submitLabel }) {
  const [form, setForm] = useState(() => ({
    title: '',
    content: '',
    image_url: '',
    video_url: '',
    secret_key: '',
    flag: 'Question',
    species: '',
    location: '',
    bait: '',
    water_type: 'Lake',
    repost_id: '',
    ...initialValues
  }));

  const [uploading, setUploading] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function uploadLocalImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from('post-images')
      .upload(fileName, file);

    if (error) {
      alert(
        'Image upload failed. Make sure you created a public Supabase bucket named post-images.'
      );
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from('post-images')
      .getPublicUrl(fileName);

    setForm((current) => ({ ...current, image_url: data.publicUrl }));
    setUploading(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      return alert('Please add a post title.');
    }

    if (!form.secret_key.trim() && !initialValues.id) {
      return alert('Please set a secret key so you can edit/delete later.');
    }

    onSubmit({
      ...form,
      repost_id: form.repost_id ? Number(form.repost_id) : null,
      secret_key: form.secret_key || initialValues.secret_key
    });
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <label>Post title *</label>
      <input
        name="title"
        value={form.title}
        onChange={updateField}
        placeholder="Best bait for largemouth bass?"
      />

      <label>Flag</label>
      <select name="flag" value={form.flag} onChange={updateField}>
        {flags
          .filter((f) => f !== 'All')
          .map((flag) => (
            <option key={flag}>{flag}</option>
          ))}
      </select>

      <label>Text content</label>
      <textarea
        name="content"
        value={form.content || ''}
        onChange={updateField}
        placeholder="Share your fishing story, tip, or question..."
      />

      <div className="grid-2">
        <div>
          <label>Species</label>
          <input
            name="species"
            value={form.species || ''}
            onChange={updateField}
            placeholder="Bass, trout, catfish..."
          />
        </div>

        <div>
          <label>Location</label>
          <input
            name="location"
            value={form.location || ''}
            onChange={updateField}
            placeholder="Lake Lanier dock"
          />
        </div>

        <div>
          <label>Bait / lure</label>
          <input
            name="bait"
            value={form.bait || ''}
            onChange={updateField}
            placeholder="Worm, jig, spinnerbait"
          />
        </div>

        <div>
          <label>Water type</label>
          <select
            name="water_type"
            value={form.water_type || 'Lake'}
            onChange={updateField}
          >
            {waterTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <label>External image URL</label>
      <input
        name="image_url"
        value={form.image_url || ''}
        onChange={updateField}
        placeholder="https://example.com/fish.jpg"
      />

      <label>Or upload local image</label>
      <input type="file" accept="image/*" onChange={uploadLocalImage} />
      {uploading && <p className="hint">Uploading image...</p>}

      <label>YouTube video URL</label>
      <input
        name="video_url"
        value={form.video_url || ''}
        onChange={updateField}
        placeholder="https://www.youtube.com/watch?v=..."
      />

      <label>Repost / reference another post ID</label>
      <input
        name="repost_id"
        value={form.repost_id || ''}
        onChange={updateField}
        placeholder="Example: 12"
      />

      {!initialValues.id && (
        <>
          <label>Secret key *</label>
          <input
            name="secret_key"
            value={form.secret_key}
            onChange={updateField}
            placeholder="Remember this to edit/delete"
          />
        </>
      )}

      <button type="submit">{submitLabel}</button>
    </form>
  );
}
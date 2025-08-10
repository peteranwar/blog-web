import { useState } from 'react';

export default function PostForm({ initialTitle = '', initialContent = '', onSubmit, submitLabel }) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError('All fields are required');
      return;
    }
    setError('');
    await onSubmit({ title, content });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div>
        <label className="block text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Content</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows="8"
          className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        {submitLabel}
      </button>
    </form>
  );
}

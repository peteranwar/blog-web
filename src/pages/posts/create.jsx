// pages/posts/create.js
import PostForm from '@/components/posts/PostForm';
import { useStore } from '@/store/useStore';
import { createPost } from '@/utils/api';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function CreatePost() {
  const { user } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/auth/login');
  }, [user, router]);

  if (!user) return <h6 className='text-center'>Redirecting...</h6>;

  const handleCreate = async ({ title, content }) => {
    try {
      await createPost(title, content);
      router.push('/posts');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
        <PostForm onSubmit={handleCreate} submitLabel="Create Post" />
      </div>
    </div>
  );
}

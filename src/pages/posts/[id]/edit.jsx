import PostForm from '@/components/posts/PostForm';
import { updatePost } from '@/utils/api';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function EditPost({ post: ssrPost, error, user }) {
    const router = useRouter();
    const { id } = router.query;

    const [post, setPost] = useState(ssrPost);

    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');

    // In Case there is an error on server-side rendering, show error message
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded shadow max-w-md w-full">
                    <h1 className="text-xl text-red-600 mb-4">Error</h1>
                    <p>{error}</p>
                    <Link href="/posts" className="text-blue-600 hover:underline mt-4 block">
                        ← Back to Posts
                    </Link>
                </div>
            </div>
        );
    }


    const handleSubmit = async ({title, content}) => {
        if (!title.trim() || !content.trim()) {
            setFormError('Title and content are required');
            return;
        }
        setLoading(true);
        setFormError('');

        try {
            await updatePost(id, title, content);
            router.push(`/posts/${id}`); // Redirect to post
        } catch (err) {
            setFormError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
                {formError && <p className="text-red-600 mb-4">{formError}</p>}
                {loading && <p>Loading...</p>}
                <PostForm
                    initialTitle={post.title}
                    initialContent={post.content}
                    onSubmit={handleSubmit}
                    submitLabel="Update Post"
                />
            </div>
        </div>
    );
}


export async function getServerSideProps(context) {
    const { id } = context.query;
  
    // 🔁 Simulate auth check
    // Since we use localStorage, we can't read it here
    // But we can expect client to handle it, or use cookies in real app
    // For now, just allow access — client will double-check
  
    try {
      // Fetch post from API
      const res = await fetch(`http://localhost:3000/api/posts/${id}`);
      if (!res.ok) {
        return {
          props: {
            error: 'Post not found',
            post: null
          }
        };
      }
  
      const data = await res.json();
      const post = data.post;


        // ✅ Pass post to client
    return {
        props: {
          post: JSON.parse(JSON.stringify(post)),
          error: null
        }
      };
    } catch (err) {
      console.error('Error in getServerSideProps:', err);
      return {
        props: {
          post: null,
          error: 'Failed to load post'
        }
      };
    }
  }
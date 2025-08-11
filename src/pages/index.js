import Link from 'next/link';

export default function HomePage({ posts, error }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-16 text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-6 leading-tight">
            Welcome to <span className="text-blue-600">Blog Platform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A modern blog platform where developers share ideas, learn from each other, and grow together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/posts" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full transition transform hover:scale-105">
                Read Posts
            </Link>
            <Link href="/auth/login" className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-full transition">
                Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Latest Posts Preview */}
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
          📰 Latest Posts
        </h2>

        {error ? (
          <div className="text-center py-10">
            <p className="text-red-600">Failed to load posts. Please try again later.</p>
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet. Be the first to write one!</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-3 mb-12">
            {posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`} className="block bg-white rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 border border-gray-100">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.content}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>By User {post.authorId}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link href="/posts" className="text-blue-600 hover:underline font-medium">
              → View all posts
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">✨ Features</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Write & Share</h3>
              <p className="text-gray-300">Create, edit, and publish your thoughts with a clean editor.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Comments</h3>
              <p className="text-gray-300">Engage with readers — see comments appear instantly.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">User Roles</h3>
              <p className="text-gray-300">Admins can manage all posts. Authors control their own.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-white border-t py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Start Writing?</h2>
          <p className="text-gray-600 mb-8">
            Join our community of developers and share your knowledge with the world.
          </p>
          <Link className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full inline-block transition" href="/auth/login">
              Create Your First Post
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    // Fetch posts from your API route
    const res = await fetch(`http://localhost:3000/api/posts?page=1&limit=3`);
    
    if (!res.ok) {
      console.error('API error:', await res.text());
      return {
        props: {
          posts: [],
          error: 'Failed to load posts'
        }
      };
    }

    const data = await res.json();

    return {
      props: {
        posts: data.posts || [],
        error: null
      }
    };
  } catch (err) {
    console.error('Server-side fetch failed:', err);
    return {
      props: {
        posts: [],
        error: 'Failed to connect to server'
      }
    };
  }
}
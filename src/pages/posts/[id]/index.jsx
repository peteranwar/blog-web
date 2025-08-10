// src/pages/posts/[id].js
import {
  addComment,
  getCommentsForPost,
  getLikes,
  toggleDislike,
  toggleLike
} from '@/utils/api';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function PostPage({ post: ssrPost }) {
  const [post, setPost] = useState(ssrPost);
  const [likes, setLikes] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [commentPage, setCommentPage] = useState(1); // Current page
  const [loadingComments, setLoadingComments] = useState(false);

  // Ref to prevent duplicate BroadcastChannel listeners
  const channelInitialized = useRef(false);

  console.log('postpostpost', ssrPost)


  // Load comments (with pagination)
  const loadComments = async (page = 1) => {
    setLoadingComments(true);
    try {
      const data = await getCommentsForPost(post.id, page, 5);
      setComments(prev => page === 1 ? data.comments : [...prev, ...data.comments]);
      setPagination({
        page: data.pagination.page,
        totalPages: data.pagination.totalPages,
        total: data.pagination.total
      });
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  // Load on mount and when post.id changes
  useEffect(() => {
    loadComments(1);
  }, [post.id]);

  // Load user and initial data on client
  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }


    // Load comments and likes
    const loadData = async () => {
      // try {
      //   const commentData = await getCommentsForPost(post.id);
      //   setComments(commentData);
      // } catch (err) {
      //   console.error('Failed to load comments:', err);
      // }

      try {
        const likesData = await getLikes('post', post.id);
        setLikes(likesData);
      } catch (err) {
        console.error('Failed to load likes:', err);
      }
    };

    loadData();
  }, [post.id]);

  // Real-time: New comments
  useEffect(() => {
    if (channelInitialized.current) return;
    channelInitialized.current = true;

    const channel = new BroadcastChannel('comments');
    channel.onmessage = (event) => {
      if (event.data.type === 'NEW_COMMENT' && event.data.comment.postId == post.id) {
        setComments(prev => [event.data.comment, ...prev]);
        setPagination(p => ({ ...p, total: p.total + 1 }));
      }
    };

    return () => channel.close();
  }, [post.id]);

  // Real-time: Update post if edited
  useEffect(() => {
    const channel = new BroadcastChannel('posts');
    channel.onmessage = (event) => {
      if (event.data.type === 'UPDATE_POST' && event.data.post.id == post.id) {
        setPost(event.data.post);
      }
    };

    return () => channel.close();
  }, [post.id]);

  // Handle new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    setLoading(true);

    try {
      await addComment(post.id, newComment);
      setNewComment('');
    } catch (err) {
      alert('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  // Handle like
  const handleLike = async () => {
    if (!currentUser) return;
    try {
      const updatedLikes = await toggleLike('post', post.id);

      console.log('updatedLikes', updatedLikes, post.id)
      setLikes(updatedLikes);
    } catch (err) {
      console.error('Like failed:', err);
      alert('Could not like the post.');
    }
  };

  // Handle dislike
  const handleDislike = async () => {
    if (!currentUser) return;
    try {
      const updatedLikes = await toggleDislike('post', post.id);
      setLikes(updatedLikes);
    } catch (err) {
      console.error('Dislike failed:', err);
      alert('Could not dislike the post.');
    }
  };

  // Calculate like/dislike counts
  const likeCount = likes && typeof likes === 'object'
    ? Object.values(likes).filter(v => v === 1).length
    : 0;

  const dislikeCount = likes && typeof likes === 'object'
    ? Object.values(likes).filter(v => v === -1).length
    : 0;

  console.log('likeCountlikeCount', likes)

  if (!post) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl text-gray-500">Post not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back Link */}
        <Link href="/posts" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to posts
        </Link>

        {/* Post Content */}
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-600 mb-6">
          By User {post.authorId} • {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <p className="text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>

        {/* Like/Dislike Buttons */}
        <div className="mt-6 flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={!currentUser}
            className={`px-4 py-1 cursor-pointer rounded-full flex items-center gap-1 ${currentUser
              ? 'bg-green-100 hover:bg-green-200'
              : 'opacity-50 cursor-not-allowed'
              } transition`}
          >
            👍 {likeCount}
          </button>
          <button
            onClick={handleDislike}
            disabled={!currentUser}
            className={`px-4 py-1 cursor-pointer rounded-full flex items-center gap-1 ${currentUser
              ? 'bg-red-100 hover:bg-red-200'
              : 'opacity-50 cursor-not-allowed'
              } transition`}
          >
            👎 {dislikeCount}
          </button>
        </div>

        {/* Comments Section */}
        <h3 className="text-2xl font-semibold mt-10 mb-4">Comments</h3>

        {/* Comment Form */}
        {!currentUser ? (
          <p className="text-gray-500 mb-6">
            Please{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              login
            </Link>{' '}
            to comment.
          </p>
        ) : (
          <form onSubmit={handleAddComment} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows="3"
              disabled={loading}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Add Comment'}
            </button>
          </form>
        )}

        {/* Comments List */}
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white p-4 mb-3 rounded shadow">
              <p className="whitespace-pre-wrap">{comment.content}</p>
              <small className="text-gray-500 block mt-1">
                By User {comment.authorId} • {new Date(comment.createdAt).toLocaleString()}
              </small>
            </div>
          ))
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => {
                if (commentPage > 1) {
                  const newPage = commentPage - 1;
                  setCommentPage(newPage);
                  loadComments(newPage);
                }
              }}
              disabled={commentPage === 1 || loadingComments}
              className="px-3 py-1 border rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>

            <span className="px-2">
               {commentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => {
                if (commentPage < pagination.totalPages) {
                  const newPage = commentPage + 1;
                  setCommentPage(newPage);
                  loadComments(newPage);
                }
              }}
              disabled={commentPage === pagination.totalPages || loadingComments}
              className="px-3 py-1 border rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Fetch post from API on server
export async function getServerSideProps({ query }) {
  const { id } = query;

  try {
    const res = await fetch(`http://localhost:3000/api/posts/${id}`);

    if (!res.ok) {
      return { notFound: true };
    }

    const data = await res.json();
    const post = data.post;

    return {
      props: {
        post: JSON.parse(JSON.stringify(post)), // Safe serialization
      },
    };
  } catch (err) {
    console.error('Error fetching post:', err);
    return { notFound: true };
  }
}
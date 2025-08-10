import { deletePost } from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PostsPage = ({ posts, page, totalPages }) => {

    const [currentUser, setCurrentUser] = useState(null);
    console.log('postsposts posts', page, totalPages);
    const router = useRouter();

    useEffect(() => {
        // Load user from localStorage
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }


    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>

                {/* In case If no posts found, show message instead of empty page */}
                {!posts.length && (
                    <div className="text-center py-12">
                        <p className="text-xl font-bold">No posts found</p>
                        <p className="text-gray-600 mb-6">Create a new post to get started.</p>
                        <Link href="/posts/create" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Create Post
                        </Link>
                    </div>
                )}


                {posts.map(post => (
                    <div key={post.id} className="bg-white p-6 mb-4 rounded-lg shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="">
                            <h2 className="text-xl font-semibold">
                                <Link href={`/posts/${post.id}`}>
                                    {post.title}
                                </Link>
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">
                                By User {post.authorId} • {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        {currentUser && (currentUser.id === post.authorId || currentUser.role === 'admin') && (
                            <div className="flex space-x-2 ">
                                <Link href={`/posts/${post.id}/edit`} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-center min-w-25">
                                    Edit
                                </Link>
                                <button
                                    onClick={async () => {
                                        if (confirm('Delete this post?')) {
                                            await deletePost(post.id);
                                            router.push('/posts');
                                        }
                                    }}
                                    className="bg-red-500 text-white px-4 py-2 cursor-pointer rounded hover:bg-red-600 text-center min-w-25"
                                >
                                    Delete
                                </button>
                            </div>
                        )}

                    </div>
                ))}

                <div className="flex justify-center space-x-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <Link key={i + 1} href={`/posts?page=${i + 1}`} className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                            }`}>
                            {i + 1}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PostsPage;


// export async function getServerSideProps(context) {
//     const { query } = context;
//     const page = parseInt(query.page) || 1;
//     const limit = 5;
//     const allPosts = getPosts();
//     const total = allPosts.length;
//     const totalPages = Math.ceil(total / limit);
//     const start = (page - 1) * limit;
//     const posts = allPosts.slice(start, start + limit);
//     console.log('postsposts',getPosts())

//     return {
//       props: {
//         posts: JSON.parse(JSON.stringify(posts)),
//         page,
//         totalPages
//       }
//     };
//   }

export async function getServerSideProps(context) {
    const { query } = context;
    const page = query.page || 1;
    const limit = 5;

    // Fetch from API Route (runs on server!)
    const res = await fetch(`http://localhost:3000/api/posts?page=${page}&limit=${limit}`);
    const data = await res.json();

    return {
        props: {
            posts: data.posts,
            page: data.page,
            totalPages: data.totalPages,
        },
    };
}
// __tests__/features/postCRUD.test.js
import {
    createPost,
    deletePost,
    getPosts,
    updatePost
} from '../../src/utils/api';
  
  // Mock localStorage
  const mockLocalStorage = {
    store: {},
    getItem(key) { return this.store[key]; },
    setItem(key, value) { this.store[key] = String(value); },
    clear() { this.store = {}; }
  };
  Object.defineProperty(window, 'localStorage', { value: mockLocalStorage, writable: true });
  
  // Mock fetch
  global.fetch = jest.fn();
  
  // Helper to reset mocks
  const resetMocks = () => {
    fetch.mockClear();
    mockLocalStorage.clear();
  };
  
  // Mock user login
  const mockLogin = () => {
    const user = { id: 1, username: 'user', role: 'user' };
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  };
  
  beforeEach(() => {
    resetMocks();
    mockLogin();
  });
  
  afterAll(() => {
    jest.restoreAllMocks();
  });
  
  // ✅ Test: Get Posts
  test('can fetch posts from API', async () => {
    const mockResponse = {
      posts: [
        { id: 1, title: 'First', content: 'Hello', authorId: 1, createdAt: '2025-04-05' }
      ],
      total: 1,
      page: 1,
      totalPages: 1
    };
  
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });
  
    const data = await getPosts();
  
    expect(fetch).toHaveBeenCalledWith('/api/posts');
    expect(data).toEqual(mockResponse);
  });
  
  // ✅ Test: Create Post
  test('can create a new post via API', async () => {
    const mockPost = {
      id: 123,
      title: 'New Post',
      content: 'Content',
      authorId: 1,
      createdAt: '2025-04-05T10:00:00Z'
    };
  
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPost
    });
  
    const post = await createPost('New Post', 'Content');
  
    expect(fetch).toHaveBeenCalledWith('/api/posts/create', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'New Post',
        content: 'Content',
        authorId: 1
      })
    }));
  
    expect(post.title).toBe('New Post');
    expect(post.id).toBe(123);
  });
  
  // ✅ Test: Update Post
  test('can update a post via API', async () => {
    const updatedData = {
      id: 123,
      title: 'Updated Title',
      content: 'Updated Content'
    };
  
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedData
    });
  
    const post = await updatePost(123, 'Updated Title', 'Updated Content');
  
    expect(fetch).toHaveBeenCalledWith('/api/posts/123', expect.objectContaining({
      method: 'PUT',
      body: expect.stringContaining('Updated Title')
    }));
  
    expect(post.title).toBe('Updated Title');
  });
  
  // ✅ Test: Delete Post
  test('can delete a post via API', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Post deleted' })
    });
  
    await deletePost(123);
  
    expect(fetch).toHaveBeenCalledWith('/api/posts/123', expect.objectContaining({
      method: 'DELETE'
    }));
  });
  
  // ✅ Test: Handle API Error
  test('throws error if API fails to create post', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed to create' })
    });
  
    await expect(createPost('Fail', 'Content')).rejects.toThrow('Failed to create post');
  });
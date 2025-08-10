import db from '../data/db';

export const login = (username, password) => {
  const user = db.users.find(u => u.username === username && u.password === password);
  if (!user) return null;

  const fakeToken = btoa(JSON.stringify({
    userId: user.id,
    role: user.role,
    exp: Date.now() + 3600000 // 1 hour
  }));

  localStorage.setItem('token', fakeToken);
  localStorage.setItem('currentUser', JSON.stringify(user));
  return user;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded = JSON.parse(atob(token.split('.')[0]));
    return decoded.exp > Date.now();
  } catch (e) {
    return false;
  }
};

export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || 'guest';
};
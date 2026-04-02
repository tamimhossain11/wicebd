import api from './index';

// Unified login — works for both regular users (email) and admins (username)
export const unifiedLogin = (emailOrUsername, password) =>
  api.post('/api/user-auth/login', { email: emailOrUsername, password });

// User-only endpoints
export const signUp = (name, email, password) =>
  api.post('/api/user-auth/signup', { name, email, password });

export const googleLogin = (credential) =>
  api.post('/api/user-auth/google', { credential });

export const facebookLogin = (accessToken, userID) =>
  api.post('/api/user-auth/facebook', { accessToken, userID });

export const getMyProfile = () =>
  api.get('/api/user-auth/profile');

export const getMyRegistrations = () =>
  api.get('/api/user-auth/my-registrations');

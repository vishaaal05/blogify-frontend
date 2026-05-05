// API Configuration
// export const API_BASE_URL = "https://blogify-backend-sxn5.onrender.com";
export const API_BASE_URL = "http://localhost:6002";
export const API_VERSION = "v1/api";

export const API_ENDPOINTS = {
  // Posts
  POSTS: `${API_BASE_URL}/${API_VERSION}/posts`,
  POSTS_CREATE: `${API_BASE_URL}/${API_VERSION}/posts/create`,
  POSTS_UPLOAD: `${API_BASE_URL}/${API_VERSION}/upload`,

  // Categories
  CATEGORIES: `${API_BASE_URL}/${API_VERSION}/categories`,
  CATEGORIES_ADD_POST: `${API_BASE_URL}/${API_VERSION}/categories/add/post`,

  // Auth
  LOGIN: `${API_BASE_URL}/${API_VERSION}/users/login`,
  REGISTER: `${API_BASE_URL}/${API_VERSION}/users/register`,

  // Comments
  COMMENTS: `${API_BASE_URL}/${API_VERSION}/comments`,

  // Likes
  LIKES_TOGGLE: `${API_BASE_URL}/${API_VERSION}/likes/toggle`,

  // Favorites
  FAVORITES_TOGGLE: `${API_BASE_URL}/${API_VERSION}/favorites/toggle`,
};

export const getEndpoint = (path) => `${API_BASE_URL}${path}`;

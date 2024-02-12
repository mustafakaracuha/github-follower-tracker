import axios from "axios";

  const API_URL = import.meta.env.VITE_APP_API_URL
  const GITHUB_TOKEN = import.meta.env.VITE_APP_GITHUB_TOKEN

  const config = {
    headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
  };

  export const getFollowers = (username, page) => {
    return axios.get(`${API_URL}/users/${username}/followers?per_page=100&page=${page}`, config);
  };

  export const getFollowing = (username, page) => {
    return axios.get(`${API_URL}/users/${username}/following?per_page=100&page=${page}`, config);
  };

  export const getMyProfile = (username) => {
    return axios.get(`${API_URL}/users/${username}`, config);
  };


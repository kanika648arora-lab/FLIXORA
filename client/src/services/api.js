// FLIXORA API Client
const API_BASE = '/api';

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async register(name, email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return res.json();
  },

  async getMe(token) {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  // Movies
  async getHeroMovie() {
    const res = await fetch(`${API_BASE}/movies/featured/hero`);
    return res.json();
  },

  async getAllSections(token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE}/movies/sections/all`, { headers });
    return res.json();
  },

  async getMovies(query = {}) {
    const params = new URLSearchParams(query);
    const res = await fetch(`${API_BASE}/movies?${params.toString()}`);
    return res.json();
  },

  async getMovieById(id) {
    const res = await fetch(`${API_BASE}/movies/${id}`);
    return res.json();
  },

  // My List
  async getMyList(token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE}/my-list`, { headers });
    return res.json();
  },

  async addToMyList(movieId, token) {
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    const res = await fetch(`${API_BASE}/my-list`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ movieId })
    });
    return res.json();
  },

  async removeFromMyList(movieId, token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE}/my-list/${movieId}`, {
      method: 'DELETE',
      headers
    });
    return res.json();
  },

  // Watch History
  async getWatchHistory(token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE}/watch-history`, { headers });
    return res.json();
  },

  async saveWatchProgress(data, token) {
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    const res = await fetch(`${API_BASE}/watch-history`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Profiles
  async getProfiles() {
    const res = await fetch(`${API_BASE}/profiles`);
    return res.json();
  },

  async selectProfile(profileId, token) {
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    const res = await fetch(`${API_BASE}/profiles/select`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ profileId })
    });
    return res.json();
  }
};

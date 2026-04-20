const BASE_URL          = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const ADMIN_KEY         = process.env.NEXT_PUBLIC_ADMIN_KEY || '';
const CLOUDINARY_CLOUD  = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

/**
 * Public fetch — no auth headers. Used for read-only endpoints.
 */
export async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.message || `Request failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }

  return res.json();
}

/**
 * Admin fetch — attaches the x-admin-key header. Used for write endpoints.
 */
export async function adminFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'x-admin-key': ADMIN_KEY,
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.message || `Request failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }

  return res.json();
}

// ── Blogs helpers ─────────────────────────────────────────────────────────────

/** Fetch all blog posts. */
export function fetchAllBlogs() {
  return apiFetch('/api/blogs');
}

/** Create a new blog post. */
export function createBlog(payload) {
  return adminFetch('/api/blogs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** Update an existing blog post by id. */
export function updateBlog(id, payload) {
  return adminFetch(`/api/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

/** Delete a blog post by id. */
export function deleteBlog(id) {
  return adminFetch(`/api/blogs/${id}`, { method: 'DELETE' });
}

/**
 * Upload a cover image directly to Cloudinary (unsigned).
 * Returns the secure CDN URL string.
 */
export async function uploadBlogImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error?.message || `Upload failed: ${res.status}`);
  }

  const data = await res.json();
  return { url: data.secure_url };
}

// ── Contacts helpers ──────────────────────────────────────────────────────────

/** Fetch all contact form submissions. */
export function fetchAllContacts() {
  return adminFetch('/api/contact');
}

/** Mark a contact as read or unread. */
export function setContactRead(id, read) {
  return adminFetch(`/api/contact/${id}/read`, {
    method: 'PATCH',
    body: JSON.stringify({ read }),
  });
}

/** Delete a contact submission. */
export function deleteContact(id) {
  return adminFetch(`/api/contact/${id}`, { method: 'DELETE' });
}

// ── Blocks helpers ────────────────────────────────────────────────────────────

/** Fetch all blocks from the backend. */
export function fetchAllBlocks() {
  return apiFetch('/api/blocks');
}

/** Replace a block's data. */
export function updateBlock(section, data) {
  return adminFetch(`/api/blocks/${section}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
}

/** Toggle a block's enabled flag. */
export function setBlockVisibility(section, enabled) {
  return adminFetch(`/api/blocks/${section}/visibility`, {
    method: 'PATCH',
    body: JSON.stringify({ enabled }),
  });
}

// ── Auth helpers ──────────────────────────────────────────────────────────────

function getToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('ctg_admin_token') || '';
}

export function loginApi(email, password) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function registerApi(name, email, password) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function getMeApi() {
  return fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(async (res) => {
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  });
}

// ── Users helpers ─────────────────────────────────────────────────────────────

export function fetchAllUsers() {
  return fetch(`${BASE_URL}/api/users`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then((r) => r.json());
}

export function fetchPendingUsers() {
  return fetch(`${BASE_URL}/api/users/pending`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then((r) => r.json());
}

export function approveUser(id) {
  return fetch(`${BASE_URL}/api/users/${id}/approve`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then((r) => r.json());
}

export function rejectUser(id) {
  return fetch(`${BASE_URL}/api/users/${id}/reject`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then((r) => r.json());
}

export function deleteUser(id) {
  return fetch(`${BASE_URL}/api/users/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then((r) => r.json());
}

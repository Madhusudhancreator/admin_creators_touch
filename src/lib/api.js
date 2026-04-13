const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || '';

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

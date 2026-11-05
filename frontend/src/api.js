// All communication with the backend lives in this file.
// Components never call fetch() themselves; they call these functions.

// Vite exposes variables that start with VITE_ as import.meta.env.VITE_*.
// They are baked into the built JavaScript, so never put secrets in them.
const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

// An Error that also remembers the HTTP status (404, 400, ...), so pages can react to it.
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, { body, ...options } = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      // Only requests that carry a JSON body get the JSON header.
      ...(body !== undefined && {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    });
  } catch {
    // fetch() only throws when no response arrived at all (server down, wrong URL, CORS block).
    throw new ApiError(`Cannot reach the API at ${BASE_URL}. Is the server running?`, 0);
  }

  // DELETE returns 204 No Content: there is no body to parse.
  if (response.status === 204) return null;

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // The response had no JSON body; payload stays null.
  }

  if (!response.ok) {
    // The backend answers errors as { error: "message" }, so show that message.
    throw new ApiError(payload?.error ?? `Request failed with status ${response.status}`, response.status);
  }
  return payload;
}

export const listTickets = (status) =>
  request(status ? `/tickets?status=${encodeURIComponent(status)}` : '/tickets');

export const getTicket = (id) => request(`/tickets/${id}`);

export const createTicket = (data) => request('/tickets', { method: 'POST', body: data });

export const updateTicket = (id, changes) =>
  request(`/tickets/${id}`, { method: 'PATCH', body: changes });

export const deleteTicket = (id) => request(`/tickets/${id}`, { method: 'DELETE' });

export const listComments = (ticketId) => request(`/tickets/${ticketId}/comments`);

export const createComment = (ticketId, body) =>
  request(`/tickets/${ticketId}/comments`, { method: 'POST', body: { body } });
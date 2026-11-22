const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const payload =
    response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(payload?.message || `Request failed (${response.status})`);
  return payload;
}
export const api = {
  tasks: (params = {}) => request(`/tasks?${new URLSearchParams(params)}`),
  stats: () => request("/tasks/stats"),
  get: (id) => request(`/tasks/${id}`),
  create: (data) =>
    request("/tasks", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
};

import api from "./axios";

/** Backend route: GET /api/health (see server/server.js) — not /health */
export const HEALTH_PATH = "/api/health";

/**
 * @returns {Promise<{ ok: boolean, db: string }>}
 */
export const checkApiHealth = async () => {
  const { data } = await api.get(HEALTH_PATH, { timeout: 5000 });
  return data;
};

/**
 * Classify axios failures for user-facing messages (no backend changes).
 */
export const getApiReachabilityMessage = async (err) => {
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }
  if (err?.response) {
    return `API error (${err.response.status})`;
  }
  if (!err?.request) {
    return "Request failed";
  }

  try {
    await checkApiHealth();
    return "API is reachable but this request failed. Check your login or try again.";
  } catch (healthErr) {
    if (healthErr?.response) {
      return `API error (${healthErr.response.status})`;
    }
  }

  const base = import.meta.env.DEV && !import.meta.env.VITE_API_URL?.trim()
    ? "same-origin /api proxy → localhost:5000"
    : import.meta.env.VITE_API_URL?.trim() || "http://localhost:5000";

  return `Cannot reach API at ${base} — is the backend running on port 5000?`;
};

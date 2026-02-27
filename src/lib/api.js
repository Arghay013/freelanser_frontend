const BASE =
  import.meta.env.VITE_API_BASE ||
  import.meta.env.VITE_API_BASE_URL ||
  "";

function getAccess() {
  return localStorage.getItem("access") || "";
}

function getRefresh() {
  return localStorage.getItem("refresh") || "";
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractErrorMessage(data, status) {
  if (!data) return `Request failed (${status})`;

  // common DRF
  if (typeof data === "object") {
    if (data.detail) return data.detail;
    if (data.message) return data.message;

    // field errors: {username:["..."], email:["..."]}
    const firstKey = Object.keys(data)[0];
    if (firstKey) {
      const v = data[firstKey];
      if (Array.isArray(v)) return `${firstKey}: ${v[0]}`;
      if (typeof v === "string") return `${firstKey}: ${v}`;
      return `${firstKey}: ${JSON.stringify(v)}`;
    }
    return JSON.stringify(data);
  }

  if (typeof data === "string") return data;
  return `Request failed (${status})`;
}

async function request(path, options = {}) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;

  const headers = { ...(options.headers || {}) };

  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers["Content-Type"] && !headers["content-type"]) {
    headers["Content-Type"] = "application/json";
  }

  const token = getAccess();
  if (token && !headers.Authorization && options.auth !== false) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });

  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();
  const data = contentType.includes("application/json")
    ? safeJsonParse(text)
    : text;

  if (!res.ok) {
    const err = new Error(extractErrorMessage(data, res.status));
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

async function requestWithRefresh(path, options = {}) {
  try {
    return await request(path, options);
  } catch (err) {
    const canRefresh =
      err?.status === 401 &&
      options.auth !== false &&
      getRefresh() &&
      !String(path).includes("/api/auth/token/refresh/");

    if (!canRefresh) throw err;

    const refreshed = await request("/api/auth/token/refresh/", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ refresh: getRefresh() }),
    });

    if (refreshed?.access) localStorage.setItem("access", refreshed.access);

    return await request(path, options);
  }
}

export async function api(path, options = {}) {
  return requestWithRefresh(path, options);
}
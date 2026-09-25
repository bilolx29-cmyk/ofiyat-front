const baseUrl = (import.meta.env.VITE_BASE_URL || "").replace(/\/+$/, "");

export const apiUrl = (path: string) =>
    `${baseUrl}/${path.replace(/^\/+/, "")}`;
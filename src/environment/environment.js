export const Environment = {
  baseUrl: import.meta.env.VITE_URL_API || "https://api.github.com",
  token: import.meta.env.VITE_GITHUB_TOKEN || "",
};

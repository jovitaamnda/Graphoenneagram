import axios from "axios";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

console.log("API BASE URL:", apiUrl);

const client = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // ⬅️ WAJIB untuk cookie auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Tambahkan Request Interceptor untuk menyisipkan token otomatis
client.interceptors.request.use(
  (config) => {
    // Cek apakah di environment browser (client-side)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Terjadi kesalahan";

    return Promise.reject(new Error(message));
  }
);

export default client;

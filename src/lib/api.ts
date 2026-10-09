// src/lib/api.ts
import "server-only";
import axios from "axios";

/** Cliente hacia el backend. Solo se usa en el servidor (BFF), nunca en el navegador. */
export const api = axios.create({
    baseURL: process.env.API_URL,
    headers: { "Content-Type": "application/json" },
});

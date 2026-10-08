// src/lib/bff.ts
import axios from "axios";

/**
 * Cliente del navegador hacia el BFF (las rutas /api de Next).
 * Los interceptores (lib/interceptors.ts) le agregan el token y manejan el refresh.
 * No lleva Content-Type por defecto: axios pone JSON para objetos y el navegador pone el boundary en FormData.
 */
export const bff = axios.create({ baseURL: "/api" });

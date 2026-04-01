import axios from "axios";
import config from "../../config";
import { store } from "./../../redux/store";

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export type PresencePayload = {
  id_utilisateur: number;
  date_presence: string;
  datetime?: string;
  source?: "MANUEL" | "TERMINAL" | "API";
  device_sn?: string;
  terminal_id?: number;
  permissions?: string[];
};

export const postPresence = async (data: PresencePayload) => {
  return axios.post(`${DOMAIN}/api/presence`, data);
};

const api = axios.create({
  baseURL: config.REACT_APP_SERVER_DOMAIN,
});

// Ajouter le token automatiquement
api.interceptors.request.use(
  async (config) => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;

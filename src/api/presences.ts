import axios from "axios";

const DOMAIN = "https://apidlog.loginsmart-cd.com";

type PresencePayload = {
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
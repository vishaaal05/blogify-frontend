import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

export const exchangeGoogleCredential = async (credential, flow) => {
  const response = await axios.post(API_ENDPOINTS.GOOGLE_AUTH, {
    credential,
    flow,
  });

  return response.data;
};

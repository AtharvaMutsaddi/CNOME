import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:6969",
});

export const getCachedAnalytics = async (file: File, analyticsType: string) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("analyticsType", analyticsType);
    const response = await instance.post("/query", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postCachedAnalytics = async (
  file: File,
  analyticsType: string,
  analytics: string
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("analyticsType", analyticsType);
    formData.append("analytics", analytics);
    const response = await instance.post("/insert", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

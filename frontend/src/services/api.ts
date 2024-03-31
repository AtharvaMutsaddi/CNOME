import axios from "axios";
import { getCachedAnalytics, postCachedAnalytics } from "./cache";
import generateHash from "./hashgene";
const instance = axios.create({
  baseURL: "http://localhost:1234",
});

export const uploadFileMutations = async (file: File) => {
  try {
    try {
      const cachedResponse = await getCachedAnalytics(file, "Mutation");
      if (cachedResponse.analytics) {
        return cachedResponse.analytics;
      }
    } catch (error) {
      throw error;
    }
    const formData = new FormData();
    formData.append("file", file);
    const response = await instance.post("/mutations", formData);
    //insert new record into db;
    const analytics = JSON.stringify(response.data);
    try {
      const postResponse = await postCachedAnalytics(
        file,
        "Mutation",
        analytics
      );
    } catch (error) {
      throw error;
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const uploadFileSim = async (file1: File, file2: File) => {
  try {
    const file2content = await file2.text();
    const file2hash = generateHash(file2content);
    try {
      const cachedResponse = await getCachedAnalytics(
        file1,
        `Simi${file2hash}`
      );
      if (cachedResponse.analytics) {
        return cachedResponse.analytics;
      }
    } catch (error) {
      throw error;
    }
    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);
    const response = await instance.post("/sim", formData);
    const analytics = JSON.stringify(response.data);
    try {
      const postResponse = await postCachedAnalytics(
        file1,
        `Simi${file2hash}`,
        analytics
      );
    } catch (error) {
      throw error;
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const uploadFileKMer = async (file: File, kmerSize: number) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await instance.post(`/kmer/${kmerSize}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

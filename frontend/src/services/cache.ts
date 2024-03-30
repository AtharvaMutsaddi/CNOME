import axios from "axios";
import * as XXH from 'xxhashjs'; 

function generateHash(data: string): string {
  const hash = XXH.h32(0xabcd); // Initialize with seed 0xabcd
  hash.update(data);
  return hash.digest().toString(16); // Convert to hexadecimal string
}

const instance = axios.create({
  baseURL: "http://localhost:6969",
});


export const getCachedAnalytics = async (file: File, analyticsType: string) => {
  try {
    const filecontent=await file.text();
    const hashedFileContent=generateHash(filecontent);
    const req={
      "file":hashedFileContent,
      "analyticsType":analyticsType
    }
    const response = await instance.post("/query", req);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postCachedAnalytics = async (
  file: File,
  analyticsType: string,
  analytics: any
) => {
  try {
    const filecontent=await file.text();
    const hashedFileContent=generateHash(filecontent);
    const req={
      "file":hashedFileContent,
      "analyticsType":analyticsType,
      "analytics":analytics
    }
    const response = await instance.post("/insert", req);
    return response.data;
  } catch (error) {
    throw error;
  }
};

import axios from "axios";
import { getCachedAnalytics, postCachedAnalytics } from "./cache";

const instance = axios.create({
  baseURL: "http://localhost:1234",
});

export const uploadFileMutations = async (file:File)=>{
  try {
    try {
      const cachedResponse=await getCachedAnalytics(file,"Mutation");
      console.log("cached response:",cachedResponse);
      if(cachedResponse.analytics){
        console.log("Successfully got cached analytics:",cachedResponse.analytics);
        return cachedResponse.analytics;
      }
    } catch (error) {
      throw error;
    }
    console.log("Cannot find in cache...")
    const formData = new FormData();
    formData.append("file", file);
    const response = await instance.post('/mutations',formData)
    //insert new record into db;
    let analytics:string;
    analytics=JSON.stringify(response.data);
    try {
      const postResponse=await postCachedAnalytics(file,"Mutation",analytics);
      console.log(postResponse);
    } catch (error) {
      throw error;
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const uploadFileSim = async (file1:File,file2:File)=>{
  try {
    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);
    const response = await instance.post('/sim',formData)
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const uploadFileKMer = async (file:File,kmerSize:number)=>{
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await instance.post(`/kmer/${kmerSize}`,formData)
    return response.data;
  } catch (error) {
    throw error;
  }
}
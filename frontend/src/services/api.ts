import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:1234",
});

export const uploadFileMutations = async (file:File)=>{
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await instance.post('/mutations',formData)
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const uploadFileKMer = async (file:File)=>{
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await instance.post('/kmer',formData)
    return response.data;
  } catch (error) {
    throw error;
  }
}
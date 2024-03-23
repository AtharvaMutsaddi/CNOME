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
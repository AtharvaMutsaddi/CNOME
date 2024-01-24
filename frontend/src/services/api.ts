import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:1234",
});

export const uploadFile = async (file:File)=>{
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await instance.post('/upload',formData)
    return response.data;
  } catch (error) {
    throw error;
  }
}
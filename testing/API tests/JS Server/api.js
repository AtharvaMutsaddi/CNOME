const axios = require("axios");

const instance = axios.create({
  baseURL: "http://localhost:1412",
});

const uploadFileMutations = async (file) => {
  try {
    // console.log(file)
    const formData = new FormData();
    formData.append("file", file);
    const response = await instance.post("/mutations", formData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const uploadFileSim = async (file1, file2) => {
  try {
    
    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);
    const response = await instance.post("/sim", formData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const uploadFileKMer = async (file, kmerSize) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await instance.post(`/kmer/${kmerSize}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = { uploadFileMutations, uploadFileSim, uploadFileKMer };

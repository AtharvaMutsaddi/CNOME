import axios from "axios";
import { getCachedAnalytics, postCachedAnalytics } from "./cache";
import generateHash from "./hashgene";
const instance = axios.create({
  baseURL: "http://localhost:1234",
});
const nonUTF8Extensions = [
  "exe",
  "dll",
  "jpg", "jpeg",
  "png",
  "gif",
  "mp3",
  "mp4",
  "avi",
  "zip",
  "rar",
  "tar",
  "gz",
  "pdf",
  "docx",
  "xlsx",
  "pptx",
  "xls",
  "ppt",
  "doc",
  "bin",
  "dat",
  "wav",
  "flac",
  "ogg",
  "tif", "tiff"
];

export const uploadFileMutations = async (file: File) => {
  const fileName=file.name;
  const file_name_split=fileName.split(".")
  const file_ext=file_name_split[file_name_split.length-1]

  if(nonUTF8Extensions.includes(file_ext.toLowerCase())){
    const errMsg={error:"invalid file type detected. Please upload filetype which is utf-8 encoded. Example: .txt,.plain files etc"}
    return errMsg
  }
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
  const fileName=file1.name;
  const file_name_split=fileName.split(".")
  const file_ext=file_name_split[file_name_split.length-1]
  const fileName2=file2.name;
  const file_name_split2=fileName2.split(".")
  const file_ext2=file_name_split[file_name_split2.length-1]
  if(nonUTF8Extensions.includes(file_ext.toLowerCase()) || nonUTF8Extensions.includes(file_ext2.toLowerCase())){
    const errMsg={error:"invalid file type detected. Please upload filetype which is utf-8 encoded. Example: .txt,.plain files etc"}
    return errMsg
  }
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
  const fileName=file.name;
  const file_name_split=fileName.split(".")
  const file_ext=file_name_split[file_name_split.length-1]

  if(nonUTF8Extensions.includes(file_ext.toLowerCase())){
    const errMsg={error:"invalid file type detected. Please upload filetype which is utf-8 encoded. Example: .txt,.plain files etc"}
    return errMsg
  }
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await instance.post(`/kmer/${kmerSize}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

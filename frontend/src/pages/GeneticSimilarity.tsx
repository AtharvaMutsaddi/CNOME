import React, { useRef, useState } from "react";
import { Button, Container, Typography, Input, TextField } from "@mui/material";
import { uploadFileSim as uploadFile } from "../services/api";
const GeneticSimilarity = () => {
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const [sim, setSim] = useState<any>(null);
  const handleUploadFile = async () => {
    const file1 = fileInputRef1.current?.files?.[0];
    const file2 = fileInputRef2.current?.files?.[0];
    if (file1 && file2) {
      try {
        // Assuming your uploadFile function supports passing kmerSize as an argument
        const resp = await uploadFile(file1, file2);
        setSim(resp);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  return (
    <div>
      <Typography variant="h3" gutterBottom>
        KMer Analysis
      </Typography>
      <Input
        type="file"
        inputRef={fileInputRef1}
        style={{ blockSize: "3rem" }}
      />
      <br />
      <Input
        type="file"
        inputRef={fileInputRef2}
        style={{ blockSize: "3rem" }}
      />
      <Button variant="contained" onClick={handleUploadFile}>
        Upload
      </Button>
      {
        sim &&
        <>
          <div>similarity mil gaya bhai</div>
        </>
      }
    </div>
  );
};

export default GeneticSimilarity;

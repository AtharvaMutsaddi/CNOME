import React, { useRef, useState } from "react";
import { Button, Container, Typography, Input, TextField } from "@mui/material";
import { uploadFileKMer as uploadFile } from "../services/api";
import KMerResponse from "../response-models/KMerResponse";
import KMerAnalyticsDashboard from "../components/KMerAnalyticsDashboard";

const KMerAnalytics: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analysis, setAnalysis] = useState<KMerResponse | null>(null);
  const [kmerSize, setKmerSize] = useState<number>(0);

  const handleUploadFile = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      try {
        const resp = await uploadFile(file, kmerSize);
        setAnalysis(resp);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      <Container>
        <Typography variant="h3" gutterBottom>
          KMer Analysis
        </Typography>
        <Input type="file" inputRef={fileInputRef} style={{ blockSize: "3rem" }} />
        <TextField
          label="Size of KMers"
          type="number"
          value={kmerSize}
          onChange={(e) => setKmerSize(Number(e.target.value))}
          style={{ blockSize: "3rem", margin: "1rem 0" }}
        />
        <Button variant="contained" onClick={handleUploadFile}>
          Upload
        </Button>
      </Container>
      {analysis && <KMerAnalyticsDashboard data={analysis} />}
    </>
  );
};

export default KMerAnalytics;

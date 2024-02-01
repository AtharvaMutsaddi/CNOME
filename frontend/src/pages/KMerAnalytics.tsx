import React, { useRef, useState } from "react";
import { Button, Container, Typography, Input } from "@mui/material";
import { uploadFileKMer as uploadFile } from "../services/api";
import KMerResponse from "../response-models/KMerResponse";
import KMerAnalyticsDashboard from "../components/KMerAnalyticsDashboard";

const KMerAnalytics: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analysis, setAnalysis] = useState<KMerResponse | null>(null);

  const handleuploadFile = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      try {
        const resp = await uploadFile(file);
        setAnalysis(prevData=>{
          return resp;
        });
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
        <Button variant="contained" onClick={handleuploadFile}>
          Upload
        </Button>
      </Container>
      {analysis && <KMerAnalyticsDashboard data={analysis} />}
    </>
  );
};

export default KMerAnalytics;


// src/pages/KMerAnalytics.tsx
import React, { useRef, useState } from "react";
import { Button, Container, Typography, Input } from "@mui/material";
import { uploadFileKMer as uploadFile } from "../services/api";
import MutationResponse from "../response-models/MutationResponse";

const KMerAnalytics: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analysis, setAnalysis] = useState<MutationResponse | null>(null);
  const handleuploadFile = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      try {
        const resp = await uploadFile(file);
        setAnalysis((prevAnalysis) => {
          console.log(resp);
          return resp;
        });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        KMer Analysis
      </Typography>
      <Input
        type="file"
        inputRef={fileInputRef}
        style={{ blockSize: "3rem" }}
      />
      <Button variant="contained" onClick={handleuploadFile}>
        Upload
      </Button>
    </Container>
  );
};

export default KMerAnalytics;

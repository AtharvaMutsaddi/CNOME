// src/pages/MutationDetection.tsx
import React, { useRef } from "react";
import { Button, Container, Typography, Input, Box } from "@mui/material";
import { uploadFile } from "../services/api";

const MutationDetection: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleuploadFile = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      try {
        const resp = await uploadFile(file);
        console.log(resp);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Mutation Detection
      </Typography>
      <Input type="file" inputRef={fileInputRef} />
      <Button variant="contained" onClick={handleuploadFile}>
        Upload
      </Button>
    </Container>
  );
};

export default MutationDetection;

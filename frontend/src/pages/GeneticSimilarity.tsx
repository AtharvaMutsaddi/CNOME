import React, { useRef, useState } from "react";
import { Button, Card, Container, Input, Typography } from "@mui/material";
import { uploadFileSim as uploadFile } from "../services/api";
import { Barplot } from "../components/Barplot";

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
    <Container maxWidth="md">
      <Card elevation={3} style={{ padding: 20, marginBottom: 20 }}>
        <Typography variant="h3" gutterBottom>
          Upload Files
        </Typography>
        <Input
          type="file"
          inputRef={fileInputRef1}
          style={{ blockSize: "3rem", marginBottom: 10 }}
        />
        <br />
        <Input
          type="file"
          inputRef={fileInputRef2}
          style={{ blockSize: "3rem", marginBottom: 10 }}
        />
        <br />
        <Button variant="contained" onClick={handleUploadFile}>
          Upload
        </Button>
      </Card>

      {sim && (
        <div style={{ padding: 20}}>
          <Typography variant="h3" gutterBottom>
            Similarity Barplot
          </Typography>
          <Barplot width={800} height={500} data={sim} />
        </div>
      )}
    </Container>
  );
};

export default GeneticSimilarity;

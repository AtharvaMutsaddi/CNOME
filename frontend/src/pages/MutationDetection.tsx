// src/pages/MutationDetection.tsx
import React, { useRef, useState } from "react";
import { Button, Container, Typography, Input, Card } from "@mui/material";
import { uploadFileMutations as uploadFile } from "../services/api";
import MutationResponse from "../response-models/MutationResponse";

const MutationDetection: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [detection, setDetection] = useState<MutationResponse | null>(null);
  const createNewResp = (resp: any): MutationResponse => {
    const analysis = new MutationResponse(
      resp["cancer.txt"],
      resp["cysticfibrosis.txt"],
      resp["hemophilia.txt"],
      resp["huntington.txt"],
      resp["nf1.txt"]
    );
    return analysis;
  };
  const handleuploadFile = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      try {
        const resp = await uploadFile(file);
        const analysis = createNewResp(resp);
        setDetection((prevDetection) => {
          console.log(analysis);
          return analysis;
        });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <Card elevation={6}>
        <Container>
          <Typography variant="h1" align="center">
            Mutation Detection
          </Typography>
          <Input
            type="file"
            inputRef={fileInputRef}
            style={{ blockSize: "3rem" }}
          />
          <Button variant="contained" onClick={handleuploadFile}>
            Upload
          </Button>
          {detection ? (
            <>
              <h1>Detected Mutations:</h1>
              {Object.entries(detection).filter(([key, value]) => value === 1)
                .length > 0 ? (
                <ul>
                  {Object.entries(detection)
                    .filter(([key, value]) => value === 1)
                    .map(([key]) => (
                      <li key={key}>{key}</li>
                    ))}
                </ul>
              ) : (
                <p>No mutations detected</p>
              )}
            </>
          ) : (
            <h1>Upload Gene File to get Detection Results</h1>
          )}
        </Container>
      </Card>
    </div>
  );
};

export default MutationDetection;

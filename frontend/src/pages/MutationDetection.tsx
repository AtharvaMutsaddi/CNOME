import React, { useRef, useState } from "react";
import { Button, Container, Typography, Input, Card } from "@mui/material";
import { uploadFileMutations as uploadFile } from "../services/api";
import MutationResponse from "../response-models/MutationResponse";
import MutationInfo from "../assets/mutationInfo.json";
import MutationCard from "../components/MutationCard";

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

  const handleUploadFile = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      try {
        const resp = await uploadFile(file);
        const analysis = createNewResp(resp);
        setDetection(analysis);
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
        position: "relative", // Ensure relative positioning for absolute children
      }}
    >
      <Card elevation={6} sx={{ padding: "3rem" }}>
        <Container>
          <Typography variant="h1" align="center" sx={{ marginBottom: "2rem" }}>
            Mutation Detection
          </Typography>
          <Input
            type="file"
            inputRef={fileInputRef}
            style={{ blockSize: "3rem" }}
          />
          <Button variant="contained" onClick={handleUploadFile}>
            Upload
          </Button>
          {detection && (
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "500px", // Set sidebar width
                height: "100%", // Take full height of the container
                borderLeft: "1px solid #ccc",
                paddingLeft: "1rem",
                overflowY: "auto",
                // backgroundColor:"white"
              }}
            >
              <h1>Detected Mutations:</h1>
              {Object.entries(detection).filter(([key, value]) => value === 1)
                .length > 0 ? (
                  <ul>
                  {Object.entries(detection)
                    .filter(([key, value]) => value === 1)
                    .map(([key]) => {
                      const mutationData =(MutationInfo as any)[key] as any;
                      if (mutationData) {
                        const { name, geneURL, imgURL, description } = mutationData;
                        return (
                          <MutationCard
                            key={key}
                            name={name}
                            geneURL={geneURL}
                            imgURL={imgURL}
                            description={description}
                          />
                        );
                      }
                      return null;
                    })}
                </ul>
                
              ) : (
                <p>No mutations detected</p>
              )}
            </div>
          )}
        </Container>
      </Card>
    </div>
  );
};

export default MutationDetection;

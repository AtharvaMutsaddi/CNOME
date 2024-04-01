import React from "react";
import { GeneContextType, useGeneContext } from "../context/GeneContext";
import { decompress } from "../services/decompressgene";
import { Card, Typography } from "@mui/material";
import proteinImages from "../assets/proteinImages.json";

const ViewGene = () => {
  const geneData: GeneContextType = useGeneContext();
  const decodedGene = decompress(geneData?.geneData?.gene || "");

  // Function to render images based on gene components
  const renderProteinImages = (gene: string) => {
    const proteinComponents = Array.from(new Set(gene.split("")));
    return proteinComponents.map((component, index) => {
      // Check if the component exists in the proteinImages JSON
      if ((proteinImages as any)[component]) {
        return (
          <img
            key={index}
            src={(proteinImages as any)[component]}
            alt={component}
            style={{ width: 200, height: 200, marginRight: 20 }}
          />
        );
      }
      return null;
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        minWidth:"90vw",
        position: "relative", // Ensure relative positioning for absolute children
      }}
    >
      <Card
        elevation={3}
        style={{ padding: 20, maxWidth: 800, margin: "auto" }}
      >
        <Typography variant="h3" gutterBottom>
          Gene Sequence:
        </Typography>
        <div
          style={{
            overflowY: "auto",
            maxHeight: 200,
            marginBottom: 20,
            fontSize: 40, // Increased font size
          }}
        >
          {decodedGene}
        </div>
        <Typography variant="h5">Gene Information</Typography>
        <Typography variant="h6">
          This Gene has occurred {geneData?.geneData?.frequency} times in the
          original sequence.
        </Typography>
        <Typography variant="h6">Gene Size: {decodedGene?.length}</Typography>
        <br />
        <br />
        <Typography variant="h3">Detected Protein Structures</Typography>
        <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap" }}>
          {renderProteinImages(decodedGene)}
        </div>
      </Card>
    </div>
  );
};

export default ViewGene;

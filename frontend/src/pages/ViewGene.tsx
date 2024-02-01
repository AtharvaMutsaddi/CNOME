import React, { useEffect, useState } from "react";
import { GeneContextType, useGeneContext } from "../context/GeneContext";
import { decompress } from "../services/decompressgene";

const ViewGene = () => {
  const geneData: GeneContextType = useGeneContext();
  const decodedGene = decompress(geneData?.geneData?.gene || '');
  return (
    <div style={{ display: "flex" }}>
      <div>{decodedGene}</div>
      <div>
        <h3>
          This Gene has occurred {geneData?.geneData?.frequency} times in the
          original sequence
        </h3>
        <p>Gene Size: {decodedGene?.length}</p>
      </div>
    </div>
  );
};

export default ViewGene;


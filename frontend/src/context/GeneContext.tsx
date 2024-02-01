import React, { createContext, useContext, ReactNode, useState } from "react";

type GeneContextProps = {
  children: ReactNode;
};

type GeneData = {
  gene: string;
  frequency: number;
};

export type GeneContextType = {
  geneData: GeneData | null;
  setGeneData: (data: GeneData | null) => void;
};

const GeneContext = createContext<GeneContextType | undefined>(undefined);

export const GeneProvider = ({ children }: GeneContextProps) => {
  const [geneData, setGeneData] = useState<GeneData | null>(null);

  return (
    <GeneContext.Provider value={{ geneData, setGeneData }}>
      {children}
    </GeneContext.Provider>
  );
};

export const useGeneContext = () => {
  const context = useContext(GeneContext);
  if (!context) {
    throw new Error("useGeneContext must be used within a GeneProvider");
  }
  return context;
};

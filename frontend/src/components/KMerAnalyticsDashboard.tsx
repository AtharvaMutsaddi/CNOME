import React, { useEffect, useState } from "react";
import KMerResponse from "../response-models/KMerResponse";
import { Histogram } from "./Histogram";
import { PieChart } from "./PieChart";

interface KMerAnalyticsDashboardProps {
  data: KMerResponse;
}
type HistogramDataType = {
  width: number;
  height: number;
  data: number[];
};
type DataItem = {
  name: string;
  value: number;
};
type PieChartDataType = {
  width: number;
  height: number;
  data: DataItem[];
};
const KMerAnalyticsDashboard: React.FC<KMerAnalyticsDashboardProps> = ({
  data,
}) => {
  const [histogramData, setHistogramData] = useState<HistogramDataType | null>(
    null
  );
  const [pieData, setPieData] = useState<PieChartDataType | null>(null);
  const getTopGenes = (data: KMerResponse): DataItem[] => {
    const dataArray = Object.entries(data);
    const sortedData = dataArray
      .filter(([key, value]) => key !== "totalKmers")
      .sort((a, b) => b[1] - a[1]);
    const top: DataItem[] = sortedData.slice(0, Math.min(10, sortedData.length)).map(
      ([gene, frequency]) => ({
        name: gene,
        value: frequency,
      })
    );
    return top;
  };
  
  useEffect(() => {
    if (data) {
      // Process data for charts
      const labels = Object.keys(data).map(String);
      const filteredValues = Object.entries(data)
        .filter(([key]) => key !== "totalKmers")
        .map(([, value]) => value);
      const frequencies = filteredValues;
      const histPlotData = {
        width: 500,
        height: 500,
        data: frequencies,
      };
      setHistogramData(histPlotData);
      const piePlotData = {
        width: 1200,
        height: 400,
        data: getTopGenes(data),
      };
      setPieData(piePlotData);
    }
  }, [data]);

  return (
    <>
      <div>
        {histogramData && (
          <Histogram
            data={histogramData.data}
            width={histogramData.width}
            height={histogramData.height}
          ></Histogram>
        )}
      </div>
      <div>
        {pieData && (
          <PieChart
            data={pieData.data}
            width={pieData.width}
            height={pieData.height}
          />
        )}
      </div>
    </>
  );
};

export default KMerAnalyticsDashboard;

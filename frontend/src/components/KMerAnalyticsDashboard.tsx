import React, { useEffect, useState } from "react";
import KMerResponse from "../response-models/KMerResponse";
import { Histogram } from "./Histogram";

interface KMerAnalyticsDashboardProps {
  data: KMerResponse;
}
type HistogramDataType = {
  width: number;
  height: number;
  data: number[];
};
const KMerAnalyticsDashboard: React.FC<KMerAnalyticsDashboardProps> = ({
  data,
}) => {
  const [histogramData, setHistogramData] = useState<HistogramDataType | null>(
    null
  );
  const [pieData, setPieData] = useState<any>({});
  useEffect(() => {
    if (data) {
      // Process data for charts
      const labels = Object.keys(data).map(String);
      const filteredValues = Object.entries(data)
        .filter(([key]) => key !== "totalKmers")
        .map(([, value]) => value);
      const frequencies =filteredValues;
      const histPlotData = {
        width: 500,
        height: 500,
        data: frequencies,
      };
      setHistogramData(histPlotData);
      // // Histogram (Bar Chart)
      // const histogramData = {
      //   labels,
      //   datasets: [
      //     {
      //       label: "Frequency",
      //       data: frequencies,
      //       backgroundColor: "rgba(75,192,192,0.2)",
      //       borderColor: "rgba(75,192,192,1)",
      //       borderWidth: 1,
      //     },
      //   ],
      // };

      // // Pie Chart
      // const sortedData = Object.entries(data).sort(([, a], [, b]) => b - a);
      // const top5 = sortedData.slice(0, 5);
      // const others = sortedData.slice(5);

      // const pieChartData = {
      //   labels: [...top5.map(([string]) => string), "Others"],
      //   datasets: [
      //     {
      //       data: [
      //         ...top5.map(([, frequency]) => frequency),
      //         others.reduce((acc, [, frequency]) => acc + frequency, 0),
      //       ],
      //       backgroundColor: [
      //         "red",
      //         "blue",
      //         "green",
      //         "yellow",
      //         "orange",
      //         "gray", // or any color for "Others"
      //       ],
      //     },
      //   ],
      // };
      // console.log(histogramData);
      // console.log(pieChartData);
      // setChartData({ histogramData, pieChartData });
    }
  }, [data]);

  return (
    <div>
      {histogramData && (
        <Histogram
          data={histogramData.data}
          width={histogramData.width}
          height={histogramData.height}
        ></Histogram>
      )}
    </div>
  );
};

export default KMerAnalyticsDashboard;

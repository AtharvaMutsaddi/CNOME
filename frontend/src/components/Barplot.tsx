import React, { useMemo } from "react";
import * as d3 from "d3";
import { Card, Typography } from "@mui/material";
import { BarItem } from "./BarItem";
import SimResponse from "../response-models/SimResponse";

const MARGIN = { top: 30, right: 30, bottom: 30, left: 30 };
const BAR_PADDING = 0.3;

type BarplotProps = {
  width: number;
  height: number;
  data: SimResponse;
};

export const Barplot = ({ width, height, data }: BarplotProps) => {
  // Calculate average similarity score
  const averageScore = useMemo(() => {
    const totalScore = Object.entries(data).reduce(
      (acc, cur) => acc + cur[1],
      0
    );
    return totalScore / Object.keys(data).length;
  }, [data]);

  // Determine image and text based on average score
  let image;
  let text;
  if (averageScore < 50) {
    text = "Not Very Similar";
  } else if (averageScore >= 50 && averageScore < 90) {
    text = "Medium Similarity";
  } else {
    text = "Very Similar";
  }

  // bounds = area inside the graph axis = calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Y axis is for groups since the barplot is horizontal
  const dataArray = Object.entries(data);
  const groups = dataArray.sort((a, b) => b[1] - a[1]).map((d) => d[0]);
  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .domain(groups)
      .range([0, boundsHeight])
      .padding(BAR_PADDING);
  }, [data, height]);

  // X axis
  const max = d3.max(dataArray.map((d) => d[1]));
  const xScale = d3
    .scaleLinear()
    .domain([0, max as number])
    .range([0, boundsWidth]);

  // Build the shapes
  const allShapes = dataArray.map((d) => {
    return (
      <BarItem
        key={d[0]}
        name={d[0]}
        value={d[1]}
        barHeight={yScale.bandwidth()}
        barWidth={xScale(d[1])}
        x={xScale(0)}
        y={yScale(d[0]) as number}
      />
    );
  });

  return (
    <Card elevation={3} style={{ padding: 20}}>

      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {allShapes}
        </g>
      </svg>
        <Typography variant="h3" gutterBottom>
          Average Similarity
        </Typography>
        
        <Typography variant="h4" style={{ color: "blue" }}>
          {text}
        </Typography>
        <Typography variant="h2" style={{ color: "green" }}>
          {averageScore}
        </Typography>
    </Card>
  );
};

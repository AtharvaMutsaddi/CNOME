import { useMemo } from "react";
import * as d3 from "d3";
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
  // bounds = area inside the graph axis = calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Y axis is for groups since the barplot is horizontal
  const dataArray=Object.entries(data);
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
  const xScale = d3.scaleLinear().domain([0, max as number]).range([0, boundsWidth]);

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
    <div>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {allShapes}
        </g>
      </svg>
    </div>
  );
};

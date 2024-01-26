import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { NumberValue } from "d3";

const MARGIN = { top: 30, right: 30, bottom: 40, left: 50 };
const BUCKET_NUMBER = 70;
const BUCKET_PADDING = 1;

type HistogramProps = {
  width: number;
  height: number;
  data: number[];
};

export const Histogram = ({ width, height, data }: HistogramProps) => {
  const axesRef = useRef(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left + 5;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const xScale = useMemo(() => {
    const max = Math.max(...data);
    console.log(max);
    return d3
      .scaleLinear()
      .domain([4, Math.min(max + 1, 1000)])
      .range([10, boundsWidth]);
  }, [data, width]);

  const buckets = useMemo(() => {
    const bucketGenerator = d3
      .bin()
      .value((d) => d)
      .domain(xScale.domain() as [number, number])
      .thresholds(xScale.ticks(BUCKET_NUMBER));
    return bucketGenerator(data);
  }, [xScale]);

  const yScale = useMemo(() => {
    const max = Math.max(...buckets.map((bucket) => bucket?.length));
    return d3.scaleLinear().range([boundsHeight, 0]).domain([0, max]).nice();
  }, [data, height]);

  // Render the X axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove();

    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", "translate(0," + boundsHeight + ")")
      .call(xAxisGenerator);

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append("g").call(yAxisGenerator);
  }, [xScale, yScale, boundsHeight]);

  const [mousePosn,setMousePosn]=useState<{x:number,y:number}>({x:0,y:0});
  const handleMouseOver = (
    event: React.MouseEvent<SVGRectElement, MouseEvent>,
    value: number
  ) => {
    const tooltip = d3.select(tooltipRef.current);
    console.log(event.pageX);
    console.log(event.pageY);
    tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip.html(value.toString())
    setMousePosn({x:event.pageX,y:event.pageY})
  };

  const handleMouseOut = () => {
    const tooltip = d3.select(tooltipRef.current);
    console.log("Mouse Out");
    tooltip.transition().duration(500).style("opacity", 0);
  };
  const allRects = buckets.map((bucket, i) => {
    return (
      <rect
        key={i}
        fill="#69b3a2"
        x={xScale(bucket.x0 as NumberValue) + BUCKET_PADDING / 2}
        width={
          xScale(bucket.x1 as NumberValue) -
          xScale(bucket.x0 as NumberValue) -
          BUCKET_PADDING * 0.25
        }
        y={yScale(bucket.length)}
        height={boundsHeight - yScale(bucket.length)}
        onMouseOver={(event) => handleMouseOver(event, bucket.length || 0)}
        onMouseOut={handleMouseOut}
      />
    );
  });

  return (
    <div style={{ display: "flex", alignItems:"center",justifyContent:'center' }}>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {allRects}
        </g>
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={axesRef}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        />
      </svg>
      <div
        ref={tooltipRef}
        style={{
          opacity: 0,
          pointerEvents: "none",
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Increased shadow for a card-like effect
          padding: "16px", // Increased padding for more space
          borderRadius: "8px", // Rounded corners
          zIndex: 9999,
          position:"absolute",
          top:`${mousePosn.y}px`,
          left:`${mousePosn.x}px`,
        }}
      />
      <div style={{
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
          padding: "16px", 
          borderRadius: "8px", 
        }}>
        <h1>Histogram</h1>
        <p>Showing you the ranges of frequency of occurrence of repeated KMers of a fixed size. Guves insights on the rate of repeatedness</p>
      </div>
    </div>
  );
};

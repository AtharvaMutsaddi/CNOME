import { useEffect, useMemo, useRef } from "react";
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
  const tooltipRef = useRef<SVGTextElement>(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const xScale = useMemo(() => {
    const max = Math.max(...data);
    console.log(max);
    return d3
      .scaleLinear()
      .domain([4, Math.min(max+1, 1000)])
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
  const handleMouseOver = (
    event: React.MouseEvent<SVGRectElement, MouseEvent>,
    value: number
  ) => {
    const tooltip = d3.select(tooltipRef.current);
    console.log("Mouse Over:", value);
    tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip
      .html(value.toString())
      .style("left", event.pageX + "px")
      .style("top", event.pageY + "px");
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
          BUCKET_PADDING
        }
        y={yScale(bucket.length)}
        height={boundsHeight - yScale(bucket.length)}
        onMouseOver={(event) => handleMouseOver(event, bucket.length || 0)}
        onMouseOut={handleMouseOut}
      />
    );
  });

  return (
    <svg width={width} height={height}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      >
        {allRects}
        <text ref={tooltipRef} style={{ opacity: 0, pointerEvents: "none" }} />
      </g>
      <g
        width={boundsWidth}
        height={boundsHeight}
        ref={axesRef}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      />
    </svg>
  );
};

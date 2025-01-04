// Function to render bar charts with a spec prefix
function spec_renderBarChart(
  data,
  xKey,
  yKey,
  svgId,
  xLabel,
  yLabel,
  customWidth = null
) {
  const svgElement = d3.select(svgId);
  const containerWidth =
    customWidth || svgElement.node().parentNode.offsetWidth || 700; // Default width
  const containerHeight = 400; // Fixed height

  const margin = { top: 40, right: 20, bottom: 60, left: 60 };
  const width = containerWidth - margin.left - margin.right;
  const height = containerHeight - margin.top - margin.bottom;

  // Clear previous content
  svgElement.selectAll("*").remove();

  // Create scales
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d[xKey]), d3.max(data, (d) => d[xKey])])
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[yKey])])
    .nice()
    .range([height, 0]);

  // Append group for chart
  const chartGroup = svgElement
    .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Add bars
  chartGroup
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d[xKey]))
    .attr("y", (d) => yScale(d[yKey]))
    .attr("width", (d) => Math.max(1, xScale(d.x1) - xScale(d.x0) - 1)) // Minimum width for visibility
    .attr("height", (d) => height - yScale(d[yKey]))
    .attr("fill", "steelblue");

  // Add numbers on top of bars
  chartGroup
    .selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("x", (d) => xScale(d[xKey]) + (xScale(d.x1) - xScale(d.x0)) / 2)
    .attr("y", (d) => yScale(d[yKey]) - 5)
    .attr("text-anchor", "middle")
    .text((d) => d[yKey])
    .style("font-size", "12px")
    .style("fill", "black");

  // Add X axis
  chartGroup
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).ticks(10))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  chartGroup.append("g").call(d3.axisLeft(yScale).ticks(10));

  // Add X label
  chartGroup
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text(xLabel);

  // Add Y label
  chartGroup
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 15)
    .attr("x", -height / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text(yLabel);
}

// Function to render bar charts with a spec prefix
function spec_renderBarChart2(
  data,
  xKey,
  yKey,
  svgId,
  xLabel,
  yLabel,
  customWidth = null
) {
  const svgElement = d3.select(svgId);
  const containerWidth =
    customWidth || svgElement.node().parentNode.offsetWidth || 700; // Default width
  const containerHeight = 650; // Fixed height

  const margin = { top: 40, right: 20, bottom: 60, left: 60 };
  const width = containerWidth - margin.left - margin.right;
  const height = containerHeight - margin.top - margin.bottom;

  // Clear previous content
  svgElement.selectAll("*").remove();

  // Create scales
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d[xKey]), d3.max(data, (d) => d[xKey])])
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[yKey])])
    .nice()
    .range([height, 0]);

  // Append group for chart
  const chartGroup = svgElement
    .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Add bars
  chartGroup
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d[xKey]))
    .attr("y", (d) => yScale(d[yKey]))
    .attr("width", (d) => Math.max(1, xScale(d.x1) - xScale(d.x0) - 1)) // Minimum width for visibility
    .attr("height", (d) => height - yScale(d[yKey]))
    .attr("fill", "steelblue");

  // Add numbers on top of bars
  chartGroup
    .selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("x", (d) => xScale(d[xKey]) + (xScale(d.x1) - xScale(d.x0)) / 2)
    .attr("y", (d) => yScale(d[yKey]) - 5)
    .attr("text-anchor", "middle")
    .text((d) => d[yKey])
    .style("font-size", "12px")
    .style("fill", "black");

  // Add X axis
  chartGroup
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).ticks(10))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  chartGroup.append("g").call(d3.axisLeft(yScale).ticks(10));

  // Add X label
  chartGroup
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text(xLabel);

  // Add Y label
  chartGroup
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 15)
    .attr("x", -height / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text(yLabel);
}

// Load the CSV file
d3.csv("Mobiles.csv").then((data) => {
  // Convert necessary fields to numeric
  data.forEach((d) => {
    d["RAM (GB)"] = +d["RAM (GB)"];
    d["Storage (GB)"] = +d["Storage (GB)"];
    d["Display Size (inch)"] = +d["Display Size (inch)"];
  });

  // Call the function to render charts with the loaded data
  renderCharts(data);
});

function calculateHistogram(data, valueKey, binSize) {
  const values = data.map((d) => d[valueKey]).filter((d) => !isNaN(d));
  const histogram = d3
    .histogram()
    .value((d) => d)
    .domain(d3.extent(values))
    .thresholds(d3.range(d3.min(values), d3.max(values) + binSize, binSize));

  return histogram(values).map((bin) => ({
    x0: bin.x0,
    x1: bin.x1,
    count: bin.length,
  }));
}

function calculateFixedHistogram(data, valueKey, binSize) {
  const values = data.map((d) => d[valueKey]).filter((d) => !isNaN(d));
  const minValue = d3.min(values);
  const maxValue = d3.max(values);

  // Generate explicit thresholds at fixed intervals
  const thresholds = d3.range(
    Math.floor(minValue),
    Math.ceil(maxValue) + binSize,
    binSize
  );

  const histogram = d3
    .histogram()
    .value((d) => d)
    .domain([minValue, maxValue])
    .thresholds(thresholds);

  return histogram(values).map((bin) => ({
    x0: bin.x0,
    x1: bin.x1,
    count: bin.length,
  }));
}

function renderCharts(data) {
  // Custom bins for each histogram
  const ramBins = [0, 4, 8, 12, 16, 20]; // Example: 4 GB intervals
  const storageBins = [0, 64, 128, 256, 512]; // Example: 64 GB intervals
  const screenSizeBinSize = 0.5; // Fixed bin size of 0.5 inches

  const ramHistogram = calculateFixedHistogram(data, "RAM (GB)", 4);
  const storageHistogram = calculateFixedHistogram(data, "Storage (GB)", 64);
  const screenSizeHistogram = calculateFixedHistogram(
    data,
    "Display Size (inch)",
    screenSizeBinSize
  );

  // Render RAM Chart
  spec_renderBarChart(
    ramHistogram,
    "x0",
    "count",
    "#ramChart_spec",
    "Mức RAM (GB)",
    "Số lượng điện thoại"
  );

  // Render Storage Chart
  spec_renderBarChart(
    storageHistogram,
    "x0",
    "count",
    "#storageChart_spec",
    "Dung lượng bộ nhớ (GB)",
    "Số lượng điện thoại"
  );

  // Render Screen Size Chart
  spec_renderBarChart2(
    screenSizeHistogram,
    "x0",
    "count",
    "#screenSizeChart_spec",
    "Kích thước màn hình (inch)",
    "Số lượng điện thoại",
    1400 // Custom width for the larger chart
  );
}

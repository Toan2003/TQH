// Function to render bar charts with a spec prefix
function spec_renderBarChart(
  data,
  xKey,
  yKey,
  svgId,
  xLabel,
  yLabel,
  customWidth = null,
) {
  const svgElement = d3.select(svgId);
  const containerWidth =
    customWidth || svgElement.node().parentNode.offsetWidth || 700; // Default width
  const containerHeight = 400; // Fixed height

  const margin = { top: 40, right: 80, bottom: 60, left: 80 };
  const width = containerWidth - margin.left - margin.right;
  const height = containerHeight - margin.top - margin.bottom;

  // Clear previous content
  svgElement.selectAll("*").remove();

  // Create Scales
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
    .attr("width", (d) => xScale(d.x1) - xScale(d.x0) - 1)
    .attr("height", (d) => height - yScale(d[yKey]))
    .attr("fill", "steelblue");

  // Add X Axis
  chartGroup
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  // Add Y Axis
  chartGroup.append("g").call(d3.axisLeft(yScale));

  // Add X Label
  svgElement
    .append("text")
    .attr("x", containerWidth / 2)
    .attr("y", containerHeight - 10)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text(xLabel);

  // Add Y Label
  svgElement
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 20)
    .attr("x", -containerHeight / 2)
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
  const values = data.map(d => d[valueKey]).filter(d => !isNaN(d));
  const histogram = d3.histogram()
    .value(d => d)
    .domain(d3.extent(values))
    .thresholds(d3.range(d3.min(values), d3.max(values) + binSize, binSize));

  return histogram(values).map(bin => ({
    x0: bin.x0,
    x1: bin.x1,
    count: bin.length
  }));
}

function renderCharts(data) {
  // Calculate histograms with custom bin size
  const ramHistogram = calculateHistogram(data, "RAM (GB)", 3.89);
  const storageHistogram = calculateHistogram(data, "Storage (GB)", 58.1);
  const screenSizeHistogram = calculateHistogram(data, "Display Size (inch)", 0.5);

  // Render Charts
  spec_renderBarChart(
    ramHistogram,
    "x0",
    "count",
    "#ramChart_spec",
    "Mức Ram (GB)",
    "Số lượng loại điện thoại"
  );
  spec_renderBarChart(
    storageHistogram,
    "x0",
    "count",
    "#storageChart_spec",
    "Mức dung lượng bộ nhớ trong (GB)",
    "Số lượng loại điện thoại"
  );
  spec_renderBarChart(
    screenSizeHistogram,
    "x0",
    "count",
    "#screenSizeChart_spec",
    "Kích thước màn hình (inch)",
    "Số lượng loại điện thoại",
    1400 // Custom width for the larger bottom chart
  );
}
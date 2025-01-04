// Load the CSV file
d3.csv("Mobiles.csv").then((data) => {
    // Data preprocessing
    data.forEach((d) => {
      d["Rating"] = +d["Rating"]; // Ensure "Rating" is numeric
      d["Reviews"] = +d["Reviews"].replace(/,/g, ""); // Ensure "Reviews" is numeric and remove commas
    });
  
    // Data for Scatter Plot
    const scatterData = data.map((d) => ({
      rating: d["Rating"],
      reviews: d["Reviews"],
    }));
  
    renderFinalScatterPlotWithTrend(scatterData);
  });
  
  // Function to calculate the trend line (linear regression)
  function calculateTrendLine(data) {
    const n = data.length;
    const sumX = d3.sum(data, (d) => d.reviews);
    const sumY = d3.sum(data, (d) => d.rating);
    const sumXY = d3.sum(data, (d) => d.reviews * d.rating);
    const sumX2 = d3.sum(data, (d) => d.reviews * d.reviews);
  
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
  
    return { slope, intercept };
  }
  
  // Render Scatter Plot with Trend Line
  function renderFinalScatterPlotWithTrend(data) {
    const width = 1600,
      height = 700,
      margin = { top: 40, right: 20, bottom: 60, left: 80 };
  
    const svg = d3
      .select("#screenSizeChart_relation")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    // Define scales with expanded domains
    const xScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.reviews) * 0.9,
        d3.max(data, (d) => d.reviews) * 1.1,
      ])
      .range([margin.left, width - margin.right]);
  
    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.rating) * 0.95,
        d3.max(data, (d) => d.rating) * 1.05,
      ])
      .range([height - margin.bottom, margin.top]);
  
    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format(".2s")))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 50)
      .attr("fill", "black")
      .style("font-size", "14px")
      .style("text-anchor", "middle")
      .text("Number of Reviews");
  
    // Add Y axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -50)
      .attr("transform", "rotate(-90)")
      .attr("fill", "black")
      .style("font-size", "14px")
      .style("text-anchor", "middle")
      .text("Rating");
  
    // Add dots with jittering
    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.reviews) + (Math.random() - 0.5) * 15) // Adjust horizontal jitter
      .attr("cy", (d) => yScale(d.rating) + (Math.random() - 0.5) * 0.05) // Adjust vertical jitter
      .attr("r", 6)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("opacity", 0.8);
  
    // Calculate and add the trend line
    const { slope, intercept } = calculateTrendLine(data);
    const xMin = d3.min(data, (d) => d.reviews);
    const xMax = d3.max(data, (d) => d.reviews);
    const yMin = slope * xMin + intercept;
    const yMax = slope * xMax + intercept;
  
    svg
      .append("line")
      .attr("x1", xScale(xMin))
      .attr("y1", yScale(yMin))
      .attr("x2", xScale(xMax))
      .attr("y2", yScale(yMax))
      .attr("stroke", "red")
      .attr("stroke-width", 2);
  }
  
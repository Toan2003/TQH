// Load the CSV file
d3.csv("Mobiles.csv").then((data) => {
  // Data preprocessing
  data.forEach((d) => {
    d["Actual price"] = +d["Actual price"];
    d["Discount price"] = +d["Discount price"];
    d["Stars"] = +d["Stars"]; // Ensure "Stars" is a numeric column in your CSV
    d["Discount"] =
      ((d["Actual price"] - d["Discount price"]) / d["Actual price"]) * 100;
  });

  // Data for Brand Bar Chart
  const favbrandData = Array.from(
    d3.rollup(
      data,
      (v) => d3.mean(v, (d) => d["Stars"]),
      (d) => d.Brand
    ),
    ([name, rating]) => ({ name, rating })
  )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10); // Top 10 brands by average stars

  // Data for Product Horizontal Bar Chart
  const favproductData = data
    .sort((a, b) => b.Stars - a.Stars)
    .slice(0, 10)
    .map((d) => ({
      name: d["Product Name"],
      rating: d.Stars,
    }));

  // Data for Scatter Plot
  const scatterData = data.map((d) => ({
    price: d["Discount price"],
    stars: d.Stars,
  }));

  // Render Charts
  renderFavBrandChart(favbrandData);
  renderFavProductChart(favproductData);
  renderScatterPlot(scatterData);
});

// Render Brand Bar Chart
function renderFavBrandChart(data) {
  const width = 800,
    height = 400,
    margin = { top: 20, right: 20, bottom: 50, left: 50 };

  const svg = d3
    .select("#favorite_chart_1")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.name))
    .range([margin.left, width - margin.right])
    .padding(0.2);

  const yScale = d3
    .scaleLinear()
    .domain([4.2, d3.max(data, (d) => d.rating)]) // Start from 4.3
    .range([height - margin.bottom, margin.top]);

  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(
      d3.axisLeft(yScale).ticks(5) // Adjust ticks if needed
    );

  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.name))
    .attr("y", (d) => yScale(d.rating))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - margin.bottom - yScale(d.rating))
    .attr("fill", "steelblue");

  svg
    .selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("x", (d) => xScale(d.name) + xScale.bandwidth() / 2)
    .attr("y", (d) => yScale(d.rating) - 5)
    .attr("text-anchor", "middle")
    .text((d) => d.rating.toFixed(2))
    .style("font-size", "12px")
    .style("fill", "black");
}

// Utility function to truncate text
function truncateText(text, maxLength) {
  return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
}

// Render Product Horizontal Bar Chart
function renderFavProductChart(data) {
  const width = 800,
    height = 400,
    margin = { top: 20, right: 20, bottom: 50, left: 150 };

  const svg = d3
    .select("#favorite_chart_2")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const xScale = d3
    .scaleLinear()
    .domain([4.5, 5.2]) // Start from 4.5
    .range([margin.left, width - margin.right]);

  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => truncateText(d.name, 25))) // Truncate names to 25 characters
    .range([margin.top, height - margin.bottom])
    .padding(0.2);

  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale));

  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale));

  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", (d) => yScale(truncateText(d.name, 25))) // Use truncated names
    .attr("x", (d) => xScale(4.5)) // Adjust starting point of bars
    .attr("width", (d) => xScale(d.rating) - xScale(4.5))
    .attr("height", yScale.bandwidth())
    .attr("fill", "steelblue");

  svg
    .selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("x", (d) => xScale(d.rating) + 5)
    .attr("y", (d) => yScale(truncateText(d.name, 25)) + yScale.bandwidth() / 2)
    .attr("dy", ".35em")
    .text((d) => d.rating.toFixed(2))
    .style("font-size", "12px")
    .style("fill", "black");
}

// Render Scatter Plot with Logarithmic Trend Line
function renderScatterPlot(data) {
  const width = 2000,
    height = 600,
    margin = { top: 40, right: 20, bottom: 80, left: 80 };

  const svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const xScale = d3
    .scaleLinear()
    .domain([1, d3.max(data, (d) => d.price)]) // Ensure the domain starts at 1 to avoid ln(0)
    .range([margin.left, width - margin.right]);

  const yScale = d3
    .scaleLinear()
    .domain([3.3, 5]) // Assuming Stars are in the range of 3 to 5
    .range([height - margin.bottom, margin.top]);

  // Add scatterplot points
  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.price))
    .attr("cy", (d) => yScale(d.stars))
    .attr("r", 6)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("opacity", 0.8);

  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format(".2s")));

  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale));

  // Calculate logarithmic regression coefficients
  const validData = data.filter((d) => d.price > 0); // Exclude invalid data for log calculation
  const n = validData.length;
  const sumLnX = d3.sum(validData, (d) => Math.log(d.price));
  const sumY = d3.sum(validData, (d) => d.stars);
  const sumLnXSquared = d3.sum(validData, (d) => Math.log(d.price) ** 2);
  const sumLnXTimesY = d3.sum(validData, (d) => Math.log(d.price) * d.stars);

  const b = (n * sumLnXTimesY - sumLnX * sumY) / (n * sumLnXSquared - sumLnX ** 2);
  const a = (sumY - b * sumLnX) / n;

  // Generate logarithmic trend line points
  const xValues = d3.range(1, d3.max(data, (d) => d.price), (d3.max(data, (d) => d.price) - 1) / 100);
  const trendLineData = xValues.map((x) => ({
    x,
    y: a + b * Math.log(x),
  }));

  // Add logarithmic trend line
  svg
    .append("path")
    .datum(trendLineData)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr(
      "d",
      d3
        .line()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y))
    );

  // Add labels
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - margin.bottom + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Discount Price");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", margin.left - 50)
    .attr("x", -height / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Stars (Ratings)");
}




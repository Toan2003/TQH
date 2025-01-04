// Dữ liệu cho biểu đồ thương hiệu
const favbrandData = [
  { name: "APPLE", rating: 4000000 },
  { name: "VIVO", rating: 3500000 },
  { name: "MOTOROLA", rating: 2000000 },
  { name: "SAMSUNG", rating: 1800000 },
  { name: "REDMI", rating: 1500000 },
  { name: "INFINIX", rating: 1400000 },
  { name: "POCO", rating: 1400000 },
  { name: "REALME", rating: 1300000 },
  { name: "ONEPLUS", rating: 1000000 },
  { name: "NOKIA", rating: 800000 },
];

// Dữ liệu cho biểu đồ sản phẩm
const favproductData = [
  { name: "Vivo T2x 5G (Black Gladiator)", rating: 600000 },
  { name: "Vivo T2x 5G (Aurora Gold)", rating: 550000 },
  { name: "Nokia 105 Single SIM", rating: 500000 },
  { name: "Vivo T2x 5G (Sunstone Orange)", rating: 450000 },
  { name: "Vivo T2x 5G (Marine Blue)", rating: 400000 },
  { name: "Apple iPhone 14 (Starlight)", rating: 350000 },
  { name: "Apple iPhone 14 (Purple)", rating: 300000 },
  { name: "Apple iPhone 14 (Midnight)", rating: 250000 },
  { name: "Apple iPhone 14 (Blue)", rating: 200000 },
  { name: "Apple iPhone 14 ((PRODUCT)RED)", rating: 150000 },
];

// Tạo biểu đồ thương hiệu
const fav_chart_1 = d3.select("#favorite_chart_1");

const favchart_1 = fav_chart_1
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

favchart_1
  .append("g")
  .selectAll(".bar")
  .data(favbrandData)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", (d) => xScale(d.name))
  .attr("y", (d) => yScale(d.rating))
  .attr("width", xScale.bandwidth())
  .attr("height", (d) => height - yScale(d.rating));

favchart_1
  .append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(xScale));

favchart_1.append("g").call(d3.axisLeft(yScale));

// Tạo biểu đồ sản phẩm
const fav_chart_2 = d3.select("#favorite_chart_2");

const favchart_2 = fav_chart_2
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

favchart_2
  .append("g")
  .selectAll(".bar")
  .data(productData)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("y", (d) => yScaleProduct(d.name))
  .attr("x", 0)
  .attr("height", yScaleProduct.bandwidth())
  .attr("width", (d) => xScaleProduct(d.rating));

favchart_2
  .append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(xScaleProduct));

favchart_2.append("g").call(d3.axisLeft(yScaleProduct));
// Data for scatter plot
// Data for scatter plot
const scatterData = [
  { price: 10000, stars: 4.5 },
  { price: 15000, stars: 4.2 },
  { price: 30000, stars: 4.8 },
  { price: 20000, stars: 4.1 },
  { price: 45000, stars: 4.7 },
  { price: 35000, stars: 4.0 },
  { price: 50000, stars: 4.6 },
  { price: 80000, stars: 4.3 },
  { price: 100000, stars: 4.9 },
  { price: 150000, stars: 3.8 },
];

// Set dimensions and margins
const scatterWidth = 1800;
const scatterHeight = 400;
const scatterMargin = { top: 40, right: 20, bottom: 60, left: 80 };

// Create scales
const xScaleScatter = d3
  .scaleLinear()
  .domain([0, d3.max(scatterData, (d) => d.price)])
  .range([scatterMargin.left, scatterWidth - scatterMargin.right]);

const yScaleScatter = d3
  .scaleLinear()
  .domain([3, 5]) // Adjust domain for better scaling
  .range([scatterHeight - scatterMargin.bottom, scatterMargin.top]);

// Create SVG for scatter plot
const scatterPlot = d3
  .select("#scatter")
  .append("svg")
  .attr("width", scatterWidth)
  .attr("height", scatterHeight);

// Add x-axis
scatterPlot
  .append("g")
  .attr("transform", `translate(0, ${scatterHeight - scatterMargin.bottom})`)
  .call(d3.axisBottom(xScaleScatter).tickFormat(d3.format(".2s")))
  .append("text")
  .attr("x", scatterWidth / 2)
  .attr("y", 50)
  .attr("fill", "black")
  .style("font-size", "14px")
  .style("text-anchor", "middle")
  .text("Giá thực");

// Add y-axis
scatterPlot
  .append("g")
  .attr("transform", `translate(${scatterMargin.left}, 0)`)
  .call(d3.axisLeft(yScaleScatter))
  .append("text")
  .attr("x", -scatterHeight / 2)
  .attr("y", -50)
  .attr("transform", "rotate(-90)")
  .attr("fill", "black")
  .style("font-size", "14px")
  .style("text-anchor", "middle")
  .text("Đánh giá (Stars)");

// Add dots
scatterPlot
  .selectAll(".dot")
  .data(scatterData)
  .enter()
  .append("circle")
  .attr("class", "dot")
  .attr("cx", (d) => xScaleScatter(d.price))
  .attr("cy", (d) => yScaleScatter(d.stars))
  .attr("r", 6)
  .attr("fill", "steelblue")
  .attr("opacity", 0.8);

// Add gridlines
scatterPlot
  .append("g")
  .attr("class", "grid")
  .attr("transform", `translate(0, ${scatterHeight - scatterMargin.bottom})`)
  .call(
    d3
      .axisBottom(xScaleScatter)
      .tickSize(-scatterHeight + scatterMargin.top + scatterMargin.bottom)
      .tickFormat("")
  );

scatterPlot
  .append("g")
  .attr("class", "grid")
  .attr("transform", `translate(${scatterMargin.left}, 0)`)
  .call(
    d3
      .axisLeft(yScaleScatter)
      .tickSize(-scatterWidth + scatterMargin.left + scatterMargin.right)
      .tickFormat("")
  );

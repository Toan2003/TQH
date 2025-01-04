(async function () {
  try {
    const data = await d3.csv("Mobiles.csv");

    if (!data || data.length === 0) {
      console.error("CSV file is empty or not loaded properly.");
      return;
    }

    // Convert necessary fields to numeric
    data.forEach((d) => {
      d["Actual price"] = +d["Actual price"];
      d["Discount price"] = +d["Discount price"];
      d["Rating"] = +d["Rating"];
      d["Reviews"] = +d["Reviews"].replace(/,/g, ""); // Remove commas
      d["RAM (GB)"] = +d["RAM (GB)"];
      d["Storage (GB)"] = +d["Storage (GB)"];
      d["Display Size (inch)"] = +d["Display Size (inch)"];
    });

    // 1. Top brands by ratings
    const topBrandsByRating = Array.from(
      d3.rollup(
        data,
        (v) => d3.sum(v, (d) => d.Rating),
        (d) => d.Brand
      ),
      ([brand, rating]) => ({ brand, rating })
    )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);

    renderBarChart(
      "#rating_chart_1",
      topBrandsByRating,
      "brand",
      "rating",
      "Thương hiệu",
      "Tổng lượt đánh giá (Rating)"
    );

    // 2. Top 10 products by rating
    const topProductsByRating = data
      .sort((a, b) => b.Rating - a.Rating)
      .slice(0, 10)
      .map((d) => ({ name: d["Product Name"], rating: d.Rating }));

    renderHorizontalBarChart(
      "#rating_chart_2",
      topProductsByRating,
      "name",
      "rating",
      "Tên sản phẩm",
      "Tổng lượt đánh giá (Rating)"
    );

    // 3. Top brands by reviews
    const topBrandsByReviews = Array.from(
      d3.rollup(
        data,
        (v) => d3.sum(v, (d) => d.Reviews),
        (d) => d.Brand
      ),
      ([brand, reviews]) => ({ brand, reviews })
    )
      .sort((a, b) => b.reviews - a.reviews)
      .slice(0, 10);

    renderBarChart(
      "#rating_chart_4",
      topBrandsByReviews,
      "brand",
      "reviews",
      "Thương hiệu",
      "Tổng số lượt đánh giá (Reviews)"
    );

    // 4. Top 10 products by reviews
    const topProductsByReviews = data
      .sort((a, b) => b.Reviews - a.Reviews)
      .slice(0, 10)
      .map((d) => ({ name: d["Product Name"], reviews: d.Reviews }));

    renderHorizontalBarChart(
      "#rating_chart_3",
      topProductsByReviews,
      "name",
      "reviews",
      "Tên sản phẩm",
      "Tổng số lượt đánh giá (Reviews)"
    );
  } catch (error) {
    console.error("Error loading or processing CSV data:", error);
  }
})();

// Render vertical bar chart
function renderBarChart(selector, data, xKey, yKey, xLabel, yLabel) {
  const margin = { top: 40, right: 20, bottom: 80, left: 60 };
  const width = 800 - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;

  const svg = d3
    .select(selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d[xKey]))
    .range([0, width])
    .padding(0.2);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[yKey])])
    .nice()
    .range([height, 0]);

  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d[xKey]))
    .attr("y", (d) => y(d[yKey]))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d[yKey]))
    .attr("fill", "steelblue");

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-25)") // Giảm góc xoay để nhãn x-axis hiển thị tốt hơn
    .style("text-anchor", "middle");

  svg.append("g").call(d3.axisLeft(y));

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text(xLabel);

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 10)
    .attr("x", -height / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text(yLabel);
}

// Render horizontal bar chart
function renderHorizontalBarChart(selector, data, yKey, xKey, yLabel, xLabel) {
  const margin = { top: 40, right: 40, bottom: 80, left: 300 }; // Tăng margin left để đủ không gian nhãn
  const width = 1200 - margin.left - margin.right; // Tăng chiều rộng
  const height = 300 - margin.top - margin.bottom; // Tăng chiều cao

  const svg = d3
    .select(selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[xKey])])
    .nice()
    .range([0, width]);

  const y = d3
    .scaleBand()
    .domain(data.map((d) => d[yKey]))
    .range([0, height])
    .padding(0.4); // Tăng padding giữa các thanh

  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", (d) => y(d[yKey]))
    .attr("x", 0)
    .attr("height", y.bandwidth())
    .attr("width", (d) => x(d[xKey]))
    .attr("fill", "steelblue");

  svg
    .append("g")
    .call(d3.axisLeft(y).tickSizeOuter(0))
    .selectAll("text")
    .style("font-size", "12px"); // Giảm kích thước font nếu nhãn quá dài

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 20) // Dịch xuống để nhãn không chồng
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text(xLabel);

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 20)
    .attr("x", -height / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text(yLabel);
}

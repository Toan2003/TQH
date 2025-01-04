// Load the CSV file
(function () {
  d3.csv("Mobiles.csv").then((data) => {
    data.forEach((d) => {
      d["Actual price"] = +d["Actual price"];
      d["Discount price"] = +d["Discount price"];
      d["Discount"] =
        ((d["Actual price"] - d["Discount price"]) / d["Actual price"]) * 100;
    });

    const barData = Array.from(
      d3.rollup(
        data,
        (v) => d3.mean(v, (d) => d.Discount),
        (d) => d.Brand
      ),
      ([brand, discount]) => ({ brand, discount: discount.toFixed(2) })
    )
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 10);

    const pieData = [
      {
        category: "Giá rẻ: <20000",
        value: data.filter((d) => d["Discount price"] < 20000).length,
      },
      {
        category: "Giá thường: 20000 - 39999",
        value: data.filter(
          (d) => d["Discount price"] >= 20000 && d["Discount price"] < 40000
        ).length,
      },
      {
        category: "Giá cao: 40000 - 59999",
        value: data.filter(
          (d) => d["Discount price"] >= 40000 && d["Discount price"] < 60000
        ).length,
      },
      {
        category: "Hàng cao cấp: >=60000",
        value: data.filter((d) => d["Discount price"] >= 60000).length,
      },
    ];

    const productData = data
      .sort((a, b) => b.Discount - a.Discount)
      .slice(0, 10)
      .map((d) => ({
        product: d["Product Name"],
        discount: d.Discount.toFixed(2),
      }));

    renderBarChart(barData);
    renderPieChart(pieData);
    renderHorizontalBarChart(productData);
  });

  // Function to render bar chart
  function renderBarChart(data) {
    const chart = d3.select("#barChart");
    const width = 1400; // Kéo dài hết trang
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };

    const svg = chart.append("svg").attr("width", width).attr("height", height);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.brand))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.discount)])
      .range([height - margin.bottom, margin.top]);

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Add y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y).ticks(10));

    // Add bars
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.brand))
      .attr("y", (d) => y(d.discount))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - margin.bottom - y(d.discount))
      .attr("fill", "steelblue");

    // Add numbers on top of bars
    svg
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => x(d.brand) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.discount) - 5) // Adjust to place above the bar
      .attr("text-anchor", "middle")
      .text((d) => d.discount)
      .style("font-size", "12px")
      .style("fill", "black");
  }

  // Function to render pie chart
  function renderPieChart(data) {
    const chart = d3.select("#pieChart");
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = chart
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal()
    .domain(data.map((d) => d.category)) 
    .range(["#4E79A7", "#76B7B2", "#E15759", "#F28E2B"]);

    const pie = d3.pie().value((d) => d.value);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    svg
      .selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.category));

    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${radius + 20}, ${-radius})`);

    legend
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 20)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d) => color(d.category));

    legend
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", 20)
      .attr("y", (d, i) => i * 20 + 12)
      .text((d) => `${d.category}: ${d.value}`);
  }

  // Function to render horizontal bar chart
  function renderHorizontalBarChart(data) {
    const chart = d3.select("#horizontalBarChart");
    const width = 650; // Adjust width if necessary
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 50, left: 200 };

    const svg = chart.append("svg").attr("width", width).attr("height", height);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.discount)])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.product))
      .range([margin.top, height - margin.bottom])
      .padding(0.2);

    // Append y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y).tickSize(0));

    // Append x-axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5));

    // Add bars
    svg
      .selectAll(".h-bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("y", (d) => y(d.product))
      .attr("x", x(0))
      .attr("width", (d) => x(d.discount) - x(0))
      .attr("height", y.bandwidth())
      .attr("fill", "steelblue");

    // Add numbers above bars
    svg
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => x(d.discount) + 5)
      .attr("y", (d) => y(d.product) + y.bandwidth() / 2)
      .attr("dy", ".35em")
      .text((d) => d.discount)
      .style("fill", "black")
      .style("font-size", "12px");
  }
})();

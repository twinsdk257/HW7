const cars = d3.csv("cars.csv");

cars.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.price = +d.price;
    });

    // Define the dimensions and margins for the SVG
    const width = 800, height = 400;
    const margin = {top: 30, bottom: 50, left: 80, right: 50};

    // Create the SVG container
    const svg = d3.select("#barplot")
        .append('svg')
        .attr("width", width)
        .attr("height", height)
        .style('background', '#e9f7f2');
    
    // Create a tooltip div that will appear when hovering over bars
    const tooltip = d3.select("body")
        .append("div") // add a new div element for the tooltip
        .style("position","absolute") // allows the tooltip to move with the cursor
        .style("background","white") // background color for readability
        .style("padding","5px") // small spacing inside the tooltip
        .style("border","1px solid black") // border to make tooltip visible
        .style("border-radius","4px") // rounded edges
        .style("visibility","hidden"); // tooltip is hidden until the mouse hovers

    const x0 = d3.scaleBand()
      .domain([...new Set(data.map(d => d["body-style"]))])
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const x1 = d3.scaleBand()
      .domain([...new Set(data.map(d => d["drive-wheels"]))])
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.price)])
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
      .domain([...new Set(data.map(d => d["drive-wheels"]))])
      .range(["#1f77b4", "#ff7f0e"]);    

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .style("text-anchor", "middle");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .style("font-size", "12px");

  // Group container for bars
    const barGroups = svg.selectAll("bar")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${x0(d["body-style"])},0)`);

  // Draw bars
    barGroups.append("rect")
      .attr("x", d => x1(d["drive-wheels"]))
      .attr("y", d => y(d.price))
      .attr("width", x1.bandwidth())
      .attr("height", d => height - margin.bottom - y(d.price))
      .attr("fill", d => color(d["drive-wheels"]))

  // When mouse enters a bar, show tooltip with information
      .on("mouseover", function(event,d){
          tooltip
            .style("visibility","visible") // make tooltip visible
            .html(
              "Body Style: " + d["body-style"] +
              "<br>Drive Wheels: " + d["drive-wheels"] +
              "<br>Price: $" + d.price
            ); // display information about the bar
      })

  // Move tooltip to follow the cursor
  .on("mousemove", function(event){
      tooltip
        .style("top",(event.pageY+10)+"px") // vertical position near cursor
        .style("left",(event.pageX+10)+"px"); // horizontal position near cursor
  })

  // Hide tooltip when cursor leaves the bar
  .on("mouseout", function(){
      tooltip.style("visibility","hidden");
  });

  // Add x-axis label
    svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - margin.top + 15)
    .style("text-anchor", "middle")
    .text("Body style");

// Add y-axis label
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (height / 2))
    .attr("y", margin.left/3)
    .style("text-anchor", "middle")
    .text("Price");

});

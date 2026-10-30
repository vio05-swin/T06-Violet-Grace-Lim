const drawHistogram = (data) => {
    // Step 6.1 Set the dimensions and margins of the chart area
    const svg = d3.select("#histogram")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`) // Responsive SVG

    // Create an inner chart group with margins
    const innerChart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Step 6.2 Set up bins
    const bins = binGenerator(data); // Save the bins into an array

    console.log(bins); // Log the bins to the console for debugging

    // Step 6.3 Get the lower and upper bounds of bins
    const minEng = bins[0].x0; // Lower bound of the first bin
    const maxEng = bins[bins.length - 1] .x1; // Upper bound of the last bin
    const binsMaxLength = d3.max(bins, d => d.length); // Get the maximum length of the bins

    // Define scales (from shared constants)
    xScale
        .domain([0, 1800])
        .range([0, innerWidth]);

    yScale  
        .domain([0, binsMaxLength])
        .range([innerHeight, 0])
        .nice(); // Use the nice() method to round the y-axis values

    // Step 6.4 Draw the bars of the histogram
    innerChart
        .selectAll("rect")
        .data(bins)
        .join("rect")
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.x0))
            .attr("x", d => xScale(d.x0))
            .attr("y", d => yScale(d.length))
            .attr("width", d => xScale(d.x1) - xScale(d.x0))
            .attr("height", d => innerHeight - yScale(d.length))
            .attr("fill", barColor)
            .attr("stroke", bodyBackgroundColor) // Set the stroke color gives appearance of the gap
            .attr("stroke-width", 4);

    // Step 6.5 Add axes
    const bottomAxis = d3.axisBottom(xScale)

    // Add the x-axis to the bottom of the inner chart
    innerChart
        .append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis);

    // Add the x-axis label
    svg
        .append("text")
        .text("Labeled Energy Consumption (kWh/year)")
        .attr("text-anchor", "end")
        .attr("x", width - 20)
        .attr("y", height - 5)
        .attr("class", "axis-label"); // Set the color of the label in visualisation.css

    // Step 6.6 Add left axis
    const leftAxis = d3.axisLeft(yScale);

    // Add the y-axis to the left of the chart relative to the inner chart
    innerChart
        .append("g")
        .call(leftAxis);

    svg
        .append("text")
        .text("Frequency")
        .attr("x", 30)
        .attr("y", 20)
        .attr("class", "axis-label"); // Set the color of the label in visualisation.css

    // Tooltip for histogram bars
    const histTooltipWidth = 140;
    const histTooltipHeight = 40;

    const histTooltip = innerChart.append("g")
        .attr("class", "hist-tooltip")
        .style("opacity", 0)
        .style("pointer-events", "none");

    histTooltip.append("rect")
        .attr("width", histTooltipWidth)
        .attr("height", histTooltipHeight)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("fill", barColor)
        .attr("fill-opacity", 0.85);

    const histTooltipText = histTooltip.append("text")
        .attr("fill", "white")
        .style("font-size", "12px")
        .style("font-weight", 600)
        .attr("text-anchor", "middle");

    histTooltipText.append("tspan")
        .attr("class", "line1")
        .attr("x", histTooltipWidth / 2)
        .attr("y", 16);

    histTooltipText.append("tspan")
        .attr("class", "line2")
        .attr("x", histTooltipWidth / 2)
        .attr("y", 32);

    innerChart.selectAll(".bar")
        .on("mouseenter", (e, d) => {
            histTooltipText.select(".line1").text(`${d.x0}–${d.x1} kWh/year`);
            histTooltipText.select(".line2").text(`${d.length} TVs`);

            const barCentre = (xScale(d.x0) + xScale(d.x1)) / 2;
            const tipX = barCentre - histTooltipWidth / 2;
            const tipY = Math.max(0, yScale(d.length) - histTooltipHeight - 8);

            histTooltip
                .interrupt()
                .attr("transform", `translate(${tipX}, ${tipY})`)
                .transition()
                .duration(200)
                .style("opacity", 1);
        })
        .on("mouseleave", () => {
            histTooltip.interrupt().style("opacity", 0);
        })

    };
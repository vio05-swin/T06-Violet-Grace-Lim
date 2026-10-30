const drawScatterplot = (data) => {
    // T06-2 Step 2.2
    /// Set the dimensions and margins of the chart area
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width}, ${height}`) // Responsive SVG
    /// Create an inner chart group with margins
    innerChartS = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // T06-2 Step 2.3
    /// Set up x and y scales using data extents
    const xExtent = d3.extent(data, d => d.star); // Return minimum and maximum values.
    const yExtent = d3.extent(data, d => d.screenSize);

    const xScaleS = d3.scaleLinear()
        .domain([xExtent[0] - 0.5, xExtent[1] + 0.5])
        .range([0, innerWidth]);

    const yScaleS = d3.scaleLinear()
        .domain([yExtent[0], yExtent[1]])
        .range([innerHeight, 0])
        .nice();


    /// Map star ratings and screen sizes to positions within the chart area.

    // T06-2 Step 2.4
    /// (Corrected code) Set up colours for screen technologies
    const uniqueTechs = [...new Set(data.map(d => d.screenTech))];

    colorScale
        .domain(uniqueTechs)
        .range(d3.schemeCategory10);
    
    // T06-2 Step 2.5 Draw the circles
    innerChartS.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScaleS(d.star))
        .attr("cy", d => yScaleS(d.screenSize))
        .attr("r", 4)
        .attr("fill", d => colorScale(d.screenTech))
        .attr("opacity", 0.5);
    

    // T06-2 Step 2.6 Add bottom and left axis
    /// Add axes
    const bottomAxis = d3.axisBottom(xScaleS);
    innerChartS.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis);

    svg.append("text")
        .text("Star Rating")
        .attr("text-anchor", "end")
        .attr("x", width - 20)
        .attr("y", height - 5)
        .attr("class", "axis-label");

    const leftAxis = d3.axisLeft(yScaleS);
    innerChartS.append("g")
        .call(leftAxis);

    svg.append("text")
        .text("Screen size (inches)")
        .attr("x", 30)
        .attr("y", 20)
        .attr("class", "axis-label");

    // T06-2 Step 2.7 Add legend
    const legend = svg.append("g")
        .attr('class', 'legend')
        .attr('transform', `translate(${width - 140}, ${margin.top})`);

    uniqueTechs.forEach((tech, i) => {
        const g = legend.append('g').attr('transform', `translate(0, ${i * 22})`);
        g.append('rect')
         .attr('width', 12)
         .attr('height', 12)
         .attr('fill', colorScale(tech));
        
        g.append('text')
         .attr('x',18)
         .attr('y', 10)
         .text(tech)
         .attr('class', 'axis-label');
    });

};
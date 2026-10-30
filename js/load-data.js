// Load the CSV file with a row conversion function
d3.csv("data/Ex6_TVdata.csv", d => ({
    brand: d.brand,
    model: d.model,
    screenSize: +d.screenSize, // Convert screenSize to a number
    screenTech: d.screenTech,
    energyConsumption: +d.energyConsumption, // Convert energyConsumption to a number
    star: +d.star // Convert to number
})).then(data => {
    // Log the processed data to the console
    console.log(data);

    // T06-1 Step 4: Call functions after data is loaded
    drawHistogram(data); // Call the drawHistogram function with the loaded data
    populateFilters(data); // Call the populateFilters function with the loaded data

    // T06-2 Step 1.3 Call the drawScatterplot
    drawScatterplot(data); // Call the drawScatterplot function with the loaded data

    // T06-2 Step 3: Call the createTooltip() and handleMouseEvents() function
    createTooltip();
    handleMouseEvents();

}).catch(error => {
    console.error("Error loading the CSV file:", error);
});
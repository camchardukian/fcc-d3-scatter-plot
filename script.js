document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch(
        "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
    );
    if (!response.ok) {
        const errorMessage = `An error has occured: ${response.status}`;
        throw new Error(errorMessage);
    }

    const data = await response.json()

    const width = 800;
    const height = 400;
    const padding = 60;

    const xScale = d3.scaleLinear()
        .domain([d3.min(data, (d) => d.Year - 1), d3.max(data, (d) => d.Year + 1)])
        .range([padding, width - padding]);

    const yScale = d3.scaleLinear()
        .domain([
            d3.max(data, (d) => new Date(1000 * d.Seconds)),
            d3.min(data, (d) => new Date(1000 * d.Seconds))
        ])
        .range([height - padding, padding]);

    const svg = d3
        .select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    const legend = d3.select("svg")
        .append("g")
        .attr("id", "legend-container")
        .append("g")
        .attr("id", "legend")
    legend.append("circle").attr("cx", 730).attr("cy", 144).attr("r", 6).style("fill", "orange")
    legend.append("circle").attr("cx", 730).attr("cy", 159).attr("r", 6).style("fill", "green")
    legend.append("text").attr("x", 475).attr("y", 145).text("Performances with doping allegations").style("font-size", "16px").attr("alignment-baseline", "middle")
    legend.append("text").attr("x", 455).attr("y", 160).text("Performances without doping allegations").style("font-size", "16px").attr("alignment-baseline", "middle")

    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", (d) => `dot ${d.Doping ? 'doping-dot' : 'clean-dot'}`)
        .attr("cx", (d) => xScale(d.Year))
        .attr("cy", (d) => yScale(new Date(d.Seconds * 1000)))
        .attr("r", 5)
        .attr("data-xvalue", (d) => d.Year)
        .attr("data-yvalue", (d) => new Date(d.Seconds * 1000))
        .on("mouseenter", (item) => {
            const itemData = item.target?.__data__
            tooltip.transition()
                .style("visibility", "visible")
                .text(`Name: ${itemData.Name}
                Nationality: ${itemData.Nationality}
                Time: ${itemData.Time}
                Year: ${itemData.Year}
                Alleged Doping: ${itemData.Doping ? 'Yes' : 'No'}
                `)
                .attr("data-year", itemData.Year)
        })
        .on("mouseout", () => tooltip.transition().style("visibility", "hidden"))

    const xAxis = d3.axisBottom(xScale).tickFormat((d) => d)
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'))

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0,${height - padding})`)
        .call(xAxis)

    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding},0)`)
        .call(yAxis)
})

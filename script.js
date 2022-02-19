document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch(
        "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
    );
    if (!response.ok) {
        const errorMessage = `An error has occured: ${response.status}`;
        throw new Error(errorMessage);
    }

    const data = await response.json()
    console.log('dataaa', data)

    const width = 800;
    const height = 400;
    const padding = 60;

    const xScale = d3.scaleLinear()
        .domain([d3.min(data, (d) => d.Year), d3.max(data, (d) => d.Year + 1)])
        .range([padding, width - padding]);

    const yScale = d3.scaleLinear()
        .domain([d3.max(data, (d) => d.Seconds), d3.min(data, (d) => d.Seconds)])
        .range([height - padding, padding]);

    const svg = d3
        .select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", (d) => xScale(d.Year))
        .attr("cy", (d) => yScale(d.Seconds))
        .attr("r", 5)
        .attr("data-xvalue", (d) => d.Year)
        .attr("data-yvalue", (d) => {
            const customDateValue = new Date(null)
            customDateValue.setUTCMinutes(d.Time.substring(0, 2))
            customDateValue.setUTCSeconds(d.Time.substring(4))
            return customDateValue;
        })

    const xAxis = d3.axisBottom(xScale).tickFormat((d) => d)
    const yAxis = d3.axisLeft(yScale).tickFormat((d) => new Date(1000 * d).toISOString().substring(14, 19))

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0,${height - padding})`)
        .call(xAxis)

    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding},0)`)
        .call(yAxis)
})

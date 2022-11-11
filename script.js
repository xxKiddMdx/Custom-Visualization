//Author: Peiyu Zhong - zhongpd@bc.edu

function scatterPlot(data) {
  const margin = { top: 20, right: 20, bottom: 20, left: 50 };
  const width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.miles))
    .nice()
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.gas))
    .nice()
    .range([height, 0]);

  svg
  .append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0, ${height})`);

  svg.append("g").attr("class", "y-axis");

  const xAxis = d3.axisBottom().scale(xScale).ticks(7);
  
  const yAxis = d3
    .axisLeft()
    .scale(yScale)
    .ticks(12)
    .tickFormat(function (d) {
      return "$" + d3.format(".2f")(d);
    });

  svg
    .selectAll()
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.miles))
    .attr("cy", (d) => yScale(d.gas))
    .attr("r", 4)
    .style("fill", "#A5C9CA");

  d3.select(".x-axis").call(xAxis);
  d3.select(".y-axis").call(yAxis);

  // adding labels
  svg
    .selectAll()
    .data(data)
    .enter()
    .append("text")
    .attr("x", (d) => xScale(d.miles))
    .attr("y", (d) => yScale(d.gas))
    .text((d) => d.year)
    .each(function position(d) {
      const t = d3.select(this);
      switch (d.side) {
        case "top":
          t.attr("text-anchor", "middle").attr("dy", "-0.7em");
          break;
        case "bottom":
        t.attr("text-anchor", "middle").attr("dy", "1.4em");
        break;
        case "left":
          t.attr("dx", "-0.5em")
            .attr("dy", "0.32em")
            .attr("text-anchor", "end");
          break;
        case "right":
          t.attr("dx", "0.5em")
            .attr("dy", "0.32em")
            .attr("text-anchor", "start");
          break;
      }
    })
    .call(halo);

  d3.select(".y-axis").select(".domain").remove();

  d3.select(".y-axis")
    .selectAll(".tick line")
    .clone()
    .attr("x2", width)
    .attr("stroke-opacity", 0.1);

  d3.select(".x-axis").select(".domain").remove();
  d3.select(".x-axis")
    .selectAll(".tick line")
    .clone()
    .attr("y2", -height)
    .attr("stroke-opacity", 0.1);

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", 110)
    .attr("y", 5)
    .text("Cost per gallon")
    .attr("font-weight", 700);

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 5)
    .text("Miles per person per year")
    .attr("font-weight", 700);

  const line = d3
    .line()
    .x((d) => xScale(d.miles))
    .y((d) => yScale(d.gas));

  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#2C3333")
    .attr("stroke-width", 1.5)
    .attr("d", line);
}

function halo(text) {
  text
    .select(function () {
      return this.parentNode.insertBefore(this.cloneNode(true), this);
    })
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 4)
    .attr("stroke-linejoin", "round");
}

d3.csv("driving.csv", d3.autoType).then((data) => {
  scatterPlot(data);
});

// Start by creating the svg area
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", 400)
    .attr("height", 400)

// Append a circle
svg.append("circle")
  .attr("id", "circleBasicTooltip")
  .attr("cx", 150)
  .attr("cy", 200)
  .attr("r", 40)
  .attr("fill", "#69b3a2")

// create a tooltip
var tooltip = d3.select("#my_dataviz")
  .append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .text("I'm a circle!");

//
d3.select("#circleBasicTooltip")
  .on("mouseover", function(){
      tooltip.style("visibility", "visible");
      console.log(d3.select(this).attr("cy") + "px");
      return tooltip.style("top", "20px")
      .style("left", "50px")
    })
//   .on("mousemove", function(){
//       console.log(d3.event.pageX);
//       console.log(d3.event.pageY);
//       console.log(d3.event.);
//       return tooltip.style("top", (d3.event.pageY-20)+"px")
//       .style("left",(d3.event.pageX-20)+"px");
//     })
  .on("mouseout", function(){
      return tooltip.style("visibility", "hidden");
    });

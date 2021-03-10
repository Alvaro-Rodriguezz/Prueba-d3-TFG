// import zoom from "https://d3js.org/d3-zoom.v2.min.js";
var root;
var i;
var tree;
var diagonal;
var svg;
var drag;
var force;
var zoom; 
// var g;

var treeData = [
    {
        "name": "Top Level",
        "parent": "null",
        "categoria": "sustantivo",
        "children": [
            {
                "name": "Level 2: A",
                "parent": "Top Level",
                "categoria": "sustantivo",
                "children": [
                    {
                        "name": "Son of A",
                        "categoria": "adjetivo",
                        "parent": "Level 2: A"
                    },
                    {
                        "name": "Daughter of A",
                        "categoria": "sustantivo",
                        "parent": "Level 2: A"
                    }
                ]
            },
            {
                "name": "Level 2: B",
                "categoria": "adjetivo",
                "parent": "Top Level"
            }
        ]
    }
];


console.log({treeData});
const width = document.body.clientWidth;
const height = document.body.clientHeight;
const margin = { top: 0, right: 50, bottom: 0, left: 75};
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
console.log({margin})

i = 0;
duration = 750;
svg = d3.select('svg');

const zoomG = svg
    .attr('width', width)
    .attr('height', height)
  .append('g').attr('id', "2");

const g = zoomG
    .attr('transform', `translate(${margin.left},${margin.top})`);

zoomG.call(d3.zoom().on('zoom', () => {
    console.log({zoomG});
    zoomG.attr('transform', d3.event.transform);
}));

tree = d3.layout.tree()
    .size([innerHeight, innerWidth]);

diagonal = d3.svg.diagonal()
    .projection(function (d) { return [d.y, d.x]; });

// zoom = d3.zoom().scaleExtent([0.1, 10]);
// console.log({zoom});



console.log({svg});
root = treeData[0];
root.x0 = height / 2;
root.y0 = 0;


update(root);



function update(source) {

    // Compute the new tree layout.
    console.log({root});
    var nodes = tree.nodes(root);
    console.log({nodes})
    var links = tree.links(nodes);
    console.log({links});
    // // Normalize for fixed-depth.
    nodes.forEach(function (d) { 
        d.y = d.depth * 180; 
    });

    // // Update the nodes
    var node = zoomG.selectAll("g.node").data(nodes, function (d) { 
        return d.id || (d.id = ++i); 
    });
    console.log({node});

    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", click);

    console.log({nodeEnter});

    nodeEnter.append("div")
        .style("width", "100px")
        .style("height", "100px")
        .style("background-color", "red")
        .text("test")
        .attr("id", function(d) { return d.id;});

    nodeEnter.append("rect")
        .attr("width", 50)
        .attr("height", 30)
        .style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; })
        .style("stroke", function (d) { 
            switch(d.categoria){
                case 'adjetivo':
                    return "red"
                case 'sustantivo':
                    return "black"
            }
        });
    nodeEnter.append("text")        
        .attr("dy", ".35em")
        .text(function (d) { return d.name; })
        .style("fill-opacity", 1e-6);
        console.log({nodeEnter});
        
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("rect")
        .attr("width", function (d) { return Number(d.name.length * 8);})
        .attr("height", 30)
        .attr("x", -10)
        .attr("y", -15)
        .attr("rx", 10)
        .attr("ry", 10)
        .style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; })
        .style("stroke", function (d) { 
            switch(d.categoria){
                case 'adjetivo':
                    return "red"
                case 'sustantivo':
                    return "black"
            }
        });

    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    nodeUpdate.select("div")
        .style("width", "100px")
        .style("height", "100px")
        .style("background-color", "red")
        .text("test");    

    // // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();

    nodeExit.select("rect")
    .attr("width", 50)
    .attr("height", 30)

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    // // Update the links
    var link = zoomG.selectAll("path.link")
        .data(links, function (d) { return d.target.id; });

    // // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function (d) {
            var o = { x: source.x0, y: source.y0 };
            return diagonal({ source: o, target: o });
        });

    // // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function (d) {
            var o = { x: source.x, y: source.y };
            return diagonal({ source: o, target: o });
        })
        .remove();

    // // Stash the old positions for transition.
    nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

// Toggle children on click.
function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
}


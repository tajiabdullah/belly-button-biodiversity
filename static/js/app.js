// D3 to Read JSON File
d3.json("samples.json").then(function createPlotly(data) {
    console.log(data);
    var testid = data.names;
    console.log(testid);
  
    // Drop Down Menu
    d3.select("#selDataset")
      .selectAll("option")
      .data(testid)
      .enter()
      .append("option")
      .html(function(d) {
        return `<option>${d}</option`;
      });
  
    // Select Option
    var dropdownMenu = d3.select("#selDataset");
    var dropdownValue = dropdownMenu.property("value");
    var index = testid.indexOf(dropdownValue);
  
    // Demographic Info
    d3.select("#sample-metadata").html("");
    d3.select("#sample-metadata")
      .selectAll("p")
      .data(Object.entries(data.metadata[index]))
      .enter()
      .append("p")
      .html(function(d) {
        return `${d[0]} : ${d[1]}`;
      });
  
    console.log(Object.entries(data.metadata[index]));
  
    // Bar Graph
    var defaultsampleData = data.samples[index].sample_values
      .slice(0, 10)
      .reverse();
    var defaultotuData = data.samples[index].otu_ids.slice(0, 10).reverse();
    var defaultotuLabels = data.samples[index].otu_labels.slice(0, 10).reverse();
    var defaultyxis = defaultotuData.map(a => "OTU" + a);
  
    var bardata = [
      {
        x: defaultsampleData,
        y: defaultyxis,
        type: "bar",
        orientation: "h",
        text: defaultotuLabels
      }
    ];
  
    var barLayout = {
      title: "TOP10 Sample Values",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU ID" }
    };
  
    Plotly.newPlot("bar", bardata, barLayout);
  
    // Bubble Chart
    var bubbleData = [
      {
        x: data.samples[index].otu_ids,
        y: data.samples[index].sample_values,
        mode: "markers",
        text: data.samples[index].otu_labels,
        marker: {
          size: data.samples[index].sample_values,
          color: data.samples[index].otu_ids,
          colorscale: "Viridis"
        }
      }
    ];
  
    var bubbleLabels = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };
  
    Plotly.newPlot("bubble", bubbleData, bubbleLabels);
  
    // Gauge Chart
    var degrees = 10 - data.metadata[index].wfreq,
      radius = 0.6;
    var radians = (degrees * Math.PI) / 10;
    var aX = 0.025 * Math.cos((degrees - 5 * Math.PI) / 10);
    var aY = 0.025 * Math.sin(((degrees - 5) * Math.PI) / 10);
    var bX = -0.025 * Math.cos(((degrees - 5) * Math.PI) / 10);
    var bY = -0.025 * Math.sin(((degrees - 5) * Math.PI) / 10);
    var cX = radius * Math.cos(radians);
    var cY = radius * Math.sin(radians);
  
    var path =
      "M " + aX + " " + aY + " L " + bX + " " + bY + " L " + cX + " " + cY + " Z";
  
    var gaugedata = [
      {
        type: "scatter",
        x: [0],
        y: [0],
        marker: { size: 14, color: "850000" },
        showlegend: false,
        name: "Wash per Week",
        text: data.metadata[index].wfreq,
        hoverinfo: "text+name"
      },
      {
        // 10 Elements and Half of Pie Chart
        values: [
          50 / 9,
          50 / 9,
          50 / 9,
          50 / 9,
          50 / 9,
          50 / 9,
          50 / 9,
          50 / 9,
          50 / 9,
          50
        ],
        labels: [
          "0-1",
          "1-2",
          "2-3",
          "3-4",
          "4-5",
          "5-6",
          "6-7",
          "7-8",
          "8-9",
          ""
        ],
        marker: {
          colors: [
            "rgb(247,242,236)",
            "rgb(243,240,229)",
            "rgb(233,231,201)",
            "rgb(229,233,177)",
            "rgb(213,229,149)",
            "rgb(183,205,139)",
            "rgb(135,192,128)",
            "rgb(133,188,139)",
            "rgb(128,181,134)",
            "rgba(255, 300, 255, 0)"
          ]
        },
  
        hole: 0.5,
        type: "pie",
        direction: "clockwise",
        rotation: 90,
        text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
        textinfo: "text",
        textposition: "inside",
        hoverinfo: "none",
        showlegend: false
      }
    ];
  
    var gaugeLayout = {
      shapes: [
        {
          type: "path",
          path: path,
          fillcolor: "850000",
          line: {
            color: "850000"
          }
        }
      ],
      title: "Belly Botton Washing Frequency per Week",
      xaxis: { visible: false, range: [-1, 1] },
      yaxis: { visible: false, range: [-1, 1] }
    };
  
    Plotly.newPlot("gauge", gaugedata, gaugeLayout);
  
    // Selecting Different Test ID
    d3.select("#selDataset").on("change", optionChanged);
  
    function optionChanged() {
      var dropdownMenu = d3.select("#selDataset");
      var dropdownValue = dropdownMenu.property("value");
  
      // Update Dashboard
      createPlotly(data);
    }
  });
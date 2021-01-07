function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObject => sampleObject.id == sample);
    var result = resultArray[0]; 
    var PANEL = d3.select("#sample-metadata");
    
    PANEL.html("");

    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}


//---------------------------------------------------

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObject => sampleObject.id == sample);
    var result = resultArray[0];

    var sample_values = result.sample_values;
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    
    // const sample_values = data.sample_values;
    // const otu_ids = data.otu_ids;
    // const otu_labels = data.otu_labels;
    
//---------------------------------------------------
// Bubble Chart
var bubbleLayout = {
  margin: { t: 0 },
  hovermode: "closest",
  xaxis: { title: "OTU ID" },
  margin: { t: 30}
};

var bubbleData = [
  {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: "markers",
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: "Earth"
    }
  }
];

Plotly.newPlot("bubble", bubbleData, bubbleLayout);

//---------------------------------------------------


    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var barData = [
      {
        x: sample_values.slice(0, 10).reverse(),
        y: yticks,
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    var barLayout = {
      margin: { t: 50, l: 300 }
    };

    Plotly.newPlot("bar", barData, barLayout);
  });
}



//---------------------------------------------------
function init() {
  var selector = d3.select("#selDataset");

  
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

  
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


//---------------------------------------------------
function optionChanged(newSample) {
  
  buildCharts(newSample);
  buildMetadata(newSample);
}

//---------------------------------------------------
init();

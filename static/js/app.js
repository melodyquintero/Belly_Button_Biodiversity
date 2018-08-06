function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  const metaDatatURL = `/metadata/${sample}`;
  d3.json(metaDatatURL).then(function(data) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select(`#sample-metadata`);
    // Use `.html("") to clear any existing metadata
    panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).map(function([key,value]){
      panel.append('P').text(`${key}: ${value}`);
    });
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
  buildGauge(data.WFREQ);
  })
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  const sampleDatatURL = `/samples/${sample}`;

  d3.json(sampleDatatURL).then(function(data) {

    // @TODO: Build a Bubble Chart using the sample data

    var BubbleTrace = {
      x: data.otu_ids,
      y: data.sample_values,
      mode='markers',
      text: data.otu_labels,
      marker: {
        color: data.otu_ids,
        size: data.sample_values
      }
    };

    Plotly.newPlot('bubble', [BubbleTrace]);


    // @TODO: Build a Pie Chart
    var top_sample_values = data.sample_values.slice(0,10);
    var top_otu_ids = data.otu_ids.slice(0,10);
    var top_otu_labels = data.otu_labels.slice(0,10);


    var PieTrace = {
      "labels": top_otu_ids,
      "values": top_sample_values,
      "hovertext": top_otu_labels,
      "type": "pie",
    };

    
    Plotly.newPlot('pie', [PieTrace]);
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

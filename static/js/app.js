// parsing data and plotting charts

function plotCharts(sample) {
  d3.json("samples.json").then((importData) => {


    var samplesData = importData.samples;
    var resultArr= samplesData.filter(sampleObj => sampleObj.id == sample);
    var result= resultArr[0]

    // console.log(result);

    var otuIds = result.otu_ids;
    var otuLabels = result.otu_labels;
    var values = result.sample_values;

    //  plotting bar Chart

    var barTrace = {
        // using slice and reverse function grab the first 10 OTUs
        // and to re-arrange the order of the bar chart
        y: otuIds.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse(),
        x: values.slice(0, 10).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        type:"bar",
        orientation:"h"
    };

    var barData = [barTrace];

    var barLayout = {
        margin: { t: 5}
    };

    Plotly.newPlot('bar', barData, barLayout);

    // plotting bubble chart

    var bubbleTrace = {
        x: otuIds,
        y: values,
        text: otuLabels,
        mode: "markers",
        marker: {
          color: otuIds,
          size: values,
        },
        showlegend: false
    };

    var bubbleData = [bubbleTrace];

    var bubbleLayout = {
        margin: { t: 0, l: 60 },
        xaxis: { title: "OTU ID" },
        hovermode: "closest"
    };

    Plotly.plot('bubble', bubbleData, bubbleLayout);

  });
}

// use d3 to load json file and display selected sample metadata in the metadata panel

function displayMetadata(sample) {
  d3.json("samples.json").then((samples) => {

    var metaData = samples.metadata;

    // console.log(metaData);

    // filter out the sample by selected id
    var resultArr = metaData.filter(obj => obj.id == sample);

    // console.log(resultArr);

    // assign the value of the item list resultsArr to variable
    var result = resultArr[0];

    // console.log(result);

    // console.log(result.wfreq);

    // use d3 to grab the sample-metadata
    var panel = d3.select("#sample-metadata");

    // clear the existing content
    panel.html("");

    // display key & value pair for selected sample
    Object.entries(result).forEach(([k, v]) => {

      panel.append("p").text(`${k}: ${v}`);
    });

    // Advanced Challenge Assignment (Optional)

    // calling the function to plot and display gauge chart
    var needlePos = result.wfreq*18 // align the needle position
    gaugeChart(needlePos);
  });
}

// calculate the needle position
function gaugePointer(value){

  var degrees = 180 - value,
	    radius = .45;
  var radians = degrees * Math.PI/ 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // setting up Path
  var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
	    pathX = String(x),
	    space = ' ',
	    pathY = String(y),
	    pathEnd = ' Z';
  var path = mainPath.concat(pathX, space, pathY, pathEnd);

	return path;
}

// gauge chart, adapted from codepen.io
function gaugeChart(value) {
  var data = [{ type: 'scatter',
      x: [0], y:[0],
      marker: {size: 15, color:'850000'},
      showlegend: false,
      name: 'wfreq',
      text: value,
      hoverinfo: 'none'},
      { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3','1-2','0-1'],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:['rgba(5, 145, 0, .5)','rgba(14, 115, 0, .5)', 'rgba(110, 154, 22, .5)',
               'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
               'rgba(210, 206, 145, .5)', 'rgba(200, 185, 165, .5)',
               'rgba(232, 226, 202, .5)', 'rgba(200, 205, 202, .5)', 'white']},
      hoverinfo: 'skip',
      hole: .5,
      type: 'pie',
      showlegend: false,
      showticklabels: false,
  }];

  var layout = {
    title: {
      text: '<b> Belly Button Washing Frequency </b> <br> Scrubs per Week',
      y: 0.9,
      x: 0.5,
      xanchor: 'top',
      yanchor: 'top',
      font: {
        family: 'Courier New',
        size: 20,
        color: 'black'
      },
    },
    shapes:[{
        type: 'path',
        path: gaugePointer(value),
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
    showlegend: false,
    autosize:true,
    xaxis: { zeroline: false, showticklabels: false,
            showgrid: false, range: [-1, 1]},
    yaxis: { zeroline: false, showticklabels: false,
            showgrid: false, range: [-1, 1]}
  };

  Plotly.newPlot('gauge', data, layout);

}

// loading the content onto the webpage
function init() {
  // use d3 to grab the selection of the dropdown
  var selectedID = d3.select("#selDataset");

  // use the list of sample names to populate the select options
  d3.json("samples.json").then((samples) => {
    var sampleNames = samples.names
    // console.log(sampleNames);

    // append id values to set a list of options
    // for each sample in the dropdown menu
    sampleNames.forEach((sample) => {
      selectedID.append("option")
                .text(sample)
                .property("value", sample);
    });

    // console.log(sampleNames)

    // select the first sample item in the dataset to display plotting
    var iSample = sampleNames[0];

    plotCharts(iSample);
    displayMetadata(iSample);
  });
}

// handle change everytime a new sample data is selected
function optionChanged(selectedSample) {

  plotCharts(selectedSample);
  displayMetadata(selectedSample);
}

init();
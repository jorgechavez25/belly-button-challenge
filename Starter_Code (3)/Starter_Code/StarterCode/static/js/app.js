// open json and d3 select

function init() {
    // get reference to pull-down menu
    let dropdownMenu = d3.select("#selDataset");
    

    // Use the D3 library to read in samples.json from the URL https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json.
    // get data, located in samples.json
    d3.json('https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json').then((data) => {

        // get names
        let names = data.names;

        //fill in dropdown menu
        for (let index = 0; index < names.length; index++) {
            dropdownMenu
                .append('option')
                .text(names[index])
                .property('value', names[index])

        };

        //upload with initial data
        let firstSample = names[0]
            buildBarchart(firstSample);
            buildMetaData(firstSample);
            bubbleChart(firstSample);
    });


}
init();

// Update all the plots when a new sample is selected.
function optionChanged(newSample) {
    console.log(newSample);
    buildBarchart(newSample);
    buildMetaData(newSample);
    bubbleChart(newSample);

 
}
optionChanged();


//create bar chart
function buildBarchart(sample) {
    // load data
    d3.json('https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json').then((data) => {
    
        //parse and filter data
        let samples = data.samples;
        let sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
        let result = sampleArray[0];
        
        
        let otu_ids = result.otu_ids;
        

        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;
        console.log(sample_values);
        
        let yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

        // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
        let trace1 = {
            // Use sample_values as the values for the bar chart.
            x : sample_values.slice(0,10).reverse(),
            // Use otu_ids as the labels for the bar chart.
            y : yticks,
            // Use otu_labels as the hovertext for the chart.
            text: otu_labels.slice(0,10).reverse(),
            type: 'bar',
            orientation: 'h'
    
        };
    
        //turn data into array
        let traceData = [trace1];

        let layout = {
        title: "OTU Values",
        margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 100
        }
        };

        
        Plotly.newPlot("bar", traceData, layout);
});
    

}

buildBarchart();


// Display each key-value pair from the metadata JSON object somewhere on the page.
function buildMetaData(sample) {
    d3.json('https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json').then((data) => {
    
    let metadata = data.metadata;
    let metaArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = metaArray[0]

    let panel = d3.select('#sample-metadata');
    
    

    //append panel with metadata
    for (key in result){
        panel.append('h6')
        .text(`${key}: ${result[key]}`);
    };
});


}

// Create a bubble chart that displays each sample.
    //* Use sample_values for the marker size.
    //* Use otu_ids for the marker colors.
    //* Use otu_labels for the text values.
function bubbleChart(sample) {
    //load data
    d3.json('https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json').then((data) => {

    let samples = data.samples;
    let sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = sampleArray[0];

        let trace = {
    // * Use otu_ids for the x values.
    // * Use sample_values for the y values.
    // * Use sample_values for the marker size.
    // * Use otu_ids for the marker colors.
    // * Use otu_labels for the text values.
        x: result.otu_ids,
        y: result.sample_values,
        text: result.otu_labels,
        mode: 'markers',
        marker: {
            size: result.sample_values,
            color: result.otu_ids
                }

        };

        bubbleLayout= {
            title: 'Bacteria by size',
            xaxis: {title: 'OTU ID'}
        };

        Plotly.newPlot('bubble', [trace], bubbleLayout);

    });


}


let jsonFile = "data/samples.json"

function init(){
    d3.json(jsonFile).then((data) => {
        d3.select("#selDataset").selectAll("option")
            .data(data.names)
            .enter()
            .append("option")
            .html(function(d){
                return `<option>${d}</option>`;
            });

        let chartData = data.samples.filter(sample => sample.id == data.names[0]);
        let values = chartData[0].sample_values.slice(0,10).reverse();
        let otuIDs = chartData[0].otu_ids.slice(0,10).reverse();
        let labels = [];
        otuIDs.forEach(label => labels.push(`OTU ${label}`));
        let hovertext = chartData[0].otu_labels.slice(0,10).reverse();
          
        let data1 = [{
            type: 'bar',
            x: values,
            y: labels,
            orientation: 'h',
            mode:'markers',
            marker: {size:16},
            text: hovertext
        }];
          
        Plotly.newPlot("bar",data1);
            
        let chartData2 = data.samples.filter(sample => sample.id == data.names[0]);
        let otu_ids = chartData2[0].otu_ids;
        let values2 = chartData2[0].sample_values;
        let labels2 = chartData2[0].otu_labels;

        let data2 = [{
            x: otu_ids,
            y: values2,
            mode:'markers',
            marker: { color: otu_ids,
                size: values2},
            text: labels2
        }];

        let layout = {xaxis: {title: "OTU ID"}};

        Plotly.newPlot("bubble", data2, layout);

        updateInfo(data.names[0]);
    });
};

function buildBarChart(sampleID) {
  d3.json(jsonFile).then((data) => {
      let chartData = data.samples.filter(sample => sample.id == sampleID);
      let values = chartData[0].sample_values.slice(0,10).reverse();
      let otuIDs = chartData[0].otu_ids.slice(0,10).reverse();
      let labels = [];
      otuIDs.forEach(label => labels.push(`OTU ${label}`));
      let hovertext = chartData[0].otu_labels.slice(0,10).reverse();

    Plotly.restyle("bar", "x", [values]);
    Plotly.restyle("bar", "y", [labels]);
    Plotly.restyle("bar", "text", [hovertext]);
    });
};

function buildBubbleChart(sampleID) {
    d3.json(jsonFile).then((data) => {
        let chartData = data.samples.filter(sample => sample.id == sampleID);
        let otu_ids = chartData[0].otu_ids;
        let values = chartData[0].sample_values;
        let labels = chartData[0].otu_labels;

        Plotly.restyle("bubble", "x", [otu_ids]);
        Plotly.restyle("bubble", "y", [values]);
        Plotly.restyle("bubble", "text", [labels]);
        Plotly.restyle("bubble", "marker.color", [otu_ids]);
    });
};

function updateInfo(sampleID) {
    d3.json(jsonFile).then((data) => {
        let demoData = data.metadata.filter(person => person.id == sampleID);
        let demoBox = d3.select("#sample-metadata");
        demoBox.html("");
        demoData.forEach((item) => {
            Object.entries(item).forEach(([key, value]) => {
                demoBox.append("p").text(key + ": " + value);
            });
        });
    });    
};

function optionChanged(sampleID) {
    buildBarChart(sampleID);
    buildBubbleChart(sampleID);
    updateInfo(sampleID);
};

init();
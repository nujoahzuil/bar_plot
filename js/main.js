
// Initialize helper function

let data, stackedBarChart; 

/**
 * Load data from CSV file asynchronously and render area chart
 */

d3.csv('data/A1_Data.csv')
  .then(_data => {
    // get the keys from the data and compute the total population (you are required to use sum function)

    data = _data;
    //var keys = data.columns.slice(1);
    var keys = data.columns.slice(1);
    data.forEach(function(d) {
			d.Population = d3.sum(keys, keys => d[keys])
			return d
		});
    console.log(data);
    // Initialize and render chart
    stackedBarChart = new StackedAreaChart(data);
    stackedBarChart.updateVis();
  });


/**
 * Select box event listener
 */

// 
d3.select('#display-type-selection').on('change', function() {
  // Get selected display type and update chart
  stackedBarChart.displayType = d3.select(this).property('value');
  stackedBarChart.updateVis();
});
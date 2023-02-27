

class StackedAreaChart {

    /**
     * Class constructor with basic chart configuration
     * @param {Array}
     */
    constructor( _data) {
     this.margin = {top: 50, right: 60, bottom: 30, left: 70};
     this.width = 1200 - this.margin.left - this.margin.right;
     this.height = 800 - this.margin.top - this.margin.bottom;
     this.displayType = 'Bar';
     this.data = _data;
     this.initVis();
    }
    
    /**
     * Initialize scales/axes and append static chart elements
     */
    initVis() {
      let vis = this;
      vis.svg_width = 1200;
      vis.svg_height = 800;
      // Select HTML tag, add a SVG, and set the attributes
  
      // TO DO
      vis.svg = d3.select('svg')
      .attr('width',vis.svg_width)
      .attr('height',vis.svg_height)
      .append("g")//group
      .attr('transform', `translate(${vis.margin.left}, ${vis.margin.top})`);
  
      // Create scales for x and y axis
      // TO DO
      vis.xScaleFocus = d3.scaleBand().domain(this.data.map(function(d) { return d.State; })).range([0, vis.width]).padding(0.05);
      vis.yScaleFocus = d3.scaleLinear().domain([0, d3.max(vis.data, function(d) { return d.Population;})]).range([vis.height, 0])//.nice();
      //vis.yScaleFocus.domain([0, d3.max(vis.data, function(d) { return d.Population;})]);
      // // Create x and y axis, create two groups for x and y axis, and add these groups in SVG
      // // TO DO
  
      vis.xAxis = d3.axisBottom(vis.xScaleFocus).tickSizeOuter(0);
      vis.yAxis = d3.axisLeft(vis.yScaleFocus);
  
  
      vis.svg.append("text")
             .attr("class", "ylabel")
             .attr("y", 0 - vis.margin.left+30)
             .attr("x", 0 - (vis.height/120))
             .attr("dy", "1em")
             .attr("transform", "rotate(0)")
             .style("text-anchor", "middle")
             .text("Population");
  
      // Get the population under different age categories and assign color
  
      vis.subgroups = vis.data.columns.slice(1);
  
      vis.colorScale = d3.scaleOrdinal()
                         .range(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69"])
                         .domain(vis.subgroups)
      // color is represented by hex value (a link for the relationship among different color representations)
      // https://imagecolorpicker.com/color-code 
      // Feel free to use your own color set
  
  
  
      // Get stacked data and sort 
      // Hint: the following functions will be used during implementing this part: 
      //map() and sort() functions in array and d3.stack() for stacked bar chart
      // TO DO
      this.groups = this.data.map(function(d) { return d.State; })
      const obj1 =[...this.data];
      obj1.sort((front, back)=>back.Population-front.Population);
      this.data_sorted = obj1;
  
      this.keys = data.columns.slice(1);
      var stack =d3.stack().keys(vis.keys)
      this.stackedData = stack(vis.data)
      this.sort_stackedData = stack(vis.data_sorted)
      this.sorted_groups = this.data_sorted.map(function(d) { return d.State; })
    }
  
    /**
     * Prepare the data and scales before we render it.
     */
     updateVis(){
        let vis = this;
        vis.yAxisG = vis.svg.append('g')
        .call(vis.yAxis);

        if (vis.displayType == 'Sorted'){

            vis.xAxisG.remove()
            //d3.selectAll('unsorted').remove()

            vis.xScaleFocus.domain(vis.sorted_groups);
               vis.xAxis = d3.axisBottom(vis.xScaleFocus);
               vis.xAxisG=vis.svg.append('g').attr("transform",  `translate(0, ${vis.height})`).call(vis.xAxis);
        
               // sorted_groups is a set of states after sorting by total population
              }

          else{ 
            if (vis.xAxisG){
                vis.xAxisG.remove();
            }
            //
              vis.xScaleFocus.domain(vis.groups);
              vis.xAxis = d3.axisBottom(vis.xScaleFocus);
              vis.xAxisG=vis.svg.append('g').attr("transform",  `translate(0, ${vis.height})`).call(vis.xAxis);
              // groups is a set of states without sorting
          }

          vis.renderVis(); 
      }
  
    /**
     * This function contains the D3 code for binding data to visual elements
     * Important: the chart is not interactive yet and renderVis() is intended
     * to be called only once; otherwise new paths would be added on top
     */
    renderVis(){
  
          let vis = this;

          if (vis.displayType =='Bar') {
              // Visualzie Bar Chart
              // TO DO
          
          d3.selectAll('rect').remove();
          if(vis.dot){
            vis.dot.remove();
          }
          if(vis.legend){
            vis.legend.remove();
          }
          //d3.selectAll("legend").remove();

          d3.select('svg')
          .selectAll("rect")
          .data(this.data)
          .join('g')
          .attr('transform', `translate(${vis.margin.left}, ${vis.margin.top})`)
          .append("rect")
          .attr("x", function(d) { return vis.xScaleFocus(d.State); })
          .attr("y", function(d) { return vis.yScaleFocus(d.Population); })
          .attr("width", vis.xScaleFocus.bandwidth())
          .attr("height", function(d) { return vis.height - vis.yScaleFocus(d.Population); })
          
          .attr("fill", "#69b3a0");
          }
          else if (vis.displayType=='Stacked') {
              // Visualize Stacked Bar Chart
              // TO DO
              if(vis.dot){
                vis.dot.remove();
              }
              if(vis.legend){
                vis.legend.remove();
              }

              const xValue = d => d.State
              d3.selectAll('rect').remove();
              var g = d3.select('svg').append('g').attr('id', 'maingroup')
              .attr('transform', `translate(${vis.margin.left}, ${vis.margin.top})`);
  
              g.selectAll('stacked').data(vis.stackedData).join('g')
              .attr('class', 'stacked')
              .attr('fill', d => vis.colorScale(d.key))
              .selectAll('.rect').data(d => d).join('rect')
              .attr('class', 'rect')
              .attr('y', d => vis.yScaleFocus(d[1]))
              .attr('x', d => vis.xScaleFocus(xValue(d.data)))
              .attr('height', d => vis.yScaleFocus(d[0]) - vis.yScaleFocus(d[1]))
              .attr('width', vis.xScaleFocus.bandwidth());
            
              vis.dot=vis.svg.selectAll("mydots")
              .data(vis.subgroups)
              .enter()
              .append("circle")
              .attr('class','legend')
                  .attr("cx", 900)
                  .attr("cy", function(d,i){ return 150 - i*20}) // 100 is where the first dot appears. 25 is the distance between dots
                  .attr("r", 7)
                  .style('fill', d => vis.colorScale(d))
    
              vis.legend=vis.svg.selectAll("mydots")
              .data(vis.subgroups)
              .attr('class','legend')
              .enter()
              .append("text")
                  .attr("x", 920)
                  .attr("y", function(d,i){ return 150 - i*20}) // 100 is where the first dot appears. 25 is the distance between dots
                  .style('fill', "#000000")
                  .text(d=>d)
                  .attr("text-anchor", "left")
                  .style("alignment-baseline", "middle")
              
          }
          else if (vis.displayType=='Sorted') {
  
              // Visualize Sorted Stacked Bar Chart
              // TO DO
              if(vis.dot){
                vis.dot.remove();
              }
              if(vis.legend){
                vis.legend.remove();
              }
              
              const xValue = d => d.State
              d3.selectAll('rect').remove();

              var g = d3.select('svg').append('g').attr('id', 'maingroup')
              .attr('transform', `translate(${vis.margin.left}, ${vis.margin.top})`);
              
              g.selectAll('stacked').data(vis.sort_stackedData).join('g')
              .attr('fill', d => vis.colorScale(d.key))
              .selectAll('.rect').data(d => d).join('rect')
              .attr('class', 'sort_rect')
              .attr('y', d => vis.yScaleFocus(d[1]))
              .attr('x', d => vis.xScaleFocus(xValue(d.data)))
              .attr('height', d => vis.yScaleFocus(d[0]) - vis.yScaleFocus(d[1]))
              .attr('width', vis.xScaleFocus.bandwidth());
            
              vis.dot=vis.svg.selectAll("mydots")
              .data(vis.subgroups)
              .enter()
              .append("circle")
              .attr('class','legend')
                  .attr("cx", 900)
                  .attr("cy", function(d,i){ return 150 - i*20}) // 100 is where the first dot appears. 25 is the distance between dots
                  .attr("r", 7)
                  .style('fill', d => vis.colorScale(d))
    
              vis.legend=vis.svg.selectAll("mydots")
              .data(vis.subgroups)
              .attr('class','legend')
              .enter()
              .append("text")
                  .attr("x", 920)
                  .attr("y", function(d,i){ return 150 - i*20}) // 100 is where the first dot appears. 25 is the distance between dots
                  .style('fill', "#000000")
                  .text(d=>d)
                  .attr("text-anchor", "left")
                  .style("alignment-baseline", "middle")

          }     
      }
  }
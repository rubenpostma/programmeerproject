var map2;

function makeLegendReceive(){
  // select legend div
  var legend = d3.select("#legend").append("nav")
  // add spans with radient colors
  legend.append("span")
    .style("background", "#eff3ff")
  legend.append("span")
    .style("background", "#bdd7e7")
  legend.append("span")
    .style("background", "#6baed6")
  legend.append("span")
    .style("background", "#3182bd")
  legend.append("span")
    .style("background", "#08519c")

  // add labels
  legend.append("label")
    .text("less than 500")
  legend.append("label")
    .text("500-1000")
  legend.append("label")
    .text("1000-2500")
  legend.append("label")
    .text("2500-4000")
  legend.append("label")
    .text("more than 4000")
}
// make map function
function makeMapReceive(){
  
  var legend = d3.select("#legend")
  legend.selectAll('*').remove();
  info.selectAll('*').remove();
  makeLegendReceive()
  // select div to draw datamap
  var container = d3.select('#container1');
  container.selectAll('*').remove();
  linesvg.selectAll("*").remove();
  barsvg.selectAll("*").remove();
    
  // make dictionaries en arrays to parse dataset
  var dataset = {};
  var countryset = [];
  var arr = []; 
  
  // get data from jsonfile
  d3.json("odaReceived.json", function(data) {
    console.log(data)
    // loop though data
    for (var i = 0; i < data.length; i++) {
      // put elements of data in variables
      var country = data[i][0];
      var year = data[i][1];
      var money = Number(data[i][2]);
            
      // if country is not in data set   
      if (country in dataset == false) {
        // empty countryset for new country data
        countryset = [];        
      }
      // set country as key in data set and data as value
      countryset.push([money, year]);
      dataset[country] = {oda : countryset}  
    }
    
    // make sure countries have data lenght of 10
    for (key in dataset){ 
      if (dataset[key].oda.length !== 10){
        var annee = 2005
        var lijst = []
        for(var f = dataset[key].oda.length; f < 10; f++){
          lijst.push(["", annee.toString()])
          annee += 1
        }
        dataset[key].oda = lijst.concat(dataset[key].oda);
      }     
    }
    // make map  
    map2 = new Datamap({
      // select container1 to draw map in
      element: document.getElementById('container1'),
      // add click function to datamap
      done: function(datamap) {
        datamap.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
          
          // make variables for selction data
          var p = dataset[geo.id].oda;
          var q = p.length - 1;
          // make line graph using the data of a country
          makeLinegraphReceive(p, geo.properties.name, geo.id);             
        });
      },
      // scope is world
      scope: 'world',
      //
      geographyConfig: {

        borderColor: '#696969',
        // border color on hover
        highlightBorderColor: 'red',
        // add pop upp with data
        popupTemplate: function(geo, data) {
                  // store data of country in variables
                  var p = dataset[geo.id].oda;
                  var q = p.length - 1;
                  //return div
                  return[
          '<div class="hoverinfo"><strong>'
          // with country name
          + geo.properties.name + '</strong></br>'
          // and data 
          + "ODA: $" + p[index][0] + " million" + '</br>'
          // and year
          + p[index][1] +
          '</div>'].join('');
        }

      },
      // define color for fill types 
      fills: {
        defaultFill: '#d3d3d3'
      },
      // connect data with dataset
      data: dataset
    
    });
    // give countries fill
    for (key in map2.options.data){
      var data = {};
      var value = map2.options.data[key].oda;
      var kleur = setColorReceive(value[value.length-1][0]);
      data[key] = kleur;
      map2.updateChoropleth(data);
    }
  });
}

function setColorReceive(value) {
   
    // choose fill based on value     
    if (value == 0)
    {
      return "d3d3d3"
    }
    if (value < 500) {
      // and return fillkey
      return "#eff3ff"                  
    }
    if (value < 1000) {
      return "#bdd7e7";
    }
    if (value < 2500) {
      return "#6baed6";
    }
    if (value < 4000) {
      return "#3182bd";
    }
     if (value => 4000) {
        return "#08519c" ;
    }
}

// make line graph
function makeLinegraphReceive(arr, land, id) {
  
  console.log(map.options.data)
  // remove old axis and countryname
  linesvg.selectAll(".as").remove();
  info.select(".land").remove();
  linesvg.select(".aid").remove();

  // parse data
  arr = arr.map(function(d) {
    return {
      aid: (d[0]),
      year: reformat(d[1])
    };
  });
  
  
  // determine domain of data
  var xdomain = d3.extent(arr, function(d) { return d.year });
  var min =  d3.min(arr, function(d) { return d.aid});
  if (min > 0){
    min = 0;
  }
  var ydomain = [min, d3.max(arr, function(d) { return 1.1 * d.aid;})];

  // determine domain and range of yscale
  var yscale = d3.scale.linear()
    .range([lineHeight, 0])
    .domain(ydomain);

  // determine domain and range of xscale
  var xscale = d3.time.scale()
      .range([0, lineWidth])
      .domain(xdomain);
  
  // give y axis scale and position
  var yas = d3.svg.axis()
    .scale(yscale)
    .orient("left");

  // give x axis scale and location 
  var xas = d3.svg.axis()
    .scale(xscale)
    .ticks(d3.time.year, 1)
    .orient("bottom");

  //determine coordinates of line in graph
  var line = d3.svg.line()
      .x(function(d) { return xscale(d.year); })
      .y(function(d) { return yscale(d.aid); });

  // put y axis in svg
  linesvg.append("g")
    .attr("class", "y as")
    .call(yas)
    .append("text")
      // place text 
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".50em")
        .style("text-anchor", "end")
        .text("ODA (in millions)");

  // put x axis in svg
  linesvg.append("g")
    .attr("class", "x as")
    .attr("transform", "translate(0," + lineHeight + ")")
    .call(xas);
      
  //put line in svg
  linesvg.append("path")
      .datum(arr)
      .attr("class", "aid")
      // get coordinates
      .attr("d", line);

  // put country name in info div
  info.append("text")
        .attr("class", "land")
        .text(land)
        .attr("x", "25%")
        .attr("y", 15)
        .style("font-weight", "bold");

  // put year in info div
  info.append("text")
    .attr("id", "jaar")
    .attr("x", "40%")
    .attr("y", 15)
    .style("text-anchor", "end")
    .style("font-weight", "bold");
            
  // make selector 
  var selec = linesvg.append("g").style("display", "none");

    // append horizontal line to selec
    selec.append('line')
      .attr("id", "xselec")
      .attr("class", "selec");
    // append vertical line
    selec.append("line")
      .attr("id", "yselec")
      .attr("class", "selec");
    
    // put text on horizontal line
    selec.append("text")
      .attr("id", "xtext")
      .style("font-weight", "bold");


  // make bisector to determine closest data point
  var bisectDate = d3.bisector(function(d) { return d.year; }).left;

  // put overlay over graph 
  linesvg.append('rect')
    .attr("class", "overlay")
    .attr('width', lineWidth)
    .attr('height', lineHeight) 
    // show element when mouse on graph
    .on('mouseover', function() { selec.style('display', null); })
    // hides otherwise
    .on('mouseout', function() { selec.style('display', 'none'); })
    // on mousemove
    .on('mousemove', function() { 
            // get mousecoordinates of overlay
            var mouse = d3.mouse(this);
            // tranfer mouse data to data of country
            var mouseDate = xscale.invert(mouse[0]);
            // get index of mousedat
            var i = bisectDate(arr, mouseDate); 
            // determine next data
            var d0 = arr[i - 1]
            var d1 = arr[i];
            // determine closer datapoint
            var d = mouseDate - d0[0] > d1[0] - mouseDate ? d1 : d0;

            // get coordinates of scale lines
            var x = xscale(d.year);
            var y = yscale(d.aid);
           
            // give coordinates to selec
            selec.select('#xselec')
                .attr('x1', x).attr('y1', yscale(ydomain[0]))
                .attr('x2', x).attr('y2', yscale(ydomain[1]));
            selec.select('#yselec')
                .attr('x1', xscale(xdomain[0])).attr('y1', y)
                .attr('x2', xscale(xdomain[1])).attr('y2', y);
            
            // place text next to selec lines
            selec.select('#xtext')
              .text(d.aid + " million")
              .attr('x', x + 30)
              .attr('y', y)
              .style("text-anchor", "start");
            
            // put text on the left side to prevent it falling outside the div
            if (i > 7){
              selec.select("#xtext")
                .attr('x', x - 30)
                .style("text-anchor", "end");
            }
           
           // set year in div function
            info.select('#jaar')
              .text(setdate(d.year));
            
            //update the colors of the map
            for (key in map2.options.data){
              var data = {};
              var value = map2.options.data[key].oda;
              var kleur = setColorReceive(value[i-1][0]);
              data[key] = kleur;
              map2.updateChoropleth(data);
            }
        });

}
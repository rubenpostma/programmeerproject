// Ruben Postma
// 131075708

// make buttons to call makeMapDonor and makeMapReceive fucntion
var button1 = d3.select("#buttons").append("button")
                .attr("class", "button")
                .attr("id", "button1")
                .on("click", makeMapDonor)
                .text("donor countries");
var button2 = d3.select("#buttons").append("button")
                .attr("class", "button")
                .attr("id", "button2")
                .on("click", makeMapReceive)
                .text("receiving countries");
//global variable map
var map
// global variable index for year counting
var index = 9

//append svg into info div
var info = d3.select("#info").append("svg")
  .attr("class", "info")
  .attr("height", 20)
  .attr("width", 900);

// define marges around linegraph
var lineMargin = {left : 60, right : 15, top : 20, bottom : 25};

// define height and width
var lineWidth = 498 - lineMargin.left - lineMargin.right;
var lineHeight = 200 - lineMargin.top - lineMargin.bottom;

// append svg to body
var linesvg = d3.select("#linegraph").append("svg")
  .attr("id", "line")
  // determine height and width
  .attr("height", lineHeight + lineMargin.top + lineMargin.bottom)
  .attr("width", lineWidth + lineMargin.left + lineMargin.right)
  // make g in svg
  .append("g")
  // transform to location of axis
  .attr("transform", "translate(" + lineMargin.left + "," + lineMargin.top + ")")
  .style('font-family', 'verdana')
  .style('font-size', 10);

//set margins around bargraph
var barMargin = {left : 60, right : 75, top : 10, bottom : 155};

//determine the height and width of barchart
var barWidth = 558 - barMargin.left - barMargin.right;
var barHeight = 330 - barMargin.top - barMargin.bottom;

// make y scale linear
var barY = d3.scale.linear()
  .range([barHeight, 0]);
// make x scale ordinal
var barX = d3.scale.ordinal()
  .rangeRoundBands([0, barWidth], .2);

// determine scale and location for y axis
var baryas = d3.svg.axis()
  .scale(barY)
  .orient("left");

// determine scale and location for x axis
var barxas = d3.svg.axis()
  .scale(barX)
  .orient("bottom");


// append svg to body 
var barsvg = d3.select("#barchart").append("svg")
  // set height and width
  .attr("height", barHeight + barMargin.top + barMargin.bottom)
  .attr("width", barWidth + barMargin.left + barMargin.right)
  // append g to svg
  .append("g")
  // transform the axis to the margins
  .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")")
  .style('font-family', 'verdana')
  .style('font-size', 10);

// make tip
var tip = d3.tip()
 .attr('class', 'd3-tip')
 .offset([-10, 0])
 .html(function(d) {
    return "<span> $" + d.aid + " million </span>";
  });

barsvg.call(tip);

// load donor map
makeMapDonor();

// function for legend
function makeLegendDonor(){
  // select the legend div 
  var legend = d3.select("#legend").append("nav")

  // add span of radient colors
  legend.append("span")
    .style("background", "#fee5d9")
  legend.append("span")
    .style("background", "#fcae91")
  legend.append("span")
    .style("background", "#fb6a4a")
  legend.append("span")
    .style("background", "#de2d26")
  legend.append("span")
    .style("background", "#a50f15")

  //add text to legend
  legend.append("label")
    .text("less than 1000")
  legend.append("label")
    .text("1000-5000")
  legend.append("label")
    .text("5000-10.000")
  legend.append("label")
    .text("10.000-25.000")
  legend.append("label")
    .text("more than 25.000")
}

// make map function
function makeMapDonor(){
  // select legend and remove it
  var legend = d3.select("#legend")
  legend.selectAll('*').remove();
  // make new legend
  makeLegendDonor()
  
  // remove inside info, lineGraph and barchart div
  info.selectAll('*').remove();
  linesvg.selectAll("*").remove();
  barsvg.selectAll("*").remove();
  
  // select div to draw datamap and remove inside div to draw new one
  var container = d3.select('#container1');
  container.selectAll('*').remove();
  

  // make dictionaries en arrays to parse dataset
  var dataset = {};
  var countryset = [];
  var sectorset = {};
  var arr = []; 
  
  // get data from jsonfile
  d3.json("odaDonor.json", function(data) {
   
    // loop though data
    for (var i = 0; i < data.length; i++) {
      // put elements of data in variables
      var country = data[i][0];
      var sector = data[i][1];
      var year = data[i][2];
      var money = Number(data[i][3]);
      
      // checks if sector is already in sector set
      if (sector in sectorset == false) {
        // if not sector is new key
        var keys = Object.keys(sectorset);
        // put the sector data in the countrydata
        keys.forEach(function(sector){
          countryset.push(sectorset[sector]);
        });
        // empty the dictionary and array
        sectorset = {};
        arr = [];
      }
      
      // add data tot sector dataset
      sectorset[sector] = arr;
      arr.push([money, year, sector]);
      
      // if country is not in data set   
      if (country in dataset == false) {
        // empty countryset for new country data
        countryset = [];        
      }
      // set country as key in data set and data as value
      dataset[country] = {oda : countryset}  
    }
    // loop through dataset
    for (key in dataset){  
      // if the data set is shorter than ten 
      if (dataset[key].oda[dataset[key].oda.length -1].length !== 10){
        // set year to 2005
        var annee = 2005
        // make empty array
        var lijst = []
        // loop till array is ten
        for(var f = dataset[key].oda[dataset[key].oda.length -1].length; f < 10; f++){
          // put empty data in array
          lijst.push(["", annee.toString(), "Total"])
          // counter on year
          annee += 1
        }
        // add empty data to country set to create array with length of 10
        dataset[key].oda[dataset[key].oda.length -1] = lijst.concat(dataset[key].oda[dataset[key].oda.length -1]);
      } 
    
    }
    // make map  
    map = new Datamap({
      // select container1 to draw map in
      element: document.getElementById('container1'),
      // add click function to datamap
      done: function(datamap) {
          datamap.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
          // make variables for selction data
          p = dataset[geo.id].oda;
          q = p.length - 1;
          // make line graph using the data of a country
          makeLinegraphDonor(p[q], geo.properties.name, geo.id, q);
        });
      },
      // scope is world
      scope: 'world',
      //
      geographyConfig: {
        // border color on hover
        highlightBorderColor: 'red',
        // add pop upp with data
        popupTemplate: function(geo, data) {
          // store data of country in variables
          p = dataset[geo.id].oda;
          
          //return div
          return[
            '<div class="hoverinfo"><strong>'
            // with country name
            + geo.properties.name + '</strong></br>'
            // and data 
            + "ODA: $" + p[p.length-1][index][0] + " million" + '</br>'
            // // and year
            + p[p.length-1][index][1] +
            '</div>'
          ].join('');
        }

      },
      // define color for fill types 
      fills: {
        // default is grey
        defaultFill: '#d3d3d3'
      },
      // connect data with dataset
      data: dataset
    
    });
    // loop trough countries in dataset
    for (key in map.options.data){
      // make dictionary
      var data = {};
      //select data from country
      var value = map.options.data[key].oda;
      // pick color using setColorDonor
      var color = setColorDonor(value[value.length-1][index][0]);
      // add color to country
      data[key] = color;
      // update map
      map.updateChoropleth(data);
    }
  });

}

// function to choose countryfill
function setColorDonor(value) {
   
    // choose fill based on value     
    if (value == 0)
    {
      return "d3d3d3"
    }
    if (value < 1000) {
      // and return fillkey
      return "#fee5d9"                  
    }
    if (value < 5000) {
      return "#fcae91";
    }
    if (value < 10000) {
      return "#fb6a4a";
    }
    if (value < 25000) {
      return "#de2d26";
    }
     if (value => 25000) {
        return "#a50f15" ;
    }
}



// make line graph
function makeLinegraphDonor(arr, land, id) {
  
  makeBarchart(id, index);
  // remove old axis and countryname
  linesvg.selectAll("*").remove();
  info.select(".land").remove();
  // parse data
  arr = arr.map(function(d) {
    return {
      aid: (d[0]),
      year: reformat(d[1])
    };
  });
  
  // determine domain of data
  var xdomain = d3.extent(arr, function(d) { return d.year });
  var ydomain = [0, d3.max(arr, function(d) { return 1.1 * d.aid;})];

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

  // add country name in info div
  info.append("text")
        .attr("class", "land")
        .text(land)
        .attr("x", "25%")
        .attr("y", 15)
        .style("text-anchor", "middle")
        .style("font-weight", "bold");

  // add year in info div
  info.append("text")
    .attr("id", "jaar")
    .attr("x", "75%")
    .attr("y", 15)
    .style("text-anchor", "middle")
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
            
            // place text to the right to avoid being placed outside of div
            if (i > 7){
              selec.select("#xtext")
                .attr('x', x - 30)
                .style("text-anchor", "end");
            }
            // put year into info div
            info.select('#jaar')
              .text(setdate(d.year));

            // call makeBarchart
            index = i-1;
            makeBarchart(id, index);
            
            // update the colors in the datamap
            for (key in map.options.data){
              var data = {};
              var value = map.options.data[key].oda;
              var kleur = setColorDonor(value[value.length-1][index][0]);
              data[key] = kleur;
              map.updateChoropleth(data);
            }
            
        });

}
// reformat function
function reformat (d) {
  //parsed year to milliseconds
  d = d3.time.format('%Y').parse(d);
  d = new Date(d);
  return d.getTime();
};

// setdate function
function setdate(d){
  // parse millisesconds back to years
   jaar = d3.time.format("%Y");
   return jaar(new Date(d));
}


// barchart function
function makeBarchart(id, j){
  
  var dataset = {};
  var countryset = [];
  var yearset = {};
  var arr = [];
  
  // get data out of JSON file
  d3.json("odaDonor2.json", function(data) {
   
    // loop through data
    for (var i = 0; i < data.length; i++) {
      var country = data[i][0];
      var sector = data[i][1];
      var year = data[i][2];
      var money = Number(data[i][3]);
       
      // checks if year is already in year set
      if (year in yearset == false) {
        // if not, year is new key
        var keys = Object.keys(yearset)
        // put the year data in the countrydata
        keys.forEach(function(year){
          countryset.push(yearset[year]);
        });
        // empty the dictionary and array
        yearset = {};
        arr = [];
      }
     
      // add data tot sector dataset
      yearset[year] = arr;
      arr.push([money, year, sector]);
      
      // if country is not in data set   
      if (country in dataset == false) {
      // empty countryset for new country dat
        countryset = [];        
      }
     
      // set country as key in data set and data as value   
      dataset[country] =  countryset;
      
    }
    
    // make sure that country data has lentgth of 10
    for (key in dataset){  
      if (dataset[key].length !== 10){
        var lijst = []
        for(var f = dataset[key].length; f < 10; f++){
          lijst.push(["","", ""])
        }
        dataset[key] = lijst.concat(dataset[key]);
      } 
    }
    //get array for relevant year
    arr = dataset[id][index];
    
    // parse the array 
    arr = arr.map(function(d) {
      return {
        aid: (d[0]),
        sector: (d[2])
      };
    });
    // remove axis
    barsvg.selectAll(".as").remove(); 
    //  determine domain data 
    barY.domain([0, d3.max(arr, function(d) { return d.aid; })]);
    barX.domain(arr.map(function(d) { return d.sector; }));

    // append y axis to svg
    barsvg.append("g")
      .attr("class", "y as")
      .call(baryas)
      // append text to axis
      .append("text")
        // zet tekst op juiste plek
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".45em")
        .style("text-anchor", "end")
        .text("Official Development Aid");

    // append x axis
    barsvg.append("g")
      .attr("class", "x as")
      .attr("transform", "translate(0," + barHeight + ")")
      .call(barxas)
      .selectAll("text")
        .style("text-anchor", "start")
        .attr("transform", "rotate(45)");

    // secelect bars
    var bars = barsvg.selectAll("rect.bar")
      .data(arr);
    
      // append bars to svg 
    bars.enter()
      .append("svg:rect")
      // give the class "bar"
      .attr("class", "bar")
      // show and hide tip width mouse movement 
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
    
  
    // remove old bars
    bars.exit()
      .transition()
      .duration(300)
      .ease("exp")
        .attr("height", 0)
         .remove();    

    // draw new bars
    bars
      .transition()
      .duration(300)
      .ease("quad")   
        // determine width bars
        .attr("x", function(d) { return barX(d.sector); })
        .attr("width", barX.rangeBand)
        .attr("y", function(d) { return barY(d.aid); })
        // deterimine height of bars
        .attr("height", function(d) { return barHeight - barY(d.aid); });


  });
}

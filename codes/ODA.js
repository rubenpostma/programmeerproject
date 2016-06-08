// Ruben Postma
// 1338935


// laat kaart met data 2014
makeMap();

// maak kaart functie
function makeMap(){
  // selecteer div 
  var container = d3.select('#container1')
    
  // maak dictionary voor data set
  var dataset = {}
  var countryset = []
  var sectorset = {}
  var arr = []
  
  // haal data uit JSON file
  d3.json("odaDonor.json", function(data) {
   
    // ga elk element van data af
    for (var i = 0; i < data.length; i++) {
      var country = data[i][0]
      var sector = data[i][1]
      var year = data[i][2]
      var money = Number(data[i][3])
      
      
      if (sector in sectorset == false) {
        var keys = Object.keys(sectorset)
        keys.forEach(function(sector){
          countryset.push(sectorset[sector]);
        });
        sectorset = {}
        arr = [] 
      }
      
      sectorset[sector] = arr
      arr.push([money, year, sector])
      
         
      if (country in dataset == false) {
        countryset = []        
      }
     
      
      dataset[country] = {oda : countryset, fillKey : pickType(Number(money))}
      
    }
    console.log(dataset)
    // maak kaart   
    var map = new Datamap({
      // selecteer data map in container1
      element: document.getElementById('container1'),
      // roep op klik functie makeBarChart
      done: function(datamap) {
        datamap.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
          
          p = dataset[geo.id].oda
          q = p.length - 1
          makeLinegraph(p[q], geo.properties.name, geo.id)
          console.log(p[q][p[q].length -1][0], geo.properties.name)
                    
        });
      },
      // het is een wereld kaart
      scope: 'world',
      // geef grenzen kleur
      geographyConfig: {
        
        // geef grenzen aan bij hover
        highlightBorderColor: 'red',
        // voeg label toe met data van datamap en JSON fil
        popupTemplate: function(geo, data) {
                  p = dataset[geo.id].oda
                  q = p.length - 1
                  return[
          '<div class="hoverinfo"><strong>'
          + geo.properties.name + '</strong></br>'
          + "ODA: $" + p[q][p[q].length -1][0] + '</br>'
          + p[q][p[q].length -1][1] +
          '</div>'].join('');
        }

      },
      // defineer kleur bepaalde fillKeys
      fills: {
        typeone: "#fee5d9",
        typetwo: "#fcae91",
        typethree: "#fb6a4a",
        typefour: "#de2d26",
        typefive: "#a50f15",
        // wanneer geen data er is, donkerblauw
        defaultFill: '#d3d3d3'
      },
      // koppel data aan dataset
      data: dataset
    
    });
    
  });
}

function pickType(value) {
   
    // kies op basis van value kleur getallen zijn in procent
    
    if (value < 1000) {
        // en return fillkey
        return "typeone";                   
    }
    else if (1000 <= value && value < 10000) {
        return "typetwo";
    }
    else if (10000 <= value && value < 25000) {
        return "typethree";
    }
    else if (25000 <= value && value < 50000) {
        return "typefour";
    }
    else if (value => 50000) {
        return "typefive" ;
    }
}
// zet de marges rondom de grafiek
var lineMargin = {left : 120, right : 45, top : 25, bottom : 40}

// zet hoogte en breedte van svg
var lineWidth = 1000 - lineMargin.left - lineMargin.right;
var lineHeight = 350 - lineMargin.top - lineMargin.bottom;

var linesvg = d3.select("body").append("svg")
  // zet id="line"
  .attr("id", "line")
  // bepaal hoogte en breedte met variabelen
  .attr("height", lineHeight + lineMargin.top + lineMargin.bottom)
  .attr("width", lineWidth + lineMargin.left + lineMargin.right)
  // maak g in svg
  .append("g")
    // verplaats naar de marges waar de assen komen
    .attr("transform", "translate(" + lineMargin.left + "," + lineMargin.top + ")");

function makeLinegraph(arr, land, id) {
  console.log(id)
  linesvg.selectAll(".as").remove();
  linesvg.select(".land").remove();

  arr = arr.map(function(d) {
    return {
      aid: (d[0]),
      year: reformat(d[1])
    };
  });
  
  
  // zet de domeinen van data 
  var xdomain = d3.extent(arr, function(d) { return d.year });
  var ydomain = [0, d3.max(arr, function(d) { return 1.1 * d.aid;})];

  //  bepaal schaal, range en domain van y
  var yscale = d3.scale.linear()
    .range([lineHeight, 0])
    .domain(ydomain);

  // bepaal schaal range en domein van x
  var xscale = d3.time.scale()
      .range([0, lineWidth])
      .domain(xdomain);
  
  // zet y as links
  var yas = d3.svg.axis()
    .scale(yscale)
    .orient("left")

  // zet xas beneden  en maak ticks elke twee dagen
  var xas = d3.svg.axis()
    .scale(xscale)
    .ticks(d3.time.year, 1)
    .orient("bottom");

  //bepaal x en y doordinaten van lijn
  var line = d3.svg.line()
      .x(function(d) { return xscale(d.year); })
      .y(function(d) { return yscale(d.aid); });

  // zet y as in svg
  linesvg.append("g")
    .attr("class", "y as")
    .call(yas)
    .append("text")
      // zet tekst op juiste plek
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".50em")
        .style("text-anchor", "end")
        // maak tekst "Celcius"
        .text("ODA (in millions)");

  // zet x as in svg
  linesvg.append("g")
    .attr("class", "x as")
    .attr("transform", "translate(0," + lineHeight + ")")
    .call(xas);

  // zet lijn in svg
  linesvg.append("path")
      .datum(arr)
      .attr("class", "aid")
      // haal coordinaten van line
      .attr("d", line);

  
  // zet land in chart
  linesvg.append("text")
        .attr("class", "land")
        .text(land)
        .attr("x", 850)
        .attr("y", 250)
        .style("font-size", 20)
        .style("font-family", "Verdana")
        .style("font-weight", "bold")
        .style("fill", "#d3d3d3")
        .style("text-anchor", "end")

    
  // maak selec in svg om data te selecteren
  var selec = linesvg.append("g").style("display", "none")

    // maak horizontale lijn om data van y as te selecteren
    selec.append('line')
      .attr("id", "xselec")
      .attr("class", "selec")
    // maak verticale lijn om data van y as te selecteren
    selec.append("line")
      .attr("id", "yselec")
      .attr("class", "selec")
    
    // voeg tekst langs horizontale lijn
    selec.append("text")
      .attr("id", "xtext")
      .style("font-family", "Verdana")
      .style("font-weight", "bold")
    // voeg tekst labgs verticale lijn
    selec.append("text")
      .attr("id", "ytext")
      .attr("transform", "rotate(-90)")
      .style("font-family", "Verdana")
      .style("font-weight", "bold")

  // maak bisector om dichtsbizijnde datapunt op xas aan te wijzen 
  var bisectDate = d3.bisector(function(d) { return d.year; }).left;

  // zet overlay over grafiek
  linesvg.append('rect')
    .attr("class", "overlay")
    .attr('width', lineWidth)
    .attr('height', lineHeight) 
    // laat elementen van layover zien als muis over grafiek heengaat
    .on('mouseover', function() { selec.style('display', null); })
    // en verberg elementen zoniet
    .on('mouseout', function() { selec.style('display', 'none'); })
    // bij muisbeweging
    .on('mousemove', function() { 
            // haal coordinaten van muis in overlay
            var mouse = d3.mouse(this);
            // zet xcoordinaten van muis om in xdata van json file
            var mouseDate = xscale.invert(mouse[0]);
            // haalt index van x data
            var i = bisectDate(arr, mouseDate); 
            // bepaal index naast huidige index
            var d0 = arr[i - 1]
            var d1 = arr[i];
            // bepaal welke data dichter bij de muis is
            var d = mouseDate - d0[0] > d1[0] - mouseDate ? d1 : d0;

            // bepaal coordinate van selec lijnen
            var x = xscale(d.year);
            var y = yscale(d.aid);
           
            // geef selec lijnen juiste coordinaten
            selec.select('#xselec')
                .attr('x1', x).attr('y1', yscale(ydomain[0]))
                .attr('x2', x).attr('y2', yscale(ydomain[1]))
            selec.select('#yselec')
                .attr('x1', xscale(xdomain[0])).attr('y1', y)
                .attr('x2', xscale(xdomain[1])).attr('y2', y)
            
            // en de juiste tekst langs de lijne
            selec.select('#xtext')
              .text(d.aid + " million")
              .attr('x', x + 30)
              .attr('y', y)
            selec.select('#ytext')
              .text(setdate(d.year))
              .attr('x', -260)
              .attr('y', x + 11)
            
            makeBarchart(id, i-1)

        });

}

function reformat (d) {
  
  d = d3.time.format('%Y').parse(d);
  d = new Date(d);
  return d.getTime();
};

function setdate(d){
   jaar = d3.time.format("%Y");
   return jaar(new Date(d));
}

var barMargin = {left : 45, right : 30, top : 25, bottom : 40};

var barWidth = 1000 - barMargin.left - barMargin.right;
var barHeight = 350 - barMargin.top - barMargin.bottom;

// maak y as linear
var barY = d3.scale.linear()
  .range([barHeight, 0]);
// maak x as oridinaal en bepaal ruimte tussen staven
var barX = d3.scale.ordinal()
  .rangeRoundBands([0, barWidth], .2);

// zet y as links
var baryas = d3.svg.axis()
  .scale(barY)
  .orient("left")
// zet xas beneden  
var barxas = d3.svg.axis()
  .scale(barX)
  .orient("bottom");


// maak svg in body 
var barsvg = d3.select("body").append("svg")
  .attr("id", "bar")
  // bepaal hoogte en breedte met variabelen
  .attr("height", barHeight + barMargin.top + barMargin.bottom)
  .attr("width", barWidth + barMargin.left + barMargin.right)
  // maak g in svg
  .append("g")
  // verplaats naar de marges waar de assen komen
  .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")")
  .style('font-family', 'verdana')
  .style('font-size', 10);

function makeBarchart(id, j){

  var dataset = {}
  var countryset = []
  var yearset = {}
  var arr = []
  
  // haal data uit JSON file
  d3.json("odaDonor2.json", function(data) {
   
    // ga elk element van data af
    for (var i = 0; i < data.length; i++) {
      var country = data[i][0]
      var sector = data[i][1]
      var year = data[i][2]
      var money = Number(data[i][3])
       
      
      if (year in yearset == false) {
        var keys = Object.keys(yearset)
        keys.forEach(function(year){
          countryset.push(yearset[year]);
        });
        yearset = {}
        arr = [] 
      }
      barsvg.selectAll(".as").remove();
      yearset[year] = arr
      arr.push([money, year, sector])
      
         
      if (country in dataset == false) {
        countryset = []        
      }
     
      dataset[country] =  countryset
      
    }
    arr = dataset[id][j]

    arr = arr.map(function(d) {
      return {
        aid: (d[0]),
        sector: (d[2])
      };
    });
    //console.log(arr)
    
    barY.domain([0, d3.max(arr, function(d) { return d.aid; })]);
    barX.domain(arr.map(function(d) { return d.sector; }));

    barsvg.append("g")
      .attr("class", "y as")
      .call(baryas)
    // voeg tekst aan yas
      .append("text")
      // zet tekst op juiste plek
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".45em")
        .style("text-anchor", "end")
        // maak tekst langs Yas 
        .text("Official Development Aid");

    // maak x as in svg 
    barsvg.append("g")
      .attr("class", "x as")
      // verplaats op juiste hoogte
      .attr("transform", "translate(0," + barHeight + ")")
      .call(barxas);

    // selecteer de staven
    var bars = barsvg.selectAll("rect.bar")
      .data(arr)
    
      // voeg bar toe aan svg
    bars.enter()
      .append("svg:rect")
      // geef class bar
      .attr("class", "bar")
    
  
    // verwijder oude bars
    bars.exit()
      .transition()
      .duration(300)
      .ease("exp")
        .attr("height", 0)
         .remove()    

    // voeg nieuwe bars toe
    bars
      .transition()
      .duration(300)
      .ease("quad")   
        // bepaal breedte bar
        .attr("x", function(d) { return barX(d.sector); })
        .attr("width", barX.rangeBand)
        .attr("y", function(d) { return barY(d.aid); })
        // bepaal hoogte bar
        .attr("height", function(d) { return barHeight - barY(d.aid); })


  });
}
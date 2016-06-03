// Ruben Postma
// 1338935


// laat kaart met data 2014
MakeMap();

// maak kaart functie
function MakeMap(){
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
      var money = data[i][3]
      
      if (sector in sectorset) {
        arr.push([money, year])
      }
      else {
        sectorset = {}
        arr = []
        arr.push([money, year])
      }
      sectorset[sector] = arr
      
      if (containsObject(sectorset, countryset)){
        countryset.pop(sectorset) 
      }
      
      if (country in dataset) {
        countryset.push(sectorset);
        
      }
      else {
        countryset = []
        countryset.push(sectorset);
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
          
          makeLinegraph(dataset[geo.id].oda[dataset[geo.id].oda.length - 1].Total, geo.properties.name)
          console.log(dataset[geo.id].oda[dataset[geo.id].oda.length - 1].Total, geo.properties.name)
          
        });
      },
      // het is een wereld kaart
      scope: 'world',
      // geef grenzen kleur
      geographyConfig: {
        //borderColor: '#00446A',
        // geef grenzen aan bij hover
        highlightBorderColor: 'red',
        // voeg label toe met data van datamap en JSON fil
        popupTemplate: function(geo, data) {
                  return[
          '<div class="hoverinfo"><strong>'
          + geo.properties.name + '</strong></br>'
          + "ODA: $" + dataset[geo.id].oda[dataset[geo.id].oda.length - 1].Total[0][0] + '</br>'
          + dataset[geo.id].oda[dataset[geo.id].oda.length - 1].Total[0][1] +
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
function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }
    return false;
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
var margin = {left : 45, right : 120, top : 25, bottom : 40}

// zet hoogte en breedte van svg
var width = 1000 - margin.left - margin.right;
var height = 350 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
  // zet id="chart"
  .attr("id", "line")
  // bepaal hoogte en breedte met variabelen
  .attr("height", height + margin.top + margin.bottom)
  .attr("width", width + margin.left + margin.right)
  // maak g in svg
  .append("g")
    // verplaats naar de marges waar de assen komen
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function makeLinegraph(arr, land) {
  
  arr = arr.map(function(d) {
    return {
      aid: Number(d[0]),
      year: reformat(d[1])
    };
  });

  // zet de domeinen van data 
  var xdomain = d3.extent(arr, function(d) { return d.year });
  var ydomain = [0, d3.max(arr, function(d) { return (d.aid) + 2;})];

  //  bepaal schaal, range en domain van y
  var yscale = d3.scale.linear()
    .range([height, 0])
    .domain(ydomain);

  // bepaal schaal range en domein van x
  var xscale = d3.time.scale()
      .range([0, width])
      .domain(xdomain);
  
  // zet y as links
  var yas = d3.svg.axis()
    .scale(yscale)
    .orient("left")
  // zet xas beneden  en maak ticks elke twee dagen
  var xas = d3.svg.axis()
    .scale(xscale)
    .ticks(d3.time.day, 2)
    .orient("bottom");

  // bepaal x en y doordinaten van lijn
  var line = d3.svg.line()
      .x(function(d) { return xscale(d.year); })
      .y(function(d) { return yscale(d.aid); });

  // zet y as in svg
  svg.append("g")
    .attr("class", "y as")
    .call(yas)
    .append("text")
      // zet tekst op juiste plek
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".50em")
        .style("text-anchor", "end")
        // maak tekst "Celcius"
        .text("Official Development");

  // zet x as in svg
  svg.append("g")
    .attr("class", "x as")
    .attr("transform", "translate(0," + height + ")")
    .call(xas);

  // zet lijn in svg
  svg.append("path")
      .datum(arr)
      .attr("class", "gmld")
      // haal coordinaten van line
      .attr("d", line);

  var svg = d3.select("#line").transition();

    // Make the changes
        svg.select(".path")   // change the line
            .duration(750)
            .attr("d", line(arr));
        svg.select(".x as") // change the x axis
            .duration(750)
            .call(xas);
        svg.select(".y as") // change the y axis
            .duration(750)
            .call(yas);
  
  // maak selec in svg om data te selecteren
  // var selec = svg.append("g").style("display", "none")

    // // maak horizontale lijn om data van y as te selecteren
    // selec.append('line')
    //   .attr("id", "xselec")
    //   .attr("class", "selec")
    // // maak verticale lijn om data van y as te selecteren
    // selec.append("line")
    //   .attr("id", "yselec")
    //   .attr("class", "selec")
    
    // // voeg tekst langs horizontale lijn
    // selec.append("text")
    //   .attr("id", "xtext")
    //   .style("font-family", "Verdana")
    //   .style("font-weight", "bold")
    // // voeg tekst labgs verticale lijn
    // selec.append("text")
    //   .attr("id", "ytext")
    //   .attr("transform", "rotate(-90)")
    //   .style("font-family", "Verdana")
    //   .style("font-weight", "bold")

  // // maak bisector om dichtsbizijnde datapunt op xas aan te wijzen 
  // var bisectDate = d3.bisector(function(d) { return d.year; }).left;

  // // zet overlay over grafiek
  // svg.append('rect')
  //   .attr("class", "overlay")
  //   .attr('width', width)
  //   .attr('height', height) 
  //   // laat elementen van layover zien als muis over grafiek heengaat
  //   .on('mouseover', function() { selec.style('display', null); })
  //   // en verberg elementen zoniet
  //   .on('mouseout', function() { selec.style('display', 'none'); })
  //   // bij muisbeweging
  //   .on('mousemove', function() { 
  //           // haal coordinaten van muis in overlay
  //           var mouse = d3.mouse(this);
  //           // zet xcoordinaten van muis om in xdata van json file
  //           var mouseDate = xscale.invert(mouse[0]);
  //           // haalt index van x data
  //           var i = bisectDate(arr, mouseDate); 
  //           // bepaal index naast huidige index
  //           var d0 = arr[i - 1]
  //           var d1 = arr[i];
  //           // bepaal welke data dichter bij de muis is
  //           var d = mouseDate - d0[0] > d1[0] - mouseDate ? d1 : d0;

  //           // bepaal coordinate van selec lijnen
  //           var x = xscale(d.year);
  //           var y = yscale(d.aid);
           
  //           // geef selec lijnen juiste coordinaten
  //           selec.select('#xselec')
  //               .attr('x1', x).attr('y1', yscale(ydomain[0]))
  //               .attr('x2', x).attr('y2', yscale(ydomain[1]))
  //           selec.select('#yselec')
  //               .attr('x1', xscale(xdomain[0])).attr('y1', y)
  //               .attr('x2', xscale(xdomain[1])).attr('y2', y)
            
  //           // en de juiste tekst langs de lijne
  //           selec.select('#xtext')
  //             .text(d.aid + " Graden")
  //             .attr('x', x + 30)
  //             .attr('y', y)
  //           selec.select('#ytext')
  //             .text(setdate(d.year))
  //             .attr('x', -260)
  //             .attr('y', x + 11)
              

        // });

}

function reformat (d) {
  
  d = d3.time.format('%Y').parse(d);
  d = new Date(d);
  return d.getTime();
};


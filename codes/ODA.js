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
  var b = []
  // haal data uit JSON file
  d3.json("odaDonor.json", function(data) {
    console.log(data[0])
    // ga elk element van data af
    for (var i = 0; i < data.length; i++) {
      var country = data[i][0]
      var sector = data[i][1]
      var year = data[i][2]
      var money = data[i][3]
      
      if (country in dataset) {
        countryset.push({
          b : sector, c : year, d : money
        });
        
      }
      else {
        countryset = []
        countryset.push({
          b : sector, c : year, d : money
        });
      } 
      

      dataset[country] = {a : countryset, fillKey : pickType(Number(money))}
      
    }
    console.log(dataset)
    // maak kaart   
    var map = new Datamap({
      // selecteer data map in container1
      element: document.getElementById('container1'),
      // roep op klik functie makeBarChart
      done: function(datamap) {
        datamap.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
          
          //makeLinegraph(dataset[geo.id].a, geo.properties.name)
          console.log(dataset[geo.id].a.slice(0, dataset[geo.id].a.length))//[dataset[geo.id].a.length - 1].d, geo.properties.name)
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
          + "ODA: $" + data.a[dataset[geo.id].a.length - 1].d + '</br>'
          + data.a[9].c +
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

// zet de marges rondom de grafiek
var margin = {left : 60, right : 30, top : 25, bottom : 40}

// zet hoogte en breedte van svg
var width = 1000 - margin.left - margin.right;
var height = 350 - margin.top - margin.bottom;

// maak y as linear
var y = d3.scale.linear()
  .range([height, 0]);
// maak x as oridinaal en bepaal ruimte tussen staven
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .2);
// zet y as links
var yas = d3.svg.axis()
  .scale(y)
  .orient("left")
// zet xas beneden  
var xas = d3.svg.axis()
  .scale(x)
  .orient("bottom");

// maak label die data values toont
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong> GDP per Capita \n" + d.year + ":</strong> <span style='color:red'> $" + Number(d.gdp)+ "</span>";
  })
  
// maak svg in body 
var svg = d3.select("#chart")
  // bepaal hoogte en breedte met variabelen
  .attr("height", height + margin.top + margin.bottom)
  .attr("width", width + margin.left + margin.right)
  // maak g in svg
  .append("g")
  // verplaats naar de marges waar de assen komen
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .style('font-family', 'verdana')
  .style('font-size', 10);

// roep label op in svg
svg.call(tip);



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

// BarChart functie met transition
// met hulp van http://bl.ocks.org/enjalot/1429426
function makeBarChart(a, land){
  // geef assen domeinen
  y.domain([0, d3.max(a, function(d) { return Number(d.gdp); })]);
  x.domain(a.map(function(d) { return d.year; }));
  
  svg.selectAll(".as").remove();
  svg.select(".land").remove();

  // maak y as in svg
  svg.append("g")
    .attr("class", "y as")
    .call(yas)
    // voeg tekst aan yas
    .append("text")
      // zet tekst op juiste plek
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".45em")
        .style("text-anchor", "end")
        // maak tekst langs Yas 
        .text("GDP per Capita (current US$)");

  // maak x as in svg 
  svg.append("g")
    .attr("class", "x as")
    // verplaats op juiste hoogte
    .attr("transform", "translate(0," + height + ")")
    .call(xas);

  // selecteer de staven
  var bars = svg.selectAll("rect.bar")
    .data(a)
    
    // voeg bar toe aan svg
  bars.enter()
    .append("svg:rect")
    // geef class bar
    .attr("class", "bar")
    // laat label zien als muis op bar is
    .on('mouseover', tip.show)
    // verberg label als muis van bar gaat
    .on('mouseout', tip.hide)
  
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
      .attr("x", function(d) { return x(d.year); })
      .attr("width", x.rangeBand)
      .attr("y", function(d) { return y(Number(d.gdp)); })
      // bepaal hoogte bar
      .attr("height", function(d) { return height - y(Number(d.gdp)); })

  // zet naam land in grafiek
  svg.append("text")
    .attr("class", "land")
    .attr("y", 20)
    .attr("x", 40)
    .text(land)
    .style("fill", "#bbbbbb")
    .style("font-size", 14)
    .style("font-weight", "bold")      

}

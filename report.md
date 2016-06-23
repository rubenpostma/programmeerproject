## Official Development Assistance

My visualization has the goal to show the amount of Official Development Assistance (ODA) given and received
and to compare the ODA on various levels.
The first level of comparision is between various countries wich is possible with the a datamap that fill in
the countries based on the amount of ODA they give or receive. The second level of comparision is the amount of ODA
of a country throughout the period of 2005-2014, which is vizualized with a linegraph. And a third level of comparision
is possible with the donating countries, which is a comparision of the various sectors ODA is given to by a country in specific year.

![](doc/oda_vizualization.png)

####Technical Design

My visualization uses various libraries, most prominently d3 and datamaps. I use d3.json to loadd in the data in my make map function.
The json file is not very usefull stored, since each combination of country,sector and year is stored in a seperate array. The data is
parsed that the dataset is a dictionary where counrtrycode is a key, where the value is an array of sectors and in these arrays there are
arrays of the year and amount of ODA. The data gets connected to the datamap using the coutries codes. The datamap then gets placed on the html.
While making the datamaps an onclick function on the countries that calls the linegraph and barchart
function. The linegraph function gets the arrays of years of the Total amount of ODA and draws an linegraph using d3 with the years on the
x-axis and the ODA in current US$ on the y-axis. Using d3 a layover is created over the linegraph that checks the postion of the mouse on the
linegraph and draws based on the mouse postion selectionlines on the year and Total ODA on the line graph. Besides drawing the selectionlines
is also the global variable index changed. Index varies from zero to nine and is used to select the year that the map and the barchart represent.
So the mousemovement on linemovement calls updateChoropleth and makeBarchart using  index to draw the map and barchart of the selected year.
makebarChart also parses a jsonfile, this jsonfile has the same data but is differently formatted since makeBarchart needs to acces the years
first and then pair the sector to the amount of ODA in current US$, instead of first accessing the sector and then pairing the year and ODA, like
in the datamap and the linegraph. Using d3 the barchart is drawn based on the parsed data of the selected year and country

There is also a bit of technical design on my introuction page. usig the jquery dictionary a added on click fuction on a few title divs,
which causes the text divs to up and down. This makes the page more readable. 

####Challenges

The biggest challenge I had with this project was related to parsing the dataset and accesing specific data. As I mentioned before was the
raw very unuseful stored since each combination of country,sector and year is stored in a seperate array. First I had the plan to store this data
in a nested dictionary where the country codes are keys and inside each country code dictionary there are multiple dictionaries where the sectors
are the key and the values are the arrays of years and amount of ODA. But I had alot of troubles with this, so I decided to use arrays to store within
the country keys. Another problem width the raw data is that when a country didn't received of donated ODA in a year it wasn't included in the data, 
instead of setting the ODA in cuurent US$ to 0. This results that the arrays that stores the years, vary in length per country. Which results that the
global index variable does not select the same year for every country. Which result the countries in the data map being filled based on data from different years.
I could fix this problem in code, if the years missing of a country where the earliest years (so 2005 or up) since I could create empty arrays with a for loop to 
create arrays of the lenght of 10. But this was more difficult if other years were missing, which I manually fixed by adding data of zero in the csv file
that stored my raw data. 

Another challenge I had that wasn't related to the data was updating the pop up template when another year was selected on the linegraph, but this was
prety simply fixed when I made the global index variable. 

####Decisions

The decisions I made regarding the dataset are explained in the previous sections. Other decions I made are regarding the functions. I have multiple various
functions that are very similiar. This is the result that data I used for the donating countries and the receiving countries are not simialry stored,
since there is no data regarding sectors for the receiving countries. The data needs to be parsed sligthly different, so there are two makeMap and 
makeLinegraph function. And because I want to color in the maps differently I have two pickType and makeLegend functions. Another decision I made is that
the makeBarchart pickType function are called on every mousemovement even when the selected year hasn't changed, but besides this constant function calling
are the datamap and barchart still quikly with responding, so I decided to leave it like this.

If I had more time on this project I would probably spend more time on formatting my data more efficient and trying to find a more elegant
way to work arpund the years I had no data available. 



###Processbook

######31 May
Searching and collecting the data, the amount of how many aid a country donates and the variation in sector and years, from OECD and World Bank and transferring it into a JSON files. Also I collected the code to make datamaps in d3. 

######2 June
I have been busy by importing my data in to the javascript code and have linked the various sectors and years to the countrycodes and to my map. I also have decided to add a slider and toggle option to my map. 

######3 June 
Showed my idea during the presentation, because of trouble with the data I could only show the map.  

######6 June
Finally had the data loaded in correctly, in a way that I could use to make the line chart. But it wasnt the most efficient way. 


######7 June
Showed my code during the hour of code, there were some inefficient way of coding so I fixed those lines. Then I tried to work 
around the ineffiecient database I created, the conclusion was that I need to try to parse my data in a different format.

######8 june
Parsed my data in a different form for the line graph, which was I was able to draw at the end of the day. But I came to the conclusion that the data needs to be sligtly different for creating the barchart.

######9 June
Created a different json file for the barchart which is being parsed in a similiar way for the line graph but the outcome for the dataset is different. Now my three visualisations are working and reacting to each other. y

######13 June
Loaded in third json file of oda receiving data, and created a second makemap function to show that data on a world map.

######14 June 
Turned my line chart in to a slider, which updates the fills of the world map countries. This brings certain bugs with that I need to fix.

######15 June
Because not all countries have data over the last ten years, not all countries are filled based on the value of the same year. I fixed this temporily by changing the CSV file. I also fixed my line graph function to update the barchart correctly. And made sure my second map function works similiar as the first map function with the different data

######16 June
Found a way to fix the problem of various data lenght of countries, without changing the csv. But this only correct for countries that only have data avaliable for the most recent years. I also tried to fix my popup on the map, so that the slider updates the popup, but it didn't work

######20 June
Fixed my popup by creating the global variable "index". Fixed small bug that makes sure all info stays in linechartsvg. Fixed data problem in Receiving country CSV.

######21 June
Created new html page "introduction" which tells more info about the data. Also added a link menu which brings you to the two html pages. Also made some elements prettier using css

######22 June 
Added a tooltip for my barchart and added a div to show the selected country and year more prominently.

######23 June
Wrote report.

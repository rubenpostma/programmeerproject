# Official Development Assisstance





My data has the goal to show the amount of Official Development  Aid (ODA) that a country gives. The visualization shows in the first instance a map where you can see the countries that give ODA, the different amounts of aid received/given is shown through a gradient color scale.

![](doc/donor.PNG)

When you click on one of the countries a timeline shows up, which shows the given/received ODA of various years of the selected country. 

![](doc/line.PNG)

Then when a year within that you can see the different sectors that received the aid, which will be visualized with a bar chart.

![](doc/bar.PNG)

The problem I hope to solve with this visualization is to show in a clear way how much money is spend on developmental aid, and on what sectors it has been spend throughout the years. 



I will use the databases from the Organisation for Economic Co-operation and Development (OECD) (http://stats.oecd.org/Index.aspx?datasetcode=TABLE5), which works close with ODA. I want to set these data in a JSON format.

A similar visualization can be found on the site of the OECD but shows only a map that only shows how much a of the aid a country receives is ODA.  

This code is under public domain, so anyone is free to use it. For details check LICENSE.md

I made this code using the following external code 

d3: Copyright (c) 2010-2016, Michael Bostock
d3-tips: Copyright (c) 2013 Justin Palmer
jquery: jQuery v1.12.2 | (c) jQuery Foundation | jquery.org/license


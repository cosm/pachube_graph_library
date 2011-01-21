Pachube Graph Library
=====================

Usage
=====

In your page head include:
    <script src="http://www.pachube.com/widgets/PachubeLoader.js"></script>

In your page body include:
    <!-- For each graph you want, include: -->
    <div id="graph" class="pachube-graph" pachube-resource="/feeds/FEED_ID/datastreams/DATASTREAM_ID" pachube-key="API_KEY" pachube-options="OPTIONS" style="width:WIDTH; height:HEIGHT;">&nbsp;</div>


Options
=======

Optional settings you can use to set up your graph include:

Sets a default timespan for the graph:
    timespan: last hour;  
              24 hours;
              4 days;
              3 months;

Makes the graph end at the current time, instead of at the end of the next interval.
(e.g. A 1 hour graph viewed at 1:15pm will go from 12:15pm to 1:15pm):
    rolling:  true;       

Automatically updates the graph with new data every 5 minutes:
    update: true;         

Sets the background color for the graph:
    background-color: #ffffff

Sets the color of the line:
    line-color: #ff0066;

Sets the color of the grid behind the line:
    grid-color: #efefef;

Sets the color of the border around the graph:
    border-color: #9d9d9d;

Sets the color of the text and labels around the graph:
    text-color: #555555;        

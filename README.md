# jschallenge

I used your API to visualize the availability of your cars for the two hours rental for the next week.

The visualization is a table/calendar where rows are days and columns are hours. Each cell is a map of the pick-up locations and the size of the dots indicate ho many cars are available at each parking. For example map in the row +1, column 7h shows all the parkings that have cars available for 2 hours rental tomorrow at 7AM.

In that way you can easily see your cars availability throughout the week.

Hours are not exactly precise. This is because for unknown reason request from 6AM to 7AM sharp returns empty results:
http://jschallenge.smove.sg/provider/1/availability?book_start=1443132000906&book_end=1443135600906
Or at least on September 23 in the evening was returning an empty result. Because right now it works ;)

That's how it should look like
![Screenshot](screenhot.png?raw=true "Screenshot Sept 24 2015 1PM")

Each cell is a map. Each circle is one parking. I am sure you can recognize each of the parkings even though there are no roads or land rendered. If you cannot see a certain parking on the map it means that there are 0 cars available.
![Map](map.png?raw=true "Map of the pick-up points")


## notes
Raw project was genererated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.11.1.

### Build & development

Run `grunt` for building and `grunt serve` for preview.

### Testing

Running `grunt test` will run the unit tests with karma (if needed...) :)

'use strict';
angular.module('jschallengeApp')

.controller('MainCtrl', function ($scope, $http) {

    // Rental time in hours
    $scope.rentalTime = 2;

    // How many rows of the table - 1 will be rendered
    var numDays = 6;

    // Generate SVG element with the map from the data inside the container passed
    var generateMap = function (data, container) {

        var size = 400;

        var svg = d3.select(container)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', ' 0 0 ' + size + ' ' + size);

        // Use mercator projection - center and scale set manually because the data is known
        var projection = d3.geo.mercator()
            .scale(300000)
            .center([103.797717, 1.302208])
            .translate([size / 2, size / 2]);

        // Draw all the points
        var points = svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('r', function (d) {
                return d.cars_available * 3;
            })
            .attr('cx', function (d) {
                return projection([parseFloat(d.longitude), 0])[0];
            })
            .attr('cy', function (d) {
                return projection([0, parseFloat(d.latitude)])[1];
            });

        points.append('title')
            .text(function (d) {
                return d.parking_shortname || '';
            });
    };

    // Render the table of maps
    var drawViz = function (data) {

        // Create table
        var rows = d3.select('#viz')
            .append('table')
            .selectAll('tr')
            .data(data)
            .enter()
            .append('tr');

        rows.selectAll('td')
            .data(function (d) {
                return d;
            })
            .enter()
            .append('td')
            .each(function (d) {
                // Generate map in each table cell
                generateMap(d, this);
            });

        // Add first label rows
        d3.select('#viz table')
            .insert('tr', 'tr')
            .selectAll('td')
            .data([7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23])
            .enter()
            .append('td')
            .text(function (d) {
                return d + 'h';
            });

        // Add first column
        d3.select('#viz table')
            .selectAll('tr')
            .insert('td', 'td')
            .data(['', 'today', '+1', '+2', '+3', '+4', '+5', '+6'])
            .text(function (d) {
                return d;
            });
    };

    // When all the data is received process/clean it and draw the visualization
    var counter = 0;
    var onReceivedData = function (data) {
        counter += 1;
        if (counter === data.length) {

            // Group by days
            var days = Array.apply(null, Array(numDays + 1));
            days.map(function (_, i, list) {
                list[i] = data.splice(0, i === 0 ? ((data.length % 24) || 24) : 24);
            });

            // Fill up the first day with empty elements as it may not contain
            // all 24 hours e.g. when we call this method in the afternoon
            days[0] = Array.apply(null, Array(24 - days[0].length))
                .map(function () {
                    return [];
                })
                .concat(days[0]);

            // Remove first 7 hours of each day - booking available from 6am
            days.map(function (d) {
                d.splice(0, 7);
            });

            // Render visualization using clean data
            drawViz(days);
        }
    };

    // Lets fetch data for the rest of today (23 - new Date().getHours()) and another numDays days
    var count = (23 - new Date().getHours()) + 24 * numDays;

    // Fetch the data from the server
    Array.apply(null, Array(count))
        .map(function (_, i, list) {

            var start = Date.now() + (i + 1) * 3600 * 1000;
            var end = start + $scope.rentalTime * 3600 * 1000;
            var url = 'http://jschallenge.smove.sg/provider/1/availability?book_start=' + start + '&book_end=' + end;

            $http.get(url)
                .success(function (result) {
                    list[i] = result;
                    onReceivedData(list);
                })
                .error(function (err) {
                    console.error(err);
                });
            return i;
        });
});

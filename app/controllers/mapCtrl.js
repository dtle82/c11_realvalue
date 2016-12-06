angular.module('realValue')

    .controller("mapController", [ '$scope', '$http', 'leafletData', 'leafletMapEvents', 'checkboxService', function($scope, $http, leafletData, leafletMapEvents, checkboxService) {
        //console.log("style", style);
        console.log("init map");
/*
        /!************************************************!/
        // Trying to get data from checkboxService, from the other controller where the checkboxes are -T
        self.checkboxService = checkboxService.list;
        setTimeout(function() {
            console.log('passed in object array after 10 seconds: ', checkboxService.checkboxObj.list);
        }, 10000);
        /!*************************************************!/
*/

        // fixed issue when map is shown after the map container has been resized by css
        // http://stackoverflow.com/questions/24412325/resizing-a-leaflet-map-on-container-resize
        $scope.$on('leafletDirectiveMarker.click', function(e, args) {
            // Args will contain the marker name and other relevant information
            console.log("Leaflet Click");
        });
        setTimeout(function(){ leafletData.getMap().then(function(map) {
            console.log("resize");
            map.invalidateSize(false);
        });
        }, 400);

        function stylefunction() {

        }

        angular.extend($scope, {
            center: {
                 lat: 33.8247936182649,
                 lng: -118.03985595703125,
                 zoom: 8
            },
            tiles: {
                url: "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
                options: {
                    attribution: 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>'
                }
            },
            geojson : {
                data: [county_los_angeles,county_orange],
                style: county_style,
                onEachFeature: function (feature, layer) {
                    // fixed issue with referencing layer inside our reset Highlight function
                    //console.log("layer",layer);
                    layer.bindPopup(feature.properties.popupContent);

                    leafletData.getMap().then(function(map) {
                        label = new L.Label();
                        label.setContent(feature.properties.name);
                        label.setLatLng(layer.getBounds().getCenter());
                        map.showLabel(label);
                    });


                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight,
                        click: zoomToFeature
                    });
                }
            }
        });

        function highlightFeature(e) {
            var layer = e.target;

            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }

            //info.update(layer.feature.properties);
        }

        function resetHighlight(e) {
            /* had to custom edit this for angular from interactive choropleth example */
            var layer = e.target;
            layer.setStyle({
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3'
            });
        }

        function zoomToFeature(e) {
            leafletData.getMap().then(function(map) {
                //console.log(e);
                //console.log(map);
                map.fitBounds(e.target.getBounds());
            });
            // Modified for Angular
            // map.fitBounds(e.target.getBounds());
        }

        function style(feature) {
            return {
                fillColor: getColor(feature.properties.score),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }

        function county_style(feature) {
            return {
                fillColor: getCountyColor(feature.properties.score),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }

        function getColor(d) {
/*            return d > 85000 ? '#FF403D' :
                d > 75000  ? '#DA4C47' :
                d > 65000  ? '#B65852' :
                d > 55000  ? '#91655D' :
                d > 45000   ? '#6D7167' :
                d > 35000   ? '#487E72' :
                d > 25000   ? '#248A7D' :
                           '#009788';*/
            return d > 8000000 ? '#009787' :
                d > 17  ? '#029D73' :
                d > 16  ? '#04A35D' :
                d > 15  ? '#07A946' :
                d > 14   ? '#09AF2E' :
                d > 13   ? '#0CB515' :
                d > 12   ? '#24BB0F' :
                d > 11   ? '#45C113' :
                d > 10   ? '#67C716' :
                d > 9   ? '#8ACE1A' :
                d > 8   ? '#AFD41D' :
                d > 7   ? '#D4DA21' :
                d > 6   ? '#E0C725' :
                d > 5   ? '#E6AC2A' :
                d > 4   ? '#EC922E' :
                d > 3   ? '#F27733' :
                d > 2   ? '#F85B38' :
                    '#FF403D';
        }

        function getCountyColor(d) {
/*            return d > 8000000 ? '#009788' :
                d > 5000000  ? '#248A7D' :
                d > 3000000  ? '#487E72' :
                d > 1000000  ? '#6D7167' :
                d > 500000   ? '#91655D' :
                d > 300000   ? '#B65852' :
                d > 100000   ? '#DA4C47' :
                              '#FF403D';*/
            return d > 8000000 ? '#009787' :
                d > 17  ? '#029D73' :
                d > 16  ? '#04A35D' :
                d > 15  ? '#07A946' :
                d > 14   ? '#09AF2E' :
                d > 13   ? '#0CB515' :
                d > 12   ? '#24BB0F' :
                d > 11   ? '#45C113' :
                d > 10   ? '#67C716' :
                d > 9   ? '#8ACE1A' :
                d > 8   ? '#AFD41D' :
                d > 7   ? '#D4DA21' :
                d > 6   ? '#E0C725' :
                d > 5   ? '#E6AC2A' :
                d > 4   ? '#EC922E' :
                d > 3   ? '#F27733' :
                d > 2   ? '#F85B38' :
                '#FF403D';
        }

        leafletData.getMap().then(function (map) {

            map.on('zoomend', function (event) {
                console.log(restaurants);
                console.log(map.getZoom());
                if (map.getZoom() > 8) {
                    angular.extend($scope, {
                        center: {
                            lat: 33.63622083463071,
                            lng: -117.73948073387146,
                            zoom: 10
                        },
                        markers: {
                            osloMarker: {
                                lat: 33.6362,
                                lng: -117.7394,
                                message: "I want to travel here!",
                                focus: true,
                                draggable: false
                            },
                            r1:restaurants["Restaurant1"],
                            r2:restaurants["Restaurant2"],
                            r3:restaurants["Restaurant3"],
                            r4:restaurants["Restaurant4"],
                            r5:restaurants["Restaurant5"],
                            r6:restaurants["Restaurant6"],
                            r7:restaurants["Restaurant7"],
                            r8:restaurants["Restaurant8"],
                            r9:restaurants["Restaurant9"],
                            r10:restaurants["Restaurant10"]
                        },
                        geojson : {
                            data: [zip_91001,zip_91006,zip_91107,zip_91011,zip_91010,zip_91016,zip_91020,
                                zip_93510, zip_91024,zip_91030, zip_91040, zip_91042, zip_91101, zip_91003, zip_91105,
                                zip_91105,zip_93534, zip_91104, zip_93532, zip_91107, zip_93536, zip_91106,
                                zip_93535, zip_91108, zip_93543, zip_93544, zip_93551, zip_93550, zip_93553,
                                zip_93552, zip_93563, zip_91202, zip_91201, zip_93591, zip_91204, zip_91203,
                                zip_91206, zip_91205, zip_91208, zip_91207, zip_91210, zip_91214, zip_91302,
                                zip_91301, zip_91304, zip_91303, zip_91306, zip_91307, zip_91311, zip_91316,
                                zip_91321, zip_91325, zip_91324, zip_91326, zip_91331, zip_91330, zip_91335,
                                zip_91340, zip_91343, zip_91342, zip_91345, zip_91344, zip_91350, zip_91352,
                                zip_91351, zip_91354, zip_91356, zip_91355, zip_91361, zip_91364, zip_91367,
                                zip_91381, zip_91384, zip_91387, zip_91390, zip_91402, zip_91401, zip_91406,
                                zip_91405, zip_91411, zip_91423, zip_91436, zip_91501, zip_91502, zip_91505,
                                zip_91504, zip_91506, zip_91602, zip_91601, zip_91604, zip_91606, zip_91605,
                                zip_91607, zip_91706, zip_91702, zip_91711, zip_91722, zip_91724, zip_91724,
                                zip_92618,zip_92604,zip_92620,zip_91331,zip_92602,zip_92782,zip_93536,zip_90265,zip_92672,
                                zip_92804,zip_92868,zip_92866],
                            style: style,
                            onEachFeature: function (feature, layer) {
                                // fixed issue with referencing layer inside our reset Highlight function
                                layer.bindPopup(feature.properties.popupContent);

                                leafletData.getMap().then(function(map) {
                                    label = new L.Label();
                                    label.setContent(feature.properties.name);
                                    label.setLatLng(layer.getBounds().getCenter());
                                    console.log(feature.properties.name + " " + layer.getBounds().getCenter());
                                    map.showLabel(label);
                                });

                                layer.on({
                                    mouseover: highlightFeature,
                                    mouseout: resetHighlight,
                                    click: zoomToFeature
                                });
                            }
                        }
                    });

                }

            });
        });

    }]);
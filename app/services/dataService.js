angular.module('realValue')
    .service('dataService', function ($q) {
        var self = this;
        var config = {
            apiKey: "AIzaSyDA0QfT-TwSiFshrNjrg3yQ67bPBo4HVsw",
            authDomain: "realvalue-ebd58.firebaseapp.com",
            databaseURL: "https://realvalue-ebd58.firebaseio.com",
            storageBucket: "realvalue-ebd58.appspot.com",
            messagingSenderId: "73443138678"
        };
        firebase.initializeApp(config);
        var fbRef=firebase.database();
        fbRef.ref("crime-and-job-data-analysis").on('value',function(snapshot){
            crime_and_job_data_analysis=snapshot.val();
        })
        this.find_city_based_on_zip_code=function(zip) {
            var result = [];
            for (var city in la_zips) {
                for (var i = 0; i < la_zips[city]["zip_codes"].length; i++) {
                    if (la_zips[city]["zip_codes"][i] === zip) {
                        result.push(city + ", CA");
                    }
                }

            }
            return result;
        };

        this.weikuan_init = function() {

            var deferred = $q.defer();

            fbRef.ref("combine").once('value',function(snapshot){
                deferred.resolve(snapshot.val());
            });

            return deferred.promise;
        };

        this.weikuan_init().then(
            function(response) {
                self.firebase = response;
                //console.log("Firebase:",self.firebase);
                self.mergeData();
                //console.log("la size", roughSizeOfObject(losangeles_geojson));
            });

        this.mergeData = function() {
            console.log("merging data");

            var zip_city;
            var lookup_zip;
            var jobs_openings;
            var crimes;
            for(var i=0;i<tammy_geojson.features.length;i++){
                //console.log(miles_geojson.features[i].properties.name);
                lookup_zip = tammy_geojson.features[i].properties.name;
                zip_city = this.find_city_based_on_zip_code(lookup_zip);
                //console.log(miles_geojson.features[i]);
                //console.log("tammy match zip: " + lookup_zip + " with " + zip_city);

                if(zip_city.length > 1) {
                    for(var j=0;j<zip_city.length;j++) {
                        console.error("duplicate city: " + zip_city[j] + ' zipcode: ' + lookup_zip);
                        if(zip_city[j] != '' ){
                            jobs_openings = self.firebase[zip_city[j]]["Number of job openings"];
                            console.log("data", self.firebase[zip_city[j]]);
                            if(self.firebase[zip_city[j]].hasOwnProperty("zip_codes")
                                && self.firebase[zip_city[j]]["zip_codes"].hasOwnProperty(lookup_zip)
                                && self.firebase[zip_city[j]]["zip_codes"][lookup_zip].hasOwnProperty("crime") ) {
                                crimes = self.firebase[zip_city[j]]["zip_codes"][lookup_zip]["crime"]["2014"]["Violent_sum"];
                                console.log("crime totals ", crimes);
                                tammy_geojson.features[i].properties.crimes = crimes;
                                console.log("tammy geojson ", tammy_geojson.features[i].properties.crimes);
                            } else {
                                crimes = 0;
                                //console.log("no crimes");
                            }
                            //console.log("job openings ", jobs_openings);

                            tammy_geojson.features[i].properties.jobs = jobs_openings;
                            tammy_geojson.features[i].properties.score = parseInt(jobs_openings) - parseInt(crimes);
                        }
                    }

                } else {
                    //console.log("zip city", zip_city);
                    if(zip_city[0] != undefined) {

                        if(self.firebase[zip_city[0]].hasOwnProperty("zip_codes")
                            && self.firebase[zip_city[0]]["zip_codes"].hasOwnProperty(lookup_zip)
                            && self.firebase[zip_city[0]]["zip_codes"][lookup_zip].hasOwnProperty("crime") ) {
                            crimes = self.firebase[zip_city[0]]["zip_codes"][lookup_zip]["crime"]["2014"]["Violent_sum"];
                            //console.log("crime totals ", crimes);
                            tammy_geojson.features[i].properties.crimes = crimes;
                        } else {
                            crimes = 0;
                        }

                        jobs_openings = self.firebase[zip_city[0]]["Number of job openings"];
                        //console.log("job openings ", jobs_openings);
                        tammy_geojson.features[i].properties.jobs = jobs_openings;
                        tammy_geojson.features[i].properties.score = parseInt(jobs_openings) - parseInt(crimes);

                    }

                }

            }

            var zip_city;
            var lookup_zip;
            var jobs_openings;
            for(var i=0;i<losangeles_geojson.features.length;i++){
                //console.log(miles_geojson.features[i].properties.name);
                lookup_zip = losangeles_geojson.features[i].properties.name;
                zip_city = this.find_city_based_on_zip_code(lookup_zip);
                //console.log(zip_city.length);
                //console.log("la match zip: " + lookup_zip + " with " + zip_city);
                if(zip_city.length > 1) {
                    for(var j=0;j<zip_city.length;j++) {
                        console.error("duplicate city: " + zip_city[j] + ' zipcode: ' + lookup_zip);
                        if(zip_city[j] != '' ){
                            jobs_openings = self.firebase[zip_city[j]]["Number of job openings"];
                            //console.log("data", self.firebase[zip_city[j]]);
                            if(self.firebase[zip_city[j]].hasOwnProperty("zip_codes")
                                && self.firebase[zip_city[j]]["zip_codes"].hasOwnProperty(lookup_zip)
                                && self.firebase[zip_city[j]]["zip_codes"][lookup_zip].hasOwnProperty("crime") ) {
                                crimes = self.firebase[zip_city[j]]["zip_codes"][lookup_zip]["crime"]["2014"]["Violent_sum"];
                                console.log("crime totals ", crimes);
                                losangeles_geojson.features[i].properties.crimes = crimes;
                            } else {
                                crimes = 0;
                                //console.log("no crimes");
                            }
                            //console.log("job openings ", jobs_openings);

                            losangeles_geojson.features[i].properties.jobs = jobs_openings;
                            losangeles_geojson.features[i].properties.score = parseInt(jobs_openings) - parseInt(crimes);;
                        }
                    }

                } else {
                    //console.log(miles_geojson.features[i]);
                    ///console.log("miles match zip: " + lookup_zip + " with " + zip_city);
                    if(zip_city[0] != undefined ){
                        if(self.firebase[zip_city[0]].hasOwnProperty("zip_codes")
                            && self.firebase[zip_city[0]]["zip_codes"].hasOwnProperty(lookup_zip)
                            && self.firebase[zip_city[0]]["zip_codes"][lookup_zip].hasOwnProperty("crime") ) {
                            crimes = self.firebase[zip_city[0]]["zip_codes"][lookup_zip]["crime"]["2014"]["Violent_sum"];
                            console.log("crime totals ", crimes);
                            losangeles_geojson.features[i].properties.crimes = crimes;
                        } else {
                            crimes = 0;
                        }

                        jobs_openings = self.firebase[zip_city[0]]["Number of job openings"];
                        //console.log("job openings ", jobs_openings);
                        losangeles_geojson.features[i].properties.jobs = jobs_openings;
                        losangeles_geojson.features[i].properties.score = parseInt(jobs_openings) - parseInt(crimes);;

                    }
                }

            }
        };
        //self.crime_and_job =crime_and_job_data_analysis;
    });
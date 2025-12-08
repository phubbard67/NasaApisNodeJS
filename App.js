const request = require('request');

const options = {
    latitude: 0,
    longitude: 0,
    ApiKey: yQw3WjrWRJAXSq6dmnOf7oYkIwKnp4yJAa1nURMd, 
    //-------------------------------------------------Astroid NeoWs
    //---Neo - Feed
    ApiAstroidNeoFeed: 'GET https://api.nasa.gov/neo/rest/v1/feed?start_date=START_DATE&end_date=END_DATE&api_key='
}

const CurrentWeatherData = request({url: options.PortlandForecastGridData, json: true, headers: options.headers}, function(error, response){
    if(error){
        console.log("Portland... We have problem");
    }
    else{

    }
});
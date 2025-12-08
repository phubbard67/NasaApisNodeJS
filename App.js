// MIT License

// Copyright (c) 2025 Paul Elliott Hubbard

//----------------------------------------------Helper Functions
const GetTwoDigitString = function(nNumberToConver)
{
    if(nNumberToConver < 10)
    {
       return `0${nNumberToConver}`;
    }
    else
    {
        return `${nNumberToConver}`
    }
}

//----------------------------------------------Global Vars
const request = require('request');
const fs = require('fs');
const ini = require('ini');
const CurrentDate = new Date();
const DateInSevenDays = new Date();
DateInSevenDays.setDate(CurrentDate.getDate() + 7);

nDay = CurrentDate.getDate();
strDay = GetTwoDigitString(nDay);
nMonth = CurrentDate.getMonth();
strMonth = GetTwoDigitString(nMonth);

nSevenDays = DateInSevenDays.getDate();
strSevenDays = GetTwoDigitString(nSevenDays);
nMonthInSevenDays = DateInSevenDays.getMonth();
strMonthInSevenDays = GetTwoDigitString(nMonthInSevenDays);

const AstroidStartDate = `${CurrentDate.getFullYear()}-${strMonth}-${strDay}`;
const AstroidEndDate = `${DateInSevenDays.getFullYear()}-${strSevenDays}-${strMonthInSevenDays}`;
console.log(AstroidStartDate);

const options = {
    latitude: 0,
    longitude: 0,
    //-------------------------------------------------Astroid NeoWs
    //---Neo - Feed
    ApiAstroidNeoFeed: `https://api.nasa.gov/neo/rest/v1/feed?start_date=${AstroidStartDate}&end_date=${AstroidStartDate}&api_key=`
}
 
try{
    //Get the API File data:
    // NOTE: If you want to create your own file, just 
    //        create it and put the following code inside to work with this API
    //        after creating your own API key at https://api.nasa.gov. Otherwise, you can remove the 
    //        ini file code and copy your api key directly into the ApiKey var. 
    //Contents of the file my_api_keys.ini:
    //[NASA_API]
    //API_KEY='yourApiKeyGoesBetweenTheseQuotes'
    //----------Comment out or remove if not Using INI file and replace ApiKey with your key value.
    const config = fs.readFileSync("../my_api_keys.ini", "utf-8");
    const ApiDatabase = ini.parse(config)
    //---End Comment our or remove...

    const ApiKey = ApiDatabase.NASA_API.API_KEY;
    console.log(ApiKey);

    const CurrentWeatherData = request({url: `${options.ApiAstroidNeoFeed}${ApiKey}`, json: true, headers: options.headers}, function(error, response){
        if(error){
            console.log("Portland... We have problem");
            console.log(CurrentDate.getDate());
        }
        else{
            console.log(response.body);
        }
    });

}catch(error){
    console.log("Portland... We REALLY have a problem here.\n");
    console.log(error); 
}
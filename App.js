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

//---Astroid NeoWs Vars
//Neo Feed Vars
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

//Neo Lookup Vars
const AsteroidPKNine = '3542519'

const options = {
    //-------------------------------------------------Astroid NeoWs
    //---Neo - Feed
    ApiAstroidNeoFeed: `https://api.nasa.gov/neo/rest/v1/feed?start_date=${AstroidStartDate}&end_date=${AstroidStartDate}&api_key=`,
    //---Neo - Lookup by Astroid ID
    ApiAstriodLookup: `https://api.nasa.gov/neo/rest/v1/neo/${AsteroidPKNine}?api_key=`,
    //---New - Browse all NEO data
    ApiAsteroidBrowse: `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=`
}  

//-------------------------------------------Run All Astroid APIs
const GetAsteroidNeoData = function(ApiKey)
{
    //======================Get the Asteriod Feed Information
    const CurrentAsteriodFeed = request({url: `${options.ApiAstroidNeoFeed}${ApiKey}`, json: true, headers: options.headers}, function(error, response){
        if(error){
            console.log("Portland... We have problem");
            console.log(error);
        }
        else{
            console.log("========================Astroid / NEOs APIs>");
            console.log("\n\n===NEOs Feed API>");
            //Read out all Near Earth Ojects found
            const nNumberOfNEOs = response.body.element_count;
            console.log(`NEOs That are the closest to Earth in the next 7 days:`);
            console.log(`   Number of NEOs in the Next 7 Days: ${nNumberOfNEOs}`);
            const NearEarthObjects = response.body.near_earth_objects;
            for(const date in NearEarthObjects)
            {
                if(response.body.hasOwnProperty.call(NearEarthObjects, date)){
                    const NEOs = NearEarthObjects[date];
                    console.log(`NEOs for Date: ${date}`);
                    for(i = 0; i < nNumberOfNEOs; ++i)
                    {
                        console.log(`Astroid Name: ${NEOs[i].name}\nAstroid Potentially Hazardous: ${NEOs[i].is_potentially_hazardous_asteroid}`);
                    }
                }
            }
        }
    });
    //===End Astroid Feed

    //======================Get A particular Asteroid
    const CurrentCeresInformation = request({url: `${options.ApiAstriodLookup}${ApiKey}`, json: true, headers: options.headers}, function(error, response){
        if(error){
            console.log("Portland... We have problem");
            console.log(error);
        }
        else{
            //Break up the data
            console.log("\n\n===NEOs Search API>");
            console.log(`NEO API Hazard Result for Astriod: ${AsteroidPKNine}`)
            console.log(`Astriod Name: ${response.body.name}\nPotentially Hazardous to Earth: ${response.body.is_potentially_hazardous_asteroid}`);
        }
    });
    //===End Get A Particular Asteroid

    //======================Browse all NEO Data
    const CurrentBrowseInformation = request({url: `${options.ApiAsteroidBrowse}${ApiKey}`, json: true, headers: options.headers}, function(error, response){
        if(error){
            console.log("Portland... We have problem");
            console.log(error);
        }
        else{
            console.log("\n\n===NEOs Browse API>");
            //Read out all Near Earth Ojects found
            const nNumberOfNEOs = response.body.page.size;
            console.log(`Astroids Returned from the Browse API:`);
            console.log(`   Number of NEOs: ${nNumberOfNEOs}`);
            const NearEarthObjects = response.body.near_earth_objects;
            for(i = 0; i < nNumberOfNEOs; ++i)
            {
                const isHazardous = NearEarthObjects[i].is_potentially_hazardous_asteroid;
                if(isHazardous == true)
                {
                    console.log(`\n------------------------------Astroid Name: ${NearEarthObjects[i].name}\n-POTENTIALLY HAZARDOUS TO EARTH!!!!!!!!!!!!`)
                    const PotentialCloseCallDates = NearEarthObjects[i].close_approach_data;
                    let dateBuff = PotentialCloseCallDates[0].close_approach_date;
                    let approchYearBuffer = dateBuff.substring(0, 4);
                    let intYearBuffer = parseInt(approchYearBuffer);

                    j = 0;
                    while(intYearBuffer < CurrentDate.getFullYear())
                    {
                        dateBuff = PotentialCloseCallDates[j].close_approach_date;
                        approchYearBuffer = dateBuff.substring(0, 4);
                        intYearBuffer = parseInt(approchYearBuffer);
                        j++;
                    }
                    console.log(`---------------------Next Potential Planet of Colision: ${PotentialCloseCallDates[j].orbiting_body}\n---Date of Potential Colision: ${PotentialCloseCallDates[j].close_approach_date_full}\n`);
                }
                else
                {
                    console.log(`Astroid Name: ${NearEarthObjects[i].name}\nPotentially Hazardous to Earth: ${isHazardous}`)
                }
            }
        }
    });
    //===End Browse all NEO Data
}
 
//--------------------Main App Functionality 
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
    
    GetAsteroidNeoData(ApiKey);


}catch(error){
    console.log("Portland... We REALLY have a problem here.\n");
    console.log(error); 
}
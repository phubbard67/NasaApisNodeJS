// MIT License

// Copyright (c) 2025 Paul Elliott Hubbard

//-----------This Node module calls data from 
//------        From all available AsteroidNeoWs APIs
//------        at this time, and displays some data of 
//------        of interest. Its just a demo... for now. 
//----------------------------------------------Global Vars
const request = require('request');
const common = require('./commonModule');
const CurrentDate = new Date();

//---AsteroidNeoWs Vars
const DateInSevenDays = new Date();
DateInSevenDays.setDate(CurrentDate.getDate() + 7);

nDay = CurrentDate.getDate();
strDay = common.GetTwoDigitStringFunc(nDay);
nMonth = CurrentDate.getMonth() + 1;
strMonth = common.GetTwoDigitStringFunc(nMonth);

nSevenDays = DateInSevenDays.getDate();
strSevenDays = common.GetTwoDigitStringFunc(nSevenDays);
nMonthInSevenDays = DateInSevenDays.getMonth() + 1;
strMonthInSevenDays = common.GetTwoDigitStringFunc(nMonthInSevenDays);

const AsteroidStartDate = `${CurrentDate.getFullYear()}-${strMonth}-${strDay}`;
const AsteroidEndDate = `${DateInSevenDays.getFullYear()}-${strMonthInSevenDays}-${strSevenDays}`;

//---AsteroidNeoWs Lookup Vars
const AsteroidPKNine = '3542519'

const AsteroidNeoWsOptions = {
    //-------------------------------------------------Asteroid NeoWs
    //---AsteroidNeoWs - Feed
    ApiAsteroidNeoWsFeed: `https://api.nasa.gov/neo/rest/v1/feed?start_date=${AsteroidStartDate}&end_date=${AsteroidEndDate}&api_key=`,
    //---AsteroidNeoWs - Lookup by Asteroid ID
    ApiAsteroidNeoWsLookup: `https://api.nasa.gov/neo/rest/v1/neo/${AsteroidPKNine}?api_key=`,
    //---AsteroidNeoWs - Browse all NEO data
    ApiAsteroidNeoWsBrowse: `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=`
}  

function GetAsteroidNeoWsData(ApiKey)
{
    //======================Get the Asteriod Feed Information
    const CurrentAsteriodFeed = request({url: `${AsteroidNeoWsOptions.ApiAsteroidNeoWsFeed}${ApiKey}`, json: true}, function(error, response){
        if(error){
            common.ErrorPrintFunc(error);
        }
        else{
            console.log("\n\n====================-------------------------------------> AsteroidNeoWs Feed API Data for the Next Seven Days>\n");
            //Read out all Near Earth Ojects found
            const nNumberOfNEOs = response.body.element_count;
            console.log(`   Number of Asteroids of interest in the Next 7 Days: ${nNumberOfNEOs}`);
            const NearEarthObjects = response.body.near_earth_objects;
            for(const date in NearEarthObjects)
            {
                if(response.body.hasOwnProperty.call(NearEarthObjects, date)){
                    const NEOs = NearEarthObjects[date];
                    console.log(`--------------------------------------- Asteroids for Date -> ${date}`);
                    for(const NearEarthObject in NEOs)
                    {
                        if(response.body.hasOwnProperty.call(NEOs, NearEarthObject)){

                            if(NEOs[NearEarthObject].is_potentially_hazardous_asteroid == true)
                            {
                                console.log(`\n !!!!!!!!!!!!!!POTENTIALLY HAZARDOUS TO EARTH!!!!!!!!!!!!!!\n`);
                                console.log(`----- Asteroid Name: ${NEOs[NearEarthObject].name}`);
                                const PotentialCloseCallDates = NEOs[NearEarthObject].close_approach_data;
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
                                console.log(`----- Next Planet of Close Approach: ${PotentialCloseCallDates[j].orbiting_body}`);
                                console.log(`----- Time of Close Approach to ${PotentialCloseCallDates[j].orbiting_body}: ${PotentialCloseCallDates[j].close_approach_date_full}\n`);
                                console.log(` ^^^^^^^^^^^^^^POTENTIALLY HAZARDOUS TO EARTH^^^^^^^^^^^^^^\n`);
                            }
                            else{
                                console.log(`----- Asteroid Name: ${NEOs[NearEarthObject].name}`);
                                console.log(`--- Asteroid Potentially Hazardous: ${NEOs[NearEarthObject].is_potentially_hazardous_asteroid}\n`);
                            }
                        }
                    }
                }
            }
        }
    });
    //===End Asteroid Feed

    //======================Get A particular Asteroid
    const CurrentCeresInformation = request({url: `${AsteroidNeoWsOptions.ApiAsteroidNeoWsLookup}${ApiKey}`, json: true, headers: AsteroidNeoWsOptions.headers}, function(error, response){
        if(error){
            common.ErrorPrintFunc(error);
        }
        else{
            //Break up the data
            console.log("\n\n====================-------------------------------------> AsteroidNeoWs Search API Data>\n");
            console.log(`Asteroid FOUND: ${AsteroidPKNine}`)
            console.log(`Asteroid Name: ${response.body.name}\nPotentially Hazardous to Earth: ${response.body.is_potentially_hazardous_asteroid}`);
        }
    });
    //===End Get A Particular Asteroid

    //======================Browse all AsteroidNeoWs Data
    const CurrentBrowseInformation = request({url: `${AsteroidNeoWsOptions.ApiAsteroidNeoWsBrowse}${ApiKey}`, json: true, headers: AsteroidNeoWsOptions.headers}, function(error, response){
        if(error){
            common.ErrorPrintFunc(error);
        }
        else{
            console.log("\n\n====================-------------------------------------> AsteroidNeoWs Browse API Data>\n");
            //Read out all Near Earth
            //  Ojects found
            const nNumberOfNEOs = response.body.page.size;
            console.log(`Asteroids Returned from the Browse API:`);
            console.log(`   Number of Asteroids: ${nNumberOfNEOs}`);
            const NearEarthObjects = response.body.near_earth_objects;
            for(i = 0; i < nNumberOfNEOs; ++i)
            {
                const isHazardous = NearEarthObjects[i].is_potentially_hazardous_asteroid;
                if(isHazardous == true)
                {
                    console.log(`\n !!!!!!!!!!!!!!POTENTIALLY HAZARDOUS TO EARTH!!!!!!!!!!!!!!\n`);
                    console.log(`----- Asteroid Name: ${NearEarthObjects[i].name}`);
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
                    console.log(`----- Next Planet of Close Approach: ${PotentialCloseCallDates[j].orbiting_body}`);
                    console.log(`----- Date of Close Approach to ${PotentialCloseCallDates[j].orbiting_body}: ${PotentialCloseCallDates[j].close_approach_date_full}\n`);
                    console.log(` ^^^^^^^^^^^^^^POTENTIALLY HAZARDOUS TO EARTH^^^^^^^^^^^^^^\n`);
                }
                else
                {
                    console.log(`----- Asteroid Name: ${NearEarthObjects[i].name}`);
                    console.log(`--- Potentially Hazardous to Earth: ${isHazardous}\n`);
                }
            }
        }
    });
    //===End Browse all AsteroidNeoWs Data
}

module.exports = {
    GetAsteroidNeoWsDataFunc: GetAsteroidNeoWsData
}
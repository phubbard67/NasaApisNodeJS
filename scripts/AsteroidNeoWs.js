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
//----I am using PKNine as the default asteroid
//     for no other reason than it is the default 
//     that NASA uses. 
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

function GetAsteroidNeoWsFeed(ApiKey) {
    //======================Get the Asteriod Feed Information
    const CurrentAsteriodFeed = request({ url: `${AsteroidNeoWsOptions.ApiAsteroidNeoWsFeed}${ApiKey}`, json: true }, function (error, response) {
        if (error) {
            common.ErrorPrintFunc(error);
        }
        else {
            console.log("\n\n====================-------------------------------------> AsteroidNeoWs Feed API Data for the Next Seven Days>\n");
            //Read out all Near Earth Ojects found

            if (response.body) {
                AsteroidFeedBody = response.body;

                if (AsteroidFeedBody.element_count) {
                    const nNumberOfNEOs = AsteroidFeedBody.element_count;
                    console.log(`   Number of Asteroids of interest in the Next 7 Days: ${nNumberOfNEOs}`);
                    const NearEarthObjects = response.body.near_earth_objects;
                    for (const date in NearEarthObjects) {
                        if (AsteroidFeedBody.hasOwnProperty.call(NearEarthObjects, date)) {
                            const NEOs = NearEarthObjects[date];
                            console.log(`--------------------------------------- Asteroids for Date -> ${date}`);
                            for (const NearEarthObject in NEOs) {
                                if (NearEarthObjects.hasOwnProperty.call(NEOs, NearEarthObject)) {

                                    if (NEOs[NearEarthObject].is_potentially_hazardous_asteroid == true) {
                                        console.log(`\n !!!!!!!!!!!!!!POTENTIALLY HAZARDOUS TO EARTH!!!!!!!!!!!!!!\n`);

                                        if (NEOs[NearEarthObject].name) {
                                            console.log(`----- Asteroid Name: ${NEOs[NearEarthObject].name}`);
                                        }
                                        else {
                                            common.PrintNoDataFoundFunc("NEO NAME");
                                        }

                                        if (NEOs[NearEarthObject].close_approach_data) {
                                            const PotentialCloseCallDates = NEOs[NearEarthObject].close_approach_data;
                                            if (PotentialCloseCallDates.length > 0) {
                                                let dateBuff = PotentialCloseCallDates[0].close_approach_date;
                                                let approchYearBuffer = dateBuff.substring(0, 4);
                                                let intYearBuffer = parseInt(approchYearBuffer);

                                                j = 0;
                                                while (intYearBuffer < CurrentDate.getFullYear()) {
                                                    dateBuff = PotentialCloseCallDates[j].close_approach_date;
                                                    approchYearBuffer = dateBuff.substring(0, 4);
                                                    intYearBuffer = parseInt(approchYearBuffer);
                                                    j++;
                                                }
                                                console.log(`----- Next Planet of Close Approach: ${PotentialCloseCallDates[j].orbiting_body}`);
                                                console.log(`----- Time of Close Approach to ${PotentialCloseCallDates[j].orbiting_body}: ${PotentialCloseCallDates[j].close_approach_date_full}\n`);
                                            }
                                            console.log(` ^^^^^^^^^^^^^^POTENTIALLY HAZARDOUS TO EARTH^^^^^^^^^^^^^^\n`);
                                        }
                                        else {
                                            common.PrintNoDataFoundFunc("CLOSE APPROACH DATA");
                                        }
                                    }
                                    else {
                                        console.log(`----- Asteroid Name: ${NEOs[NearEarthObject].name}`);
                                        console.log(`--- Asteroid Potentially Hazardous: ${NEOs[NearEarthObject].is_potentially_hazardous_asteroid}\n`);
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    common.PrintNoDataFoundFunc("NO ELEMENT COUNT FOUND FOR ASTEROIDNEOWS FEED API");
                }
            }
            else {
                common.PrintNoDataFoundFunc("NO BODY RETURNED FOR ASTEROIDNEOWS FEED API");
            }
        }
    });
    //===End Asteroid Feed
}

function GetAsteroidByDesignation(ApiKey, nDesignation) {

    bNoDesignation = false;

    if (nDesignation && nDesignation > -1) {
        AsteroidPKNine = nDesignation;
    }
    else{
        bNoDesignation = true;
    }

    //======================Get A particular Asteroid
    const CurrentCeresInformation = request({ url: `${AsteroidNeoWsOptions.ApiAsteroidNeoWsLookup}${ApiKey}`, json: true, headers: AsteroidNeoWsOptions.headers }, function (error, response) {
        if (error) {
            common.ErrorPrintFunc(error);
        }
        else {
            //Break up the data
            console.log("\n\n====================-------------------------------------> AsteroidNeoWs Search API Data>\n");
            if(bNoDesignation)
            {
                console.log(`- You did not pass in an asteroid designation number, so PKNine (Designation: ${AsteroidPKNine}) is being used by default.`);
                console.log(`- A list of designations can be found here at the time of this writing: https://cneos.jpl.nasa.gov/`);
            }
            console.log(`Asteroid FOUND: ${AsteroidPKNine}`)
            console.log(`Asteroid Name: ${response.body.name}\nPotentially Hazardous to Earth: ${response.body.is_potentially_hazardous_asteroid}`);
        }
    });
    //===End Get A Particular Asteroid

}
function GetAsteroidNeoWsData(ApiKey) {
    //======================Browse all AsteroidNeoWs Data
    const CurrentBrowseInformation = request({ url: `${AsteroidNeoWsOptions.ApiAsteroidNeoWsBrowse}${ApiKey}`, json: true, headers: AsteroidNeoWsOptions.headers }, function (error, response) {
        if (error) {
            common.ErrorPrintFunc(error);
        }
        else {
            console.log("\n\n====================-------------------------------------> AsteroidNeoWs Browse API Data>\n");
            //Read out all Near Earth
            //  Ojects found
            if (response.body.page.size) {
                const nNumberOfNEOs = response.body.page.size;
                console.log(`Asteroids Returned from the Browse API:`);
                console.log(`   Number of Asteroids: ${nNumberOfNEOs}`);
                if (response.body.near_earth_objects) {
                    const NearEarthObjects = response.body.near_earth_objects;
                    for (i = 0; i < nNumberOfNEOs; ++i) {
                        try {
                            const isHazardous = NearEarthObjects[i].is_potentially_hazardous_asteroid;
                            if (isHazardous == true) {
                                console.log(`\n !!!!!!!!!!!!!!POTENTIALLY HAZARDOUS TO EARTH!!!!!!!!!!!!!!\n`);
                                if (NearEarthObjects[i].name) {
                                    console.log(`----- Asteroid Name: ${NearEarthObjects[i].name}`);
                                }
                                else {
                                    common.PrintNoDataFoundFunc("ASTEROID NAME");
                                }

                                if (NearEarthObjects[i].close_approach_data && NearEarthObjects[i].close_approach_data[0].close_approach_date) {
                                    const PotentialCloseCallDates = NearEarthObjects[i].close_approach_data;
                                    let dateBuff = PotentialCloseCallDates[0].close_approach_date;
                                    let approchYearBuffer = dateBuff.substring(0, 4);
                                    let intYearBuffer = parseInt(approchYearBuffer);

                                    j = 0;
                                    while (intYearBuffer < CurrentDate.getFullYear()) {
                                        if (PotentialCloseCallDates[j].close_approach_date) {
                                            dateBuff = PotentialCloseCallDates[j].close_approach_date;
                                            approchYearBuffer = dateBuff.substring(0, 4);
                                            intYearBuffer = parseInt(approchYearBuffer);
                                            j++;
                                        }
                                        else {
                                            common.PrintNoDataFoundFunc("CLOSE APPROACH DATE")
                                        }
                                    }
                                    console.log(`----- Next Planet of Close Approach: ${PotentialCloseCallDates[j].orbiting_body}`);
                                    console.log(`----- Date of Close Approach to ${PotentialCloseCallDates[j].orbiting_body}: ${PotentialCloseCallDates[j].close_approach_date_full}\n`);
                                    console.log(` ^^^^^^^^^^^^^^POTENTIALLY HAZARDOUS TO EARTH^^^^^^^^^^^^^^\n`);
                                }
                                else {
                                    common.PrintNoDataFoundFunc("CLOSE APPROACH DATA");
                                }
                            }
                            else {
                                if (NearEarthObjects[i].name) {
                                    console.log(`----- Asteroid Name: ${NearEarthObjects[i].name}`);
                                    console.log(`--- Potentially Hazardous to Earth: ${isHazardous}\n`);
                                }
                            }
                        }
                        catch {
                            common.PrintNoDataFoundFunc("ASTEROID HAZARD DATA");
                        }

                    }
                }
                else {
                    common.PrintNoDataFoundFunc("NEAR EARTH OBJECTS");
                }
            }
            else {
                common.PrintNoDataFoundFunc("ASTEROIDNEOWS API DATA");
            }
        }
    });
    //===End Browse all AsteroidNeoWs Data
}

function GetAllAsteroidNeoWsData(ApiKey)
{
    GetAsteroidNeoWsData(ApiKey);
    GetAsteroidByDesignation(ApiKey, -1);
    GetAsteroidNeoWsFeed(ApiKey);
}

module.exports = {
    GetAllAsteroidNeoWsDataFunc: GetAllAsteroidNeoWsData,
    GetAsteroidNeoWsDataFunc: GetAsteroidNeoWsData, 
    GetAsteroidByDesignationFunc: GetAsteroidByDesignation,
    GetAsteroidNeoWsFeedFunc: GetAsteroidNeoWsFeed
}
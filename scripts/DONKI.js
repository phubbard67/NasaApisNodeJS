// MIT License

// Copyright (c) 2025 Paul Elliott Hubbard

//-----------This Node module calls data from 
//------        From all available DONKI Space Weather APIs
//------        at this time, and displays some data of 
//------        of interest. Its just a demo... for now. 
//----------------------------------------------Global Vars
const request = require('request');
const common = require('./commonModule');
const CurrentDate = new Date();
nDay = CurrentDate.getDate();
strDay = common.GetTwoDigitStringFunc(nDay);
nMonth = CurrentDate.getMonth() + 1;
strMonth = common.GetTwoDigitStringFunc(nMonth);

//--------------------------------------DONKI Vars
const DateSevenDaysAgo = new Date();
DateSevenDaysAgo.setDate(CurrentDate.getDate() - 7);
nSevenDays = DateSevenDaysAgo.getDate();
strSevenDays = common.GetTwoDigitStringFunc(nSevenDays);
nMonthSevenDaysAgo = DateSevenDaysAgo.getMonth() + 1;
strMonthSevenDaysAgo = common.GetTwoDigitStringFunc(nMonthSevenDaysAgo);
const DONKIEndDate = `${CurrentDate.getFullYear()}-${strMonth}-${strDay}`;
const DONKIStartDate = `${DateSevenDaysAgo.getFullYear()}-${strMonthSevenDaysAgo}-${strSevenDays}`;

//-------InterPlanetary Shock Specific Vars
const DateAboutOneYearAgo = new Date();
DateAboutOneYearAgo.setDate(CurrentDate.getDate() - 365);
const DONKIIPSStartDate = `${DateAboutOneYearAgo.getFullYear()}-${common.GetTwoDigitStringFunc(DateAboutOneYearAgo.getMonth() + 1)}-${common.GetTwoDigitStringFunc(DateAboutOneYearAgo.getDate())}`
const DONKIIPSEndDate = `${CurrentDate.getFullYear()}-${strMonth}-${strDay}`;

//------Solar Flare Specific Vars
const DateThirtyDaysAgo = new Date();
DateThirtyDaysAgo.setDate(CurrentDate.getDate() - 30);
const DONKIFLRStartDate = `${DateThirtyDaysAgo.getFullYear()}-${common.GetTwoDigitStringFunc(DateThirtyDaysAgo.getMonth() + 1)}-${common.GetTwoDigitStringFunc(DateThirtyDaysAgo.getDate())}`
const DONKIFLREndDate = `${CurrentDate.getFullYear()}-${strMonth}-${strDay}`;

//----------------------------DONKI APIs
const DONKIAPIs = {
    //-------------------------------------------------DONKI
    //---DONKI - CME (Coronal Mass Ejection) for the past 7 days. 
    ApiDONKICME:  `https://api.nasa.gov/DONKI/CME?startDate=${DONKIStartDate}&endDate=${DONKIEndDate}&api_key=`,
    //---DONKI - CME (Coronal Mass Ejection) Analysis for the past 7 days
    ApiDONKILookup: `https://api.nasa.gov/DONKI/CMEAnalysis?startDate=${DONKIStartDate}&endDate=${DONKIEndDate}&mostAccurateOnly=true&speed=500&halfAngle=30&catalog=ALL&api_key=`,
    //---DONKI - GeoMagnetic Storms (GST) for the past 7 days
    ApiDONKIGST: `https://api.nasa.gov/DONKI/GST?startDate=${DONKIStartDate}&endDate=${DONKIEndDate}&api_key=`,
    //---DONKI - Interplanetary Shock (IPS) for the past 7 days
    ApiDONKIIPS: `https://api.nasa.gov/DONKI/IPS?startDate=${DONKIIPSStartDate}&endDate=${DONKIIPSEndDate}&api_key=`,
    //---DONKI - Solar Flare (FLR) for the past 7 days
    ApiDONKIFLR: `https://api.nasa.gov/DONKI/FLR?startDate=${DONKIFLRStartDate}&endDate=${DONKIFLREndDate}&api_key=`,
    //---DONKI - Solar Energetic Particles (SEP) for the past 7 days
    ApiDONKISEP: `https://api.nasa.gov/DONKI/SEP?startDate=${DONKIStartDate}&endDate=${DONKIEndDate}&api_key=`,
    //---DONKI - Magnetopause Crossing (MPC) for the past 7 days
    ApiDONKIMPC: `https://api.nasa.gov/DONKI/MPC?startDate=${DONKIStartDate}&endDate=${DONKIEndDate}&api_key=`,
    //---DONKI - Radiation Belt Enhancement (RBE) for the past 7 days
    ApiDONKIRBE: `https://api.nasa.gov/DONKI/RBE?startDate=${DONKIStartDate}&endDate=${DONKIEndDate}&api_key=`,
    //---DONKI - Height Speed Stream (HSS) for the past 7 days
    ApiDONKIHSS: `https://api.nasa.gov/DONKI/HSS?startDate=${DONKIStartDate}&endDate=${DONKIEndDate}&api_key=`,
    //---DONKI - WSA+EnlilSimulation for the past 7 days
    ApiDONKIWsaElilSimulation: `https://api.nasa.gov/DONKI/WSAEnlilSimulations?startDate=${DONKIStartDate}&endDate=${DONKIEndDate}&api_key=`,
    //---DONKI - DONKI Notifactions for the past 7 days
    ApiDONKINotifications: `https://api.nasa.gov/DONKI/notifications?startDate=${DONKIStartDate}&endDate=${DONKIEndDate}&api_key=`,
}  

function GetDONKINotifications(ApiKey)
{
    request({url: `${DONKIAPIs.ApiDONKINotifications}${ApiKey}`, json: true}, function(error, response){
            if(error){
                common.ErrorPrintFunc(error);
            }
            else{
                console.log("\n\n====================------------------------------------> DONKI Notifcation API Data for the Past Seven Days>");
                console.log(`Notifications Data Start Time: ${DONKIStartDate}`);
                console.log(`Notifications Data End Time: ${DONKIEndDate}\n`);
                
                const Messages = response.body;
                for(Message in Messages)
                {
                    if(response.body.hasOwnProperty.call(Messages, Message)){
                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!----->>>>>>>>>>>>>>> DONKI NOTIFICATION FOUND <<<<<<<<<<<<<<<-----!!!!!!!!!!!!!!!!!!!!!!!!!")
                        console.log(`\n------------------> Notification Type: ${Messages[Message].messageType}`);
                        console.log(`\n------------------> Notification ID: ${Messages[Message].messageID}`);
                        console.log(`\n------------------> Notification URL: ${Messages[Message].messageURL}`);
                        console.log(`\n------------------> Notification Timestamp: ${Messages[Message].messageIssueTime}\n`);
                        console.log(`--> Notification:\n${Messages[Message].messageBody}`);
                    }
                }
            }
    });
}

function GetDONKICME(ApiKey)
{
    request({url: `${DONKIAPIs.ApiDONKICME}${ApiKey}`, json: true}, function(error, response){
        if(error)
        {
            common.ErrorPrintFunc(error);
        }
        else{
            console.log("\n\n====================-------------------------------------> DONKI Coronal Mass Ejections API Data for the Past Seven Days>\n");
            console.log(`CME Data Start Time: ${DONKIStartDate}`);
            console.log(`CME Data End Time: ${DONKIEndDate}\n`);
            
            const CMEData = response.body;
            for(CMEActivity in CMEData)
            {
                if(response.body.hasOwnProperty.call(CMEData, CMEActivity)){
                    console.log("!!!CME FOUND!!!")
                    console.log(`--- CME Activity ID: ${CMEData[CMEActivity].activityID}`);
                    console.log(`--- CME Submission Time ${CMEData[CMEActivity].submissionTime}`);
                    console.log(`--- CME Link: ${CMEData[CMEActivity].link}`)
                    console.log(`\nNOTE: \n    ${CMEData[CMEActivity].note}\n`)
                    console.log(`----------->\n`)
                }
            }
        }
    });
}

function GetDONKIGST(ApiKey)
{
    request({url: `${DONKIAPIs.ApiDONKIGST}${ApiKey}`, json: true}, function(error, response){
            if(error){
                common.ErrorPrintFunc(error);
            }
            else{
                const GSTData = response.body;
                nCount = 0;
                console.log("\n\n====================--------------------------------> DONKI GeoMagnectic Storm API Data for the Past Seven Days>");
                console.log(`GST Data Start Time: ${DONKIStartDate}`);
                console.log(`GST Data End Time: ${DONKIEndDate}\n`);

                for(GeoMagneticStorm in GSTData){
                    if(GSTData.hasOwnProperty.call(GSTData, GeoMagneticStorm)){
                        console.log("!!!STORM FOUND!!!")
                        console.log(`--- GeoMagnetic Storm ID: ${GSTData[GeoMagneticStorm].gstID}`);
                        console.log(`--- GeoMagnetic Storm Start Time: ${GSTData[GeoMagneticStorm].startTime}`);
                        console.log(`--------------- Link to Event Information: ${GSTData[GeoMagneticStorm].link}`)
                        console.log(`\nEvents Related to the Storm by Event ID:`);
                        const RelatedEvents = GSTData[GeoMagneticStorm].linkedEvents;
                        for(GSTEvent in RelatedEvents)
                        {
                            if(RelatedEvents.hasOwnProperty.call(RelatedEvents, GSTEvent))
                            {
                                console.log(`---- Event ID: ${RelatedEvents[GSTEvent].activityID}`);
                            }
                        }
                        nCount++;
                    }
                }
                console.log(`------------------------------------------- Number of GeoMagnetic Storms in the Past 7 Days: ${nCount}`);
            }
    });
}

function GetDONKICMEAnalysis(ApiKey)
{
    request({url: `${DONKIAPIs.ApiDONKILookup}${ApiKey}`, json: true}, function(error, response){
        if(error)
        {
            common.ErrorPrintFunc(error);
        }
        else{
            console.log("\n\n====================------------------------------> DONKI Coronal Mass Ejections Analysis API Data for the Past Seven Days>");
            console.log(`CME Data Start Time: ${DONKIStartDate}`);
            console.log(`CME Data End Time: ${DONKIEndDate}\n`);

            const CMEData = response.body;
            for(CMEActivity in CMEData)
            {
                //Example Return data: 
                // time21_5: '2025-12-08T04:41Z',
                // latitude: 11,
                // longitude: 11,
                // halfAngle: 34,
                // speed: 767,
                // type: 'C',
                // isMostAccurate: true,
                // associatedCMEID: '2025-12-08T01:38:00-CME-001',
                // associatedCMEstartTime: '2025-12-08T01:38Z',
                // note: 'Measurement based on fit in STEREO A COR2 with visible source location.',
                // associatedCMELink: 'https://webtools.ccmc.gsfc.nasa.gov/DONKI/view/CME/43340/-1',
                // catalog: 'M2M_CATALOG',
                // featureCode: 'LE',
                // dataLevel: '0',
                // measurementTechnique: 'SWPC_CAT',
                // imageType: 'running difference',
                // tilt: null,
                // minorHalfWidth: null,
                // speedMeasuredAtHeight: null,
                // submissionTime: '2025-12-08T14:16Z',
                // versionId: 1,
                // link: 
                if(response.body.hasOwnProperty.call(CMEData, CMEActivity)){
                    console.log("!!!CME ANALYSIS FOUND!!!");
                    console.log(`----- CME ID: ${CMEData[CMEActivity].associatedCMEID}`);
                    console.log(`--- CME TIME: ${CMEData[CMEActivity].time21_5}`);
                    console.log(`--- CME Note: ${CMEData[CMEActivity].note}`);
                    console.log(`--- CME Link: ${CMEData[CMEActivity].associatedCMELink}`);
                    console.log(`--- CME Alt Link: ${CMEData[CMEActivity].link}\n`);
                }
            }
        }
    });
}

function GetIPSData(ApiKey)
{
    //---IPS Data Return entry example
    // catalog: 'M2M_CATALOG',
    // activityID: '2025-10-11T08:42:00-IPS-001',
    // location: 'Earth',
    // eventTime: '2025-10-11T08:42Z',
    // submissionTime: '2025-10-14T18:13Z',
    // versionId: 2,
    // link: 'https://webtools.ccmc.gsfc.nasa.gov/DONKI/view/IPS/41701/-1',
    // instruments: [ [Object], [Object] ],
    // linkedEvents: [ [Object] ],
    // sentNotifications: null
    request({url: `${DONKIAPIs.ApiDONKIIPS}${ApiKey}`, json: true}, (error, response) => {
        if(error)
        {
            common.ErrorPrintFunc(error);
        }
        else{
            IPSBody = response.body;
            
            //Print that data! 
            console.log("\n\n====================------------------------------> DONKI Interplanetary Shock (IPS) API Data for the Past 365 Days>");
            console.log(`DONKI IPS Data Start Date: ${DONKIIPSStartDate}`);
            console.log(`DONKI IPS Data End Date: ${DONKIIPSEndDate}\n`);

            for(IPSEntry in IPSBody)
            {
                if(IPSBody.hasOwnProperty.call(IPSBody, IPSEntry)){
                    console.log(`----- Interplanetary Shock ID: ${IPSBody[IPSEntry].activityID}`);
                    console.log(`--- Interplanetary Shock Catalog: ${IPSBody[IPSEntry].catalog}`);
                    console.log(`--- Interplanetary Shock Location: ${IPSBody[IPSEntry].location}`);
                    console.log(`--- Interplanetary Shock Event Time: ${IPSBody[IPSEntry].eventTime}`);
                    console.log(`--- Interplanetary Shock Time Submitted: ${IPSBody[IPSEntry].submissionTime}`);
                    console.log(`---------------------------------------- Interplanetary Shock Link: ${IPSBody[IPSEntry].link}\n`);
                }
            }
        }
    });
}

function GetSolarFlareData(ApiKey)
{
    request({url: `${DONKIAPIs.ApiDONKIFLR}${ApiKey}`, json: true}, (error, response) => {
        if(error)
        {
            common.ErrorPrintFunc(error);
        }
        else{
            try{
                //-----EXAMPLE Solar Flare Data return
                // flrID: '2025-10-17T18:55:00-FLR-001',
                // catalog: 'M2M_CATALOG',
                // instruments: [ [Object] ],
                // beginTime: '2025-10-17T18:55Z',
                // peakTime: '2025-10-17T19:05Z',
                // endTime: '2025-10-17T19:12Z',
                // classType: 'M1.1',
                // sourceLocation: 'N24W80',
                // activeRegionNum: 14246,
                // note: '',
                // submissionTime: '2025-10-17T20:14Z',
                // versionId: 1,
                // link: 'https://webtools.ccmc.gsfc.nasa.gov/DONKI/view/FLR/41854/-1',
                // linkedEvents: null,
                // sentNotifications: null

                console.log("\n\n====================------------------------------> DONKI Solar Flare (FLR) API Data for the Past 30 Days>");
                console.log(`DONKI FLR Data Start Date: ${DONKIFLRStartDate}`);
                console.log(`DONKI FLR Data End Date: ${DONKIFLREndDate}`);
                if(response.body)
                {
                    const SolarFlareData = response.body;
                    for(SolarFlares in SolarFlareData)
                    {
                        if(SolarFlareData.hasOwnProperty.call(SolarFlareData, SolarFlares)){
                            if(SolarFlareData[SolarFlares].flrID)
                            {
                                console.log(`\n-------------------------> Solar Flare ID: ${SolarFlareData[SolarFlares].flrID}`);
                            }
                            else{
                                console.log('----- NO SOLAR FLARE ID FOUND!!!!');
                            }

                            if(SolarFlareData[SolarFlares].submissionTime)
                            {
                                console.log(`-- Solar Flare Submission Time: ${SolarFlareData[SolarFlares].submissionTime}`);
                            }
                            else{
                                console.log("----- NO SUBMISSION TIME FOUND!!!!!");
                            }

                            if(SolarFlareData[SolarFlares].catalog)
                            {
                                console.log(`--- Solar Flare Catalog: ${SolarFlareData[SolarFlares].catalog}`);
                            }
                            else{
                                console.log('----- NO SOLAR FLARE CATALOG FOUND!!!!');
                            }

                            if(SolarFlareData[SolarFlares].classType)
                            {
                                console.log(`--- Solar Flare Class Type: ${SolarFlareData[SolarFlares].classType}`);
                            }
                            else{
                                console.log('----- NO SOLAR FLARE CLASS TYPE FOUND!!!!');
                            }

                            if(SolarFlareData[SolarFlares].instruments.length > 0)
                            {
                                const SolarFlareInstruments = SolarFlareData[SolarFlares].instruments;
                                for(Instrument in SolarFlareInstruments)
                                {
                                    if(SolarFlareInstruments.hasOwnProperty.call(SolarFlareInstruments, Instrument)){
                                        if(SolarFlareInstruments[Instrument].displayName)
                                        {
                                            console.log(`--- Instrument Associated With the Solar Flare: ${SolarFlareInstruments[Instrument].displayName}`);
                                        }
                                        else{
                                            console.log("----- NO INSTRUMENT NAME FOUND!!!!!");
                                        }
                                    }

                                }
                            }
                            else{
                                console.log('----- NO SOLAR FLARE INSTRUMENTS FOUND!!!!');
                            }

                            if(SolarFlareData[SolarFlares].beginTime)
                            {
                                console.log(`--- Solar Flare Start Time: ${SolarFlareData[SolarFlares].beginTime}`);
                            }
                            else{
                                console.log("----- NO BEGIN TIME FOUND!!!!!");
                            }

                            if(SolarFlareData[SolarFlares].peakTime)
                            {
                                console.log(`--- Solar Flare Peak Time: ${SolarFlareData[SolarFlares].peakTime}`);
                            }
                            else{
                                console.log("----- NO PEAK TIME FOUND!!!!!");
                            }

                            if(SolarFlareData[SolarFlares].endTime)
                            {
                                console.log(`--- Solar Flare End Time: ${SolarFlareData[SolarFlares].endTime}`);
                            }
                            else{
                                console.log("----- NO END TIME FOUND!!!!!");
                            }

                            if(SolarFlareData[SolarFlares].link)
                            {
                                console.log(`---------------------------------------- Solar Flare Link: ${SolarFlareData[SolarFlares].link}`);
                            }else{
                                console.log("----- NO LINK FOUND!!!!!");
                            }
                        }
                    }
                }
                else{
                    console.log("VALID RESPONSE WAS RECIEVED BUT NO DATA WAS RETURNED!!!")
                }

            }catch(error)
            {
                common.ErrorPrintFunc(error);
            }
        }
    });
}


function GetDONKIData(ApiKey)
{
    GetDONKINotifications(ApiKey);
    GetDONKICME(ApiKey);
    GetDONKICMEAnalysis(ApiKey);
    GetDONKIGST(ApiKey);
    GetIPSData(ApiKey);
    //TODO: Up next is the FLR (Solar Flare API)
    GetSolarFlareData(ApiKey);

}

module.exports = {
    GetDONKIDataFunc          : GetDONKIData,
    GetDONKINotificationsFunc : GetDONKINotifications,
    GetDONKICMEFunc           : GetDONKICME,
    GetDONKIGSTFunc           : GetDONKIGST,
    GetDONKIIPSFunc           : GetIPSData,
    GetDONKIFLRFunc           : GetSolarFlareData
}

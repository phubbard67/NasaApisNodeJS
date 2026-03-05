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
const DONKIThirtyDayStartDate = `${DateThirtyDaysAgo.getFullYear()}-${common.GetTwoDigitStringFunc(DateThirtyDaysAgo.getMonth() + 1)}-${common.GetTwoDigitStringFunc(DateThirtyDaysAgo.getDate())}`
const DONKIThirtyDayEndDate = `${CurrentDate.getFullYear()}-${strMonth}-${strDay}`;

//-------Common DONKI Body Errors
const DONKIBodyError = "upstream connect error or disconnect/reset before headers. retried and the latest reset reason: remote connection failure, transport failure reason: delayed connect error: Connection refused";
const DONKIBodyErrorTimeout = "upstream connect error or disconnect/reset before headers. reset reason: connection timeout"

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
    //---DONKI - Solar Flare (FLR) for the past 30 days
    ApiDONKIFLR: `https://api.nasa.gov/DONKI/FLR?startDate=${DONKIThirtyDayStartDate}&endDate=${DONKIThirtyDayEndDate}&api_key=`,
    //---DONKI - Solar Energetic Particles (SEP) for the past 30 days
    ApiDONKISEP: `https://api.nasa.gov/DONKI/SEP?startDate=${DONKIThirtyDayStartDate}&endDate=${DONKIThirtyDayStartDate}&api_key=`,
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
                try{
                    common.PrintHeaderFunc("DONKI Notifcation API Data for the Past Seven Days");
                    console.log(`Notifications Data Start Time: ${DONKIStartDate}`);
                    console.log(`Notifications Data End Time: ${DONKIEndDate}\n`);

                    if (response.body == DONKIBodyError || response.body == DONKIBodyErrorTimeout) {
                        common.ErrorPrintFunc(`DONKI NOTIFICATION BODY ERROR RETURN: ${response.body}`);
                    }
                    else if (Object.keys(response.body).length > 0) 
                    {
                        const Messages = response.body;
                        for(Message in Messages)
                        {
                            if(response.body.hasOwnProperty.call(Messages, Message)){
                                const MessageData = Messages[Message];
    
                                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!--------------------------------------------------->>>>>>>>>>>>>>> DONKI NOTIFICATION FOUND")
                                if (MessageData.messageType) {
                                    console.log(`\n------------------> Notification Type: ${MessageData.messageType}`);
                                }
                                else {
                                    common.PrintNoDataFoundFunc("NOTIFICATION TYPE");
                                }
                                if (MessageData.messageID) {
                                    console.log(`\n------------------> Notification Id: ${MessageData.messageID}`);
                                }
                                else {
                                    common.PrintNoDataFoundFunc("NOTIFICATION ID");
                                }
                                if (MessageData.messageURL) {
                                    console.log(`\n------------------> Notification URL: ${MessageData.messageURL}`);
                                }
                                else {
                                    common.PrintNoDataFoundFunc("NOTIFICATION URL");
                                }
                                if (MessageData.messageIssueTime) {
                                    console.log(`\n------------------> Notification Timestamp: ${MessageData.messageIssueTime}`);
                                }
                                else {
                                    common.PrintNoDataFoundFunc("NOTIFICATION TIMESTAMP");
                                }
                                if (MessageData.messageBody) {
                                    console.log(`--> Notification:\n${MessageData.messageBody}`);
                                }
                                else {
                                    common.PrintNoDataFoundFunc("NOTIFICATION BODY");
                                }
    
                            }
                        }
                    }
                    else{
                        console.log("NO DONKI NOTIFICATION DATA RETURNED")
                    }

                }catch(error){
                    common.ErrorPrintFunc(error);
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
            try{
                common.PrintHeaderFunc("DONKI Coronal Mass Ejections API Data for the Past Seven Days\n");
                console.log(`CME Data Start Time: ${DONKIStartDate}`);
                console.log(`CME Data End Time: ${DONKIEndDate}\n`);
                if (response.body == DONKIBodyError || response.body == DONKIBodyErrorTimeout) {
                    common.ErrorPrintFunc(`CME BODY ERROR RETURN: ${response.body}`);
                }
                else if (Object.keys(response.body).length > 0) 
                {
                    const CMEData = response.body;
                    for (CMEActivity in CMEData) {
                        if (response.body.hasOwnProperty.call(CMEData, CMEActivity)) {
                            console.log("--------------------------------> Coronal Mass Ejection Found");
                            CMEActivityData = CMEData[CMEActivity];

                            if (CMEActivityData.activityID) {
                                console.log(`--- CME Activity ID: ${CMEActivityData.activityID}`);
                            }
                            else {
                                common.PrintNoDataFoundFunc("CME ACTIVITY ID");
                            }

                            if (CMEActivityData.submissionTime) {
                                console.log(`--- CME Submission Time: ${CMEActivityData.submissionTime}`);
                            }
                            else {
                                common.PrintNoDataFoundFunc("CME SUBMISSION TIME");
                            }

                            if (CMEActivityData.link) {
                                console.log(`--- CME Link: ${CMEActivityData.link}`);
                            }
                            else {
                                common.PrintNoDataFoundFunc("CME LINK");
                            }

                            if (CMEActivityData.note) {
                                console.log(`\nNOTE: \n    ${CMEActivityData.note}\n`);
                                console.log(`----------->\n`)
                            }
                            else {
                                common.PrintNoDataFoundFunc("CME NOTE");
                            }
                        }
                    }
                }
                else {
                    console.log("NO DATA RETURNED FOR CME");
                }
            }
            catch(error)
            {
                common.ErrorPrintFunc(error);
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
            else {
                try {
                    if (response.body == DONKIBodyError || response.body == DONKIBodyErrorTimeout) 
                    {
                        common.ErrorPrintFunc(`GST BODY ERROR RETURN: ${response.body}`);
                    }
                    else if (Object.keys(response.body).length > 0) 
                    {
                        const GSTData = response.body;
                        nCount = 0;
                        common.PrintHeaderFunc("DONKI GeoMagnectic Storm API Data for the Past Seven Days");
                        console.log(`GST Data Start Time: ${DONKIStartDate}`);
                        console.log(`GST Data End Time: ${DONKIEndDate}\n`);

                        for (GeoMagneticStorm in GSTData) {
                            if (GSTData.hasOwnProperty.call(GSTData, GeoMagneticStorm)) {
                                console.log("-----------------------> GeoMagnetic Storm Found");
                                GeoStormData = GSTData[GeoMagneticStorm];

                                if (GeoStormData.gstID) {
                                    console.log(`--- GeoMagnetic Storm ID: ${GeoStormData.gstID}`);
                                }
                                else {
                                    common.PrintNoDataFoundFunc(`GEO STORM ID`);
                                }

                                if (GeoStormData.startTime) {
                                    console.log(`--- GeoMagnetic Storm Start Time: ${GeoStormData.startTime}`);
                                }
                                else {
                                    common.PrintNoDataFoundFunc(`GEO STORM START TIME`);
                                }

                                if (GeoStormData.link) {
                                    console.log(`--------------- Link to Event Information: ${GeoStormData.link}`);
                                }
                                else {
                                    common.PrintNoDataFoundFunc(`GEO STORM LINK`);
                                }

                                console.log(`\nEvents Related to the Storm by Event ID:`);
                                const RelatedEvents = GSTData[GeoMagneticStorm].linkedEvents;
                                for (GSTEvent in RelatedEvents) {
                                    if (RelatedEvents.hasOwnProperty.call(RelatedEvents, GSTEvent)) {
                                        if (RelatedEvents[GSTEvent].activityID) {
                                            console.log(`---- Event ID: ${RelatedEvents[GSTEvent].activityID}`);
                                        }
                                        else {
                                            common.PrintNoDataFoundFunc("RELATED GEO STORM EVENT ACTIVITY ID");
                                        }
                                    }
                                }
                                nCount++;
                            }
                        }
                        console.log(`------------------------------------------- Number of GeoMagnetic Storms Returned for the Past 7 Days: ${nCount}`);
                    }
                    else{
                        console.log("\nNO DATA RETURNED FOR GST\n")
                    }

                }
                catch (error) {
                    common.ErrorPrintFunc(error);
                }
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
            try{
                common.PrintHeaderFunc("DONKI Coronal Mass Ejections Analysis API Data for the Past Seven Days");
                console.log(`CME Data Start Time: ${DONKIStartDate}`);
                console.log(`CME Data End Time: ${DONKIEndDate}\n`);
                console.log(response.body)
                if (response.body == DONKIBodyError || response.body == DONKIBodyErrorTimeout) 
                {
                    common.ErrorPrintFunc(`CME ANALYSIS BODY ERROR RETURN: ${response.body}`);
                }
                else if (Object.keys(response.body).length > 0) 
                {
                    const CMEData = response.body;
                    for (CMEActivity in CMEData) {
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
                        if (response.body.hasOwnProperty.call(CMEData, CMEActivity)) {
                            console.log("------------------------------------------------------- CME ANALYSIS FOUND");
                            CMEEntry = CMEData[CMEActivity];

                            if (CMEEntry.associatedCMEID) {
                                console.log(`-------------> CME ID: ${CMEEntry.associatedCMEID}`);
                            }
                            else {
                                common.PrintNoDataFoundFunc("CME ID");
                            }

                            if (CMEEntry.time21_5) {
                                console.log(`--- CME Time: ${CMEEntry.time21_5}`);
                            }
                            else {
                                common.PrintNoDataFoundFunc("CME TIME");
                            }

                            if (CMEEntry.note) {
                                console.log(`--- CME Note:\n\t ${CMEEntry.note}`);
                            }
                            else {
                                common.PrintNoDataFoundFunc("CME NOTE");
                            }

                            if (CMEEntry.associatedCMELink) {
                                console.log(`--- CME ASSOCIATED LINK`);
                                console.log(`-------------------> ${CMEEntry.associatedCMELink}`);
                            }
                            else {
                                common.PrintNoDataFoundFunc("ASSOCIATED LINK");
                            }

                            if (CMEEntry.link) {
                                console.log(`--- CME LINK`);
                                console.log(`-------------------> ${CMEEntry.link}\n`);
                            }
                            else {
                                common.PrintNoDataFoundFunc("CME LINK");
                                console.log("\n\n");
                            }
                        }
                    }
                }
                else{
                    console.log("\nNO INFORMATION WAS RETURED FOR CME\n")
                }
            }
            catch (error) {
                common.ErrorPrintFunc(error);
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

            try {
                IPSBody = response.body;
            
                //Print that data! 
                common.PrintHeaderFunc("DONKI Interplanetary Shock (IPS) API Data for the Past 365 Days");
                console.log(`DONKI IPS Data Start Date: ${DONKIIPSStartDate}`);
                console.log(`DONKI IPS Data End Date: ${DONKIIPSEndDate}\n`);

                if(response.body == DONKIBodyError || response.body == DONKIBodyErrorTimeout)
                {
                    common.ErrorPrintFunc(`IPS BODY ERROR RETURN: ${response.body}`);
                }
                else if(Object.keys(response.body).length > 0)
                {
                    for (IPSEntry in IPSBody) {
                        if (IPSBody.hasOwnProperty.call(IPSBody, IPSEntry)) {
                            const CurrentEntry = IPSBody[IPSEntry];
                            if (CurrentEntry.activityID) {
                                console.log(`----------------------------------> Interplanetary Shock ID: ${CurrentEntry.activityID}`);
                            }
                            else {
                                common.PrintNoDataFoundFunc("NO ACTIVITY ID RETURNED");
                            }
    
                            if (CurrentEntry.catalog) {
                                console.log(`----- Interplanetary Shock Catalog: ${CurrentEntry.catalog}`);
                            }
                            else {
                                common.PrintNoDataFoundFunc("CATALOG INFORMATION");
                            }
    
                            if (CurrentEntry.location) {
                                console.log(`----- Interplanetary Shock Location: ${CurrentEntry.location}`);
                            }
                            else {
                                common.PrintNoDataFoundFunc("LOCATION INFORMATION");
                            }
    
                            if (CurrentEntry.eventTime) {
                                console.log(`----- Interplanetary Shock Event Time: ${CurrentEntry.eventTime}`);
                            }
                            else {
                                common.PrintNoDataFoundFunc("EVENT TIME INFORMATION");
                            }
    
                            if (CurrentEntry.submissionTime) {
                                console.log(`----- Interplanetary Shock Submission Time: ${CurrentEntry.submissionTime}`);
                            }
                            else {
                                common.PrintNoDataFoundFunc("NO SUBMISSION TIME INFORMATION");
                            }
    
                            if (CurrentEntry.link) {
                                console.log(`---------------------------------------- Interplanetary Shock Link: ${CurrentEntry.link}\n`);
                            }
                            else {
                                common.PrintNoDataFoundFunc("LINK INFORMATION");
                            }
                        }
                    } 
                }
            }
            catch(error)
            {
                common.ErrorPrintFunc(error);
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

                common.PrintHeaderFunc("DONKI Solar Flare (FLR) API Data for the Past 30 Days");
                console.log(`DONKI FLR Data Start Date: ${DONKIThirtyDayStartDate}`);
                console.log(`DONKI FLR Data End Date: ${DONKIThirtyDayEndDate}`);
                if(response.body == DONKIBodyError || response.body == DONKIBodyErrorTimeout)
                {
                    common.ErrorPrintFunc(`SOLAR FLARE BODY ERROR RETURN: ${response.body}`);
                }
                else if(response.body)
                {
                    const SolarFlareData = response.body;
                    for(SolarFlares in SolarFlareData)
                    {
                        if(SolarFlareData.hasOwnProperty.call(SolarFlareData, SolarFlares)){
                            if(SolarFlareData[SolarFlares].flrID)
                            {
                                common.PrintSectionIDFunc("Solar Flare", `${SolarFlareData[SolarFlares].flrID}`);
                            }
                            else{
                                common.PrintNoDataFoundFunc("SOLAR FLARE ID");
                            }

                            if(SolarFlareData[SolarFlares].submissionTime)
                            {
                                console.log(`-- Solar Flare Submission Time: ${SolarFlareData[SolarFlares].submissionTime}`);
                            }
                            else{
                                common.PrintNoDataFoundFunc("SUBMISSION TIME");
                            }

                            if(SolarFlareData[SolarFlares].catalog)
                            {
                                console.log(`--- Solar Flare Catalog: ${SolarFlareData[SolarFlares].catalog}`);
                            }
                            else{
                                common.PrintNoDataFoundFunc("SOLAR FLARE CATALOG");
                            }

                            if(SolarFlareData[SolarFlares].classType)
                            {
                                console.log(`--- Solar Flare Class Type: ${SolarFlareData[SolarFlares].classType}`);
                            }
                            else{
                                common.PrintNoDataFoundFunc("SOLAR FLARE CLASS TYPE");
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
                                            common.PrintNoDataFoundFunc("INSTRUMENT NAME");
                                        }
                                    }

                                }
                            }
                            else{
                                common.PrintNoDataFoundFunc("NO SOLAR FLARE INSTRUMENTS");
                            }

                            if(SolarFlareData[SolarFlares].beginTime)
                            {
                                console.log(`--- Solar Flare Start Time: ${SolarFlareData[SolarFlares].beginTime}`);
                            }
                            else{
                                common.PrintNoDataFoundFunc("BEGIN TIME");
                            }

                            if(SolarFlareData[SolarFlares].peakTime)
                            {
                                console.log(`--- Solar Flare Peak Time: ${SolarFlareData[SolarFlares].peakTime}`);
                            }
                            else{
                                common.PrintNoDataFoundFunc("PEAK TIME");
                            }

                            if(SolarFlareData[SolarFlares].endTime)
                            {
                                console.log(`--- Solar Flare End Time: ${SolarFlareData[SolarFlares].endTime}`);
                            }
                            else{
                                common.PrintNoDataFoundFunc("END TIME");
                            }

                            if(SolarFlareData[SolarFlares].link)
                            {
                                common.PrintSectionLinkFunc("Solar Flare", `${SolarFlareData[SolarFlares].link}`);
                            }
                            else{
                                common.PrintNoDataFoundFunc("LINK");
                            }
                        }
                    }
                }
                else{
                    console.log("VALID RESPONSE WAS RECIEVED BUT NO DATA WAS RETURNED!!!");
                }

            }catch(error)
            {
                common.ErrorPrintFunc(error);
            }
        }
    });
}

function GetDONKISEPData(ApiKey)
{
    request({ url: `${DONKIAPIs.ApiDONKISEP}${ApiKey}`, json: true }, (error, response) => {
        if (error) {
            common.ErrorPrintFunc(error);
        }
        else {
            try {
                common.PrintHeaderFunc("DONKI Solar Energetic Particle (SEP) API Data for the Past 30 Days");
                console.log(`DONKI SEP Data Start Date: ${DONKIThirtyDayStartDate}`);
                console.log(`DONKI SEP Data End Date: ${DONKIThirtyDayEndDate}`);

                console.log(response.body)
                if(response.body == DONKIBodyError || response.body == DONKIBodyErrorTimeout)
                {
                    common.ErrorPrintFunc(`SEP BODY ERROR RETURN: ${response.body}`);
                }
                else if (Object.keys(response.body).length > 0) {
                //Example Body Returned
                // ====================------------------------------------------> DONKI Solar Energetic Particle (SEP) API Data for the Past 30 Days
                // DONKI SEP Data Start Date: 2026-01-21
                // DONKI SEP Data End Date: 2026-02-20
                // [
                //   {
                //     sepID: '2026-01-21T03:00:00-SEP-001',
                //     eventTime: '2026-01-21T03:00Z',
                //     instruments: [ [Object] ],
                //     submissionTime: '2026-01-21T03:14Z',
                //     versionId: 1,
                //     link: 'https://webtools.ccmc.gsfc.nasa.gov/DONKI/view/SEP/44107/-1',
                //     linkedEvents: [ [Object], [Object], [Object] ],
                //     sentNotifications: [ [Object], [Object], [Object], [Object] ]
                //   }
                // ]
                    const SEPBody = response.body;

                    for(SEP in SEPBody)
                    {
                        if(SEPBody.hasOwnProperty.call(SEPBody, SEP))
                        {   
                            if(SEPBody[SEP].sepID)
                            {
                                common.PrintSectionIDFunc("Solar Energetic Particle", `${SEPBody[SEP].sepID}`);
                            }
                            else{
                                common.PrintNoDataFoundFunc("SEP ID");
                            }
                            if(SEPBody[SEP].eventTime)
                            {
                                console.log(`--- SEP Event Time: ${SEPBody[SEP].eventTime}`);
                            }
                            else{
                                common.PrintNoDataFoundFunc("SEP EVENT TIME");
                            }
                            if(SEPBody[SEP].submissionTime)
                            {
                                console.log(`--- SEP Submission Time: ${SEPBody[SEP].submissionTime}`);
                            }
                            else{
                                common.PrintNoDataFoundFunc("SEP SUBMISSION TIME");
                            }
                            if(SEPBody[SEP].link)
                            {
                                common.PrintSectionLinkFunc("Solar Energetic Particle", `${SEPBody[SEP].link}`);
                            }
                            else{
                                common.PrintNoDataFoundFunc("SEP SUBMISSION TIME");
                            }
                        }
                    }
                }
                else{
                    console.log("\nVALID RESPONSE WAS RECIEVED BUT NO DATA WAS RETURNED!!!\n");
                }
            }
            catch {
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
    GetSolarFlareData(ApiKey);
    //TODO: Up next is the SEP (Solar Energetic Particle)
    GetDONKISEPData(ApiKey);
    
}

module.exports = {
    GetDONKIDataFunc          : GetDONKIData,
    GetDONKINotificationsFunc : GetDONKINotifications,
    GetDONKICMEFunc           : GetDONKICME,
    GetDONKIGSTFunc           : GetDONKIGST,
    GetDONKIIPSFunc           : GetIPSData,
    GetDONKIFLRFunc           : GetSolarFlareData,
    GetDONKISEPFunc           : GetDONKISEPData
}

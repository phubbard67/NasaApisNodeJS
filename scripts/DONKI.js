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

//---Astroid NeoWs Vars
//Neo Feed Vars
const DateSevenDaysAgo = new Date();
DateSevenDaysAgo.setDate(CurrentDate.getDate() - 7);

nDay = CurrentDate.getDate();
strDay = common.GetTwoDigitStringFunc(nDay);
nMonth = CurrentDate.getMonth() + 1;
strMonth = common.GetTwoDigitStringFunc(nMonth);

nSevenDays = DateSevenDaysAgo.getDate();
strSevenDays = common.GetTwoDigitStringFunc(nSevenDays);
nMonthSevenDaysAgo = DateSevenDaysAgo.getMonth() + 1;
strMonthSevenDaysAgo = common.GetTwoDigitStringFunc(nMonthSevenDaysAgo);

const DONKIEndDate = `${CurrentDate.getFullYear()}-${strMonth}-${strDay}`;
const DONKIStartDate = `${DateSevenDaysAgo.getFullYear()}-${strMonthSevenDaysAgo}-${strSevenDays}`;

const DONKIOptions = {
    //-------------------------------------------------DONKI
    //---DONKI - CME (Coronal Mass Ejection) for the next 7 days. 
    ApiDONKICME:  `https://api.nasa.gov/DONKI/CME?startDate=${DONKIStartDate}&endDate=${DONKIEndDate}&api_key=`,
    //---DONKI - CME (Coronal Mass Ejection) Analysis for the next 7 days
    ApiDONKILookup: `https://api.nasa.gov/DONKI/CMEAnalysis?startDate=${DONKIStartDate}&endDate=${DONKIEndDate}&mostAccurateOnly=true&speed=500&halfAngle=30&catalog=ALL&api_key=`,
    //---DONKI - Browse all NEO data
    ApiDONKIBrowse: `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=`,
    //---DONKI - GeoMagnetic Storms (GST) for the next 7 days
    ApiDONKIGTS: `https://api.nasa.gov/DONKI/GST?startDate=${DONKIStartDate}&endDate=${DONKIEndDate}&api_key=`,
    //---DONKI - Interplanetary Shock (IPS) for the next 7 days
    ApiDONKIIPS: `https://api.nasa.gov/DONKI/IPS?startDate=${DONKIStartDate}&endDate=${DONKIEndDate}&location=LOCATION&catalog=CATALOG&api_key=`,
    //---DONKI - Solar Flare (FLR) for the next 7 days
    ApiDONKIFLR: `https://api.nasa.gov/DONKI/FLR?startDate=${DONKIStartDate}&endDate=${DONKIEndDate}&api_key=`,
    //---DONKI - Solar Energetic Particles (SEP) for the next 7 days
    ApiDONKISEP: `https://api.nasa.gov/DONKI/SEP?startDate=${DONKIStartDate}&endDate=${DONKIEndDate}&api_key=`,
    //---DONKI - Magnetopause Crossing (MPC) for the next 7 days
    ApiDONKIMPC: `https://api.nasa.gov/DONKI/MPC?startDate=${DONKIStartDate}&endDate=${DONKIEndDate}&api_key=`,
    //---DONKI - Radiation Belt Enhancement (RBE) for the next 7 days
    ApiDONKIRBE: `https://api.nasa.gov/DONKI/RBE?startDate=${DONKIStartDate}&endDate=${DONKIEndDate}&api_key=`,
    //---DONKI - Height Speed Stream (HSS) for the next 7 days
    ApiDONKIHSS: `https://api.nasa.gov/DONKI/HSS?startDate=${DONKIStartDate}&endDate=${DONKIEndDate}&api_key=`,
    //---DONKI - WSA+EnlilSimulation for the next 7 days
    ApiDONKIWsaElilSimulation: `https://api.nasa.gov/DONKI/WSAEnlilSimulations?startDate=${DONKIStartDate}&endDate=${DONKIEndDate}&api_key=`,
    //---DONKI - DONKI Notifactions for the next 7 days
    ApiDONKINotifications: `https://api.nasa.gov/DONKI/notifications?startDate=${DONKIStartDate}&endDate=${DONKIEndDate}&api_key=`,
}  

function GetDONKINotifications(ApiKey)
{
    request({url: `${DONKIOptions.ApiDONKINotifications}${ApiKey}`, json: true}, function(error, response){
            if(error){
                console.log("Portland... We have problem");
                console.log(`${error}`);
            }
            else{
                console.log("\n\n====================-------------------------------------DONKI Notifcation API for the past seven days>");
                const Messages = response.body;
                for(Message in Messages)
                {
                    if(response.body.hasOwnProperty.call(Messages, Message)){
                        console.log(`Message Type: ${Messages[Message].messageType}`);
                        console.log(`Message ID: ${Messages[Message].messageID}`);
                        console.log(`Message URL: ${Messages[Message].messageURL}`);
                        console.log(`Message Timestamp: ${Messages[Message].messageIssueTime}\n`);
                        //console.log(`Message Body: ${Messages[Message].messageBody}`);
                    }
                }
            }
    });
}

function GetDONKICME(ApiKey)
{
    request({url: `${DONKIOptions.ApiDONKICME}${ApiKey}`, json: true}, function(error, response){
        if(error)
        {
            console.log("Portland... We have a problem");
            console.log(`${error}`);
        }
        else{
            console.log("\n\n====================-------------------------------------DONKI Coronal Mass Ejections API for the past seven days>");
            const CMEData = response.body;
            for(CMEActivity in CMEData)
            {
                if(response.body.hasOwnProperty.call(CMEData, CMEActivity)){
                    console.log(`---CME Activity ID: ${CMEData[CMEActivity].activityID}`);
                    console.log(`---CME Submission Time ${CMEData[CMEActivity].submissionTime}`);
                    console.log(`---CME NOTE: \n    ${CMEData[CMEActivity].note}\n`)
                }
            }
        }
    });
}


function GetDONKIData(ApiKey)
{
    GetDONKINotifications(ApiKey);
    GetDONKICME(ApiKey);
}

module.exports = {
    GetDONKIDataFunc          : GetDONKIData,
    GetDONKINotificationsFunc : GetDONKINotifications,
    GetDONKICMEFunc           : GetDONKICME
}

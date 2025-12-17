// MIT License

// Copyright (c) 2025 Paul Elliott Hubbard

const express = require('express');
const app = express();
const path = require('path')
port = 3000;

//----------------------------------------------Global Vars
const request = require('request');
const fs = require('fs');
const ini = require('ini');
const common = require('./scripts/commonModule');
const AstroidNeoWs = require('./scripts/AstroidNeoWs');
const DONKI = require('./scripts/DONKI');
const CurrentDate = new Date();
 
//--------------------Main App Functionality 
try{
    console.log("\n\n\n");
    console.log(`<---------===============================---------> THE DATA STARTS HERE <---------=============================---------->`)
    console.log(`\n====Date: \n--------> ${CurrentDate}\n\n\n`);

    ApiKey = "";
    try{
        //Get the API File data:
        // NOTE: If you want to create your own .ini file, just 
        //        create it and call it something like 'my_api_keys.ini' and place it 
        //        one folder location up from the App.js file (../my_api_keys.ini)
        // Then put the following code inside the my_api_keys.ini file to work with this API
        //        after creating your own API key at https://api.nasa.gov. Otherwise, you can remove the 
        //        ini file code and copy your api key directly into the ApiKey var. 
        //Contents of the file my_api_keys.ini:
        //[NASA_API]
        //API_KEY='yourApiKeyGoesBetweenTheseQuotes'
        //----------Comment out or remove if not Using INI file and replace ApiKey with your key value.
        const config = fs.readFileSync("../my_api_keys.ini", "utf-8");
        const ApiDatabase = ini.parse(config)
        //---End Comment our or remove...
    
        ApiKey = ApiDatabase.NASA_API.API_KEY;
        console.log(`API KEY FOUND: ${ApiKey}`);
    }
    catch(error)
    {
        console.log("NO API KEY FOUND: Demo Key used instead (DEMO_KEY). \nPlease set a key in App.js if you want more data pulls above the Demo rate limits.")
        if(ApiKey == "")
        {
            ApiKey = "DEMO_KEY";
        }
    }
    
    //AstriodNeoWs-----
    // FROM api.nasa.gov:
    // "Asteroids - NeoWs
    //     NeoWs (Near Earth Object Web Service) is a RESTful web service for near earth Asteroid information. 
    //     With NeoWs a user can: search for Asteroids based on their closest approach date to Earth, 
    //     lookup a specific Asteroid with its NASA JPL small body id, as well as browse the overall data-set.
    //     Data-set: All the data is from the NASA JPL Asteroid team (http://neo.jpl.nasa.gov/).
    //     This API is maintained by SpaceRocks Team: David Greenfield, Arezu Sarvestani, Jason English and Peter Baunach."
    AstroidNeoWs.GetAsteroidNeoWsDataFunc(ApiKey);

    //DONKI-----
    // FROM api.nasa.gov
    // "DONKI
    //      The Space Weather Database Of Notifications, Knowledge, Information (DONKI) 
    //      is a comprehensive on-line tool for space weather forecasters, scientists, 
    //      and the general space science community. DONKI chronicles the daily interpretations of 
    //      space weather observations, analysis, models, forecasts, and notifications provided by 
    //      the Space Weather Research Center (SWRC), comprehensive knowledge-base search functionality 
    //      to support anomaly resolution and space science research, intelligent linkages, relationships, 
    //      cause-and-effects between space weather activities and comprehensive webservice API access to 
    //      information stored in DONKI."
    DONKI.GetDONKIDataFunc(ApiKey);


}catch(error){
    console.log("Portland... We REALLY have a problem here.\n");
    console.log(error); 
}

///TODO: Started working on a GUI using HTML and a localhost express server
//        Just uncomment and go to http://localhost:3000/ in any browser from the 
//        computer you are running the server / code on to see the page progress. 
// try{
//     app.get('/', (req, res) => {
//         const option = {
//             root: path.join(__dirname)
//         }
//         app.use(express.static('public')); //Let the server know to use static pages, like images and .css files.

//         res.sendFile('./pages/index.html', option, (error) => {
//             if(error){
//                 common.ErrorPrintFunc(error);
//             }
//             else{
//                 console.log("YOU DID IT!!")
//             }
//         });
//         console.log("file sent")
//     });

//     app.listen(3000, (error) => {
//         if(error)
//         {
//             common.ErrorPrintFunc(error);
//         }
//         else{
//             console.log("The server is live at /http://localhost/3000/.");
//         }
//     });

// }catch(error){
//     common.ErrorPrintFunc(error);
// }



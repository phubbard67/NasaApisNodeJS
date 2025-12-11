// MIT License

// Copyright (c) 2025 Paul Elliott Hubbard


//----------------------------------------------Global Vars
const request = require('request');
const fs = require('fs');
const ini = require('ini');
const common = require('./scripts/commonModule');
const AstroidNeoWs = require('./scripts/AstroidNeoWs');
const CurrentDate = new Date();
 
//--------------------Main App Functionality 
try{
    console.log("\n\n\n");
    console.log("====================================The Data Starts HERE==================================\n\n\n")
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
    
    AstroidNeoWs.GetAsteroidNeoDataFunc(ApiKey);

    //TODO: Next up... SPACE WEATHER


}catch(error){
    console.log("Portland... We REALLY have a problem here.\n");
    console.log(error); 
}
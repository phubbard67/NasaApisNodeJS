// MIT License

// Copyright (c) 2025 Paul Elliott Hubbard

//----------------------------------------------Helper Functions
function GetTwoDigitString(nNumberToConver)
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

function ErrorPrint(error){
    console.log("\n         !!!!!!!!---------???? Portland... We have problem ????--------!!!!!!!!\n");
    console.log(error);
}

module.exports = {
    GetTwoDigitStringFunc: GetTwoDigitString,
    ErrorPrintFunc: ErrorPrint
}
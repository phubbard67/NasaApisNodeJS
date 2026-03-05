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

function PrintHeader(strHeader)
{
    console.log(`\n\n====================------------------------------------------> ${strHeader}`);
}

function PrintNoDataFound(dataType)
{
    console.log(`------------> NO ${dataType} RETURED!!!`);
}

function PrintSectionID(sectionName, sectionID)
{
    console.log(`\n-------------------------> ${sectionName} ID: ${sectionID}`);
}

function PrintSectionLink(sectionName, sectionLink)
{
    console.log(`---------------------------------------- ${sectionName} Link: ${sectionLink}`);
}

module.exports = {
    GetTwoDigitStringFunc: GetTwoDigitString,
    ErrorPrintFunc: ErrorPrint,
    PrintHeaderFunc: PrintHeader, 
    PrintNoDataFoundFunc: PrintNoDataFound, 
    PrintSectionIDFunc: PrintSectionID, 
    PrintSectionLinkFunc: PrintSectionLink
}
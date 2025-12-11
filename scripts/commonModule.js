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

module.exports = {
    GetTwoDigitStringFunc: GetTwoDigitString
}
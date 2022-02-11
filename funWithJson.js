const fs = require('fs')
// let buffer = fs.readFileSync('./example.json')//reading the json file
// //console.log(buffer)
// let data=JSON.parse(buffer)//converts the buffer data into json format
// //console.log(data)
// //json file contains array so we can use array methods
// data.push(
//     {
//         "name": "Thro",
//         "last name": "Hello",
//         "Age": 21,
//         "friends": ["Bruce", "Tony", "Peter"],
//         "address":
//         {
//             "city": "Manhattan",
//             "state": "New York"
//         }
//     }
// )
// console.log(data)


//-----------To change data in the json file directly -----------------
const xlsx=require("xlsx")

let data2 = require('./example.json')//require the all json file in data
//then push into the data and then stringfy

data2.push(
    {
        "name": "Thor",
        "last name": "Hello",
        "Age": 21,
        "friends": ["Bruce", "Tony", "Peter"],
        "address":
        {
            "city": "Manhattan",
            "state": "New York"
        }
    }
)
let stringData = JSON.stringify(data2)//data of json ko string mein convert krke write kro
//console.log(stringData)
fs.writeFileSync('./example.json',stringData)

//-----------xlsx npm functions---------
//Add a new workbook
let newWB = xlsx.utils.book_new();
//this will take json and will convert into excel format
let newWS = xlsx.utils.json_to_sheet(data2);
xlsx.utils.book_append_sheet(newWB, newWS, 'Avengers');
xlsx.writeFile(newWB, "abc.xlsx");

//whichexcel file to read
let wb = xlsx.readFile('abc.xlsx');
//pass the sheet name
let excelData = wb.Sheets['Avengers'];
let ans = xlsx.utils.sheet_to_json(excelData);
//conversionfrom sheet to json
console.log(ans);


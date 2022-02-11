const request = require("request");
const cheerio = require("cheerio");
const path = require("path")
const fs = require("fs")
const xlsx=require("xlsx")
//humein iss function ko call krna hai from scorecard function that will provide lin one by one
//so export this function in scorecard.js
function processScoreCard(url) {
  request(url, cb);
}

//scorecard link
//const url = "https://www.espncricinfo.com//series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard"

function cb(error, response, html) {
  if (error) {
    console.log(error);
  } else {
    extractMatchDetails(html);
  }
}


function extractMatchDetails(html) {
  let $ = cheerio.load(html);
  //getting the venue and date
  let descElem = $(".header-info .description");
  // console.log(descElem.text())
  let descElemArr = descElem.text().split(",");
  //console.log(descElemArr)
  let venue = descElemArr[1].trim();
  let date = descElemArr[2];

  //getting the result
  let result = $(
    ".match-info.match-info-MATCH.match-info-MATCH-half-width .status-text"
  ).text();
  //console.log(result)
  // console.log(venue)
  // console.log(date)

  // let opponentTeam = $(".match-info.match-info-MATCH.match-info-MATCH-half-width .team.team-gray  .name")
  // console.log(opponentTeam.text())
  // .match-info.match-info-MATCH.match-info-MATCH-half-width .teams .team .name-detail .name

  //-----html of both the tables----
  //console.log("--------------------------------------")
  let innings = $(".card.content-block.match-scorecard-table .Collapsible");
  let htmlString = "";
  for (let i = 0; i < innings.length; i++) {
    htmlString += $(innings[i]).html();
    //finding the two teams in one single loop
    //h5 element se dono teams milri hai
    let teamName = $(innings[i]).find("h5").text();

    //we need only teamname so split with innings
    teamName = teamName.split("INNINGS")[0];
    //console.log(teamName)

    //we need to find the opponent team in the same loop
    let opponentIndex = i == 0 ? 1 : 0;
    let opponentTeam = $(innings[opponentIndex]).find("h5").text();
    opponentTeam = opponentTeam.split("INNINGS")[0];
    //console.log(opponentTeam)

    //stroing the html of innings of first team ie table of first team
    let cInning = $(innings[i]);
    //first we find all the rows of the table
    let allRows = cInning.find(".table.batsman tbody tr");
    for (let j = 0; j < allRows.length; j++) {
      //now for every row we find columns by finding element td
      let allCols = $(allRows[j]).find("td");
      //now we have to select only worth or rows with meaningful data
      //agar  row ke first coloumn  mein class batsman cell present hai then it has details of the batsman
      let isWorthy = $(allCols[0]).hasClass("batsman-cell");
      if (isWorthy == true) {
        //find all the data of the players
        let playerName = $(allCols[0]).text().trim();
        let runs = $(allCols[2]).text().trim();
        let balls = $(allCols[3]).text().trim();
        let fours = $(allCols[5]).text().trim();
        let sixes = $(allCols[6]).text().trim();
        let STR = $(allCols[7]).text().trim();
        //console.log(` ${playerName} | ${runs} | ${balls} | ${fours} | ${sixes} | ${STR} |`)

        processPlayer(
          playerName,
          teamName,
          runs,
          balls,
          fours,
          sixes,
          STR,
          result,
          venue,
          date
        );
      }
    }
    //console.log("---------------------------------")
  }
  //console.log(htmlString)
}

function processPlayer(
  playerName,
  teamName,
  runs,
  balls,
  fours,
  sixes,
  STR,
  result,
  venue,
  date
) {
  //har team ki file banado inside ipl folder
  let teamPath = path.join(__dirname, "IPL", teamName);
  dirCreator(teamPath);

  //excel sheet for every player
  let filePath = path.join(teamPath,playerName+".xlsx");

    let content = excelReader(filePath, playerName);
    
    let playerObj = {
      playerName,
      teamName,
      runs,
      balls,
      fours,
      sixes,
      STR,
      result,
      venue,
      date
    };
    content.push(playerObj)
    excelWriter(filePath,content,playerName)
}
function dirCreator(filePath) {
  if (fs.existsSync(filePath) == false) {
    //if file dosent already exist
    fs.mkdirSync(filePath);
  }
}

function excelWriter(filePath, jsonData, sheetName)
{
  //Add a new workbook
  let newWB = xlsx.utils.book_new();
  //this will take json and will convert into excel format
  let newWS = xlsx.utils.json_to_sheet(jsonData);
  xlsx.utils.book_append_sheet(newWB, newWS,sheetName);
  xlsx.writeFile(newWB,filePath);
}

function excelReader(filePath, sheetName)
{
  //if file dosent exist
  if ((fs, fs.existsSync(filePath) == false)) {
    return [];
  }
  //whichexcel file to read
  let wb = xlsx.readFile(filePath);
  //pass the sheet name
  let excelData = wb.Sheets[sheetName];
  let ans = xlsx.utils.sheet_to_json(excelData);
  //conversionfrom sheet to json
    return ans;
}

module.exports = {
  ps: processScoreCard,
};

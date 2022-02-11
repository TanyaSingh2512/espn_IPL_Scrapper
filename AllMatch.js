const request = require("request");
const cheerio = require("cheerio");

//importing processScoreCard function
const scorecardObj = require('./scorecard');
function getAllMatchesLink(uri) {
  request(uri, function (error, response, html) {
    if (error) {
      console.log(error);
    } else {
      extractAllMatchesLink(html);
    }
  });
  //this fucntion is used to find links of all scorecards
  function extractAllMatchesLink(uri) {
    let $ = cheerio.load(uri);
    //finding the anchor tag for all the scorecards (60 searches)
    let scoreCardElemArr = $('a[data-hover="Scorecard"]');
    //finding link for all the scorecards
    for (let i = 0; i < scoreCardElemArr.length; i++) {
      let link = $(scoreCardElemArr[i]).attr("href");
      let fullLink = "https://www.espncricinfo.com/" + link;
     // console.log(fullLink);
      scorecardObj.ps(fullLink);
    }
  }
}
//export
module.exports = {
  getAllMatch: getAllMatchesLink
}

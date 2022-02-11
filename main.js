let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595"

const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const path=require('path')

//creating ipl folder in espnscrapper 
// let iplPath = path.join(__dirname, "IPL")
// // console.log(__dirname)
// // console.log(iplPath)
// dirCreator(iplPath)
//import 
const allMatchObj=require('./AllMatch')

request(url, cb)
function cb(error, response, html)
{
    if (error)
    {
        console.log(error)
    }
    else
    {
        extractLink(html)
        }
}
function extractLink(html) {
    let $ = cheerio.load(html)
    //finding the anchor tag
    let anchTag = $('a[data-hover="View All Results"]')
    //half link fromhref of anchor tag
    let link = anchTag.attr('href')
    //console.log(link)
    let fullLink = "https://www.espncricinfo.com/" + link
    //console.log(fullLink)

    allMatchObj.getAllMatch(fullLink)
}
// function dirCreator(filePath)
// {
//     if (fs.existsSync(filePath) == false)//if file dosent already exist
//     {
//         fs.mkdirSync(filePath)
//         }
// }



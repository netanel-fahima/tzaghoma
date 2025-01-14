////
import axios from "axios";
import {useState } from "react";
import {getAppUrl} from "./helper"


var  generalData;


export function getHebDate()
{

    return getCurrentGeneralTimes().HebDate;
}

export function getParasha()
{

    return getCurrentGeneralTimes().Parasha1;
}

export function getSynName()
{

    return getParametesServer().SynName;
}
//מחזירה זמנים לתצוגה לפי סוג יום שבת או חול 
export function getViewTimes(times,dayType,cityCode) {
  //  console.log("********cityCode  "+ cityCode)
    

    let dayTypeTimes  = times?.filter(item=>item.DayType == dayType);
 //console.log("genTimes.Sunset" + genTimes.Sunset);
    let genTimes = getCurrentGeneralTimes(cityCode);
    let res = getCalcTimes(dayTypeTimes, genTimes.Sunset, genTimes.Sunrize);
    return res;
}

export function getCurrentDateStr()
{
    let curDate = new Date();
    let curDateStr = curDate.getDate().toString().padStart(2,'0') + "/" + 
                     (curDate.getMonth() + 1).toString().padStart(2,'0') + "/"  +
                     curDate.getFullYear().toString().padStart(2,'0');
    return curDateStr;

}
/////
function getCurrentGeneralTimes(cityCode) 
{
 
  let curDateStr = getCurrentDateStr()
  let genTimes =  getGeneralTimesForDate(curDateStr,cityCode);

  /*להשלים החלפה ליום הבא אם עבר את השקיעה*/

  return genTimes;  
}
function getParametesServer()
{
   //const [generalData, setGeneralData] = useState([]);
   
   /*axios.get( getAppUrl() +`api/GeneralData/1`)
    .then((res) => { 
   
        generalData = res.data ;
      

    });

*/
    let aa = { "SynName": "בית כנסת הרמבם", "MessageTitle1": "הודעות", "MessageTitle2": "שהשמחה במעונו", "Times": [{ "Desc": "שחרית", "TypeTime": "MINHA", "FixTime": "06:00", "MinutesGap": "", "GapType": "", "DayType": "CHOL" }, 
    { "Desc": "נץ", "TypeTime": "SHACRIT", "FixTime": "", "MinutesGap": "10", "GapType": "PRE_SUNRIZE", "DayType": "CHOL" }, 
    { "Desc": "ערבית", "TypeTime": "ARVIT", "FixTime": "", "MinutesGap": "20", "GapType": "AFTER_SUNSET", "DayType": "CHOL" }, { "Desc": "שחרית א", "TypeTime": "SHACRIT", "FixTime": "07:30", "MinutesGap": "", "GapType": "", "DayType": "SHABAT" }, { "Desc": "שחרית ב", "TypeTime": "SHACRIT", "FixTime": "08:15", "MinutesGap": "", "GapType": "", "DayType": "SHABAT" }, { "Desc": "מנחה", "TypeTime": "MINHA", "FixTime": "15:15", "MinutesGap": "", "GapType": "", "DayType": "SHABAT" }, { "Desc": "ערבית מוצ\"ש", "TypeTime": "ARVIT", "FixTime": "", "MinutesGap": "40", "GapType": "AFTER_SUNSET", "DayType": "SHABAT" }] };
    
    return aa;
}

function getGeneralTimesServer(cityCode)
{
    /*
    const genTimes = localStorage.getItem('generalTimes');
    console.log("gen times " + genTimes.length);
    return genTimes;
*/

   
   // const generalTimes = genTimesData;
   // console.log("********cityCode  "+ cityCode)
    let generalTimes = require('./generalTimesNetivot.json');
    if (cityCode == 1)
    {
        generalTimes = require('./generalTimesNetivot.json'); 
    }
    else if (cityCode == 2)
    {
        generalTimes = require('./generalTimesGedera.json'); 
    }
    else if (cityCode == 3)
    {
        generalTimes = require('./generalTimesKiryatEkron.json'); 
    }

    return  require('./generalTimesNetivot.json');
     
    return generalTimes;
}

//מחזירה את זמני היום לתאריך נבחר
function getGeneralTimesForDate(date,cityCode) { 
   let generalTimes = getGeneralTimesServer(cityCode);
   let currentTimes =null;
//console.log("for date " + date + " " + "length " + generalTimes.length);
   if (generalTimes.length > 0 )
   {
     currentTimes = generalTimes.find(function (item) { return item.Day == date});
   }
    
   return currentTimes;
}

//מחזירה את הזמנים שהוגדו לבית הכנסת
function getSynTimes(dayType,allParams)
{
   // let allParams = getParametesServer();
   // console.log(allParams.Times);
    let dayTypeTimes  = allParams.Times?.filter(item=>item.DayType == dayType);

    //console.log(dayTypeTimes);
    return dayTypeTimes;
}



//מחזירה זמנים מחושבים בהתאם לשקיעה וזריחה
function getCalcTimes(times , sunset, sunrize)
{

   


    let calcTimes = times.map(function (item) {
        let gapTime;
        let localSunSetDate = new Date("2000/01/01 " + sunset);
        let localSunrizeDate = new Date("2000/01/01 " + sunrize);
       
      
      
//console.log("item.MinutesGap"  + " " + item.MinutesGap + " " + item.Desc +  " " + sunset)
        if (item.FixTime != "")
        {
          
            return { Desc : item.Desc, Hour : item.FixTime }; 
        }
        else
        {


            if (item.GapType == "PRE_SUNSET") {
                //console.log("pre localSunSetDate-" + localSunSetDate);
                localSunSetDate.setMinutes(localSunSetDate.getMinutes() + item.MinutesGap * -1 );
                gapTime = localSunSetDate.getHours().toString().padStart(2,'0') + ":" + 
                localSunSetDate.getMinutes().toString().padStart(2,'0')
                
               // console.log("gap-" + item.MinutesGap);
                //console.log("pre change localSunSetDate-" + localSunSetDate);
            }
            if (item.GapType == "AFTER_SUNSET") {
                
                localSunSetDate.setMinutes(localSunSetDate.getMinutes() + item.MinutesGap * 1 );
                gapTime = localSunSetDate.getHours().toString().padStart(2,'0') + ":" + 
                localSunSetDate.getMinutes().toString().padStart(2,'0');

               
            }
            if (item.GapType == "PRE_SUNRIZE") {
                localSunrizeDate.setMinutes(localSunrizeDate.getMinutes() + item.MinutesGap * -1 );
                gapTime = localSunrizeDate.getHours().toString().padStart(2,'0') + ":" + 
                localSunrizeDate.getMinutes().toString().padStart(2,'0')
                
            }
            if (item.GapType == "AFTER_SUNRIZE") {
                localSunrizeDate.setMinutes(localSunrizeDate.getMinutes() + item.MinutesGap * 1 );
                gapTime = localSunrizeDate.getHours().toString().padStart(2,'0') + ":" + 
                localSunrizeDate.getMinutes().toString().padStart(2,'0')
                
            }

            return { Desc : item.Desc, Hour : gapTime }; 
        }

          
    });
  

    return calcTimes;
}


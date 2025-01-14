import { useState } from "react";
//import "./styles.css";

const ZmanHayom = () =>{
  const times = [  {"TimeDesc": "הנץ החמה", "Time": "06:01" },
                   { "TimeDesc": ' סו"ז תפילה מג"א', "Time": "09:12" },
                   { "TimeDesc": 'סו"ז תפילה גר"א', "Time": "09:36" },
                   { "TimeDesc": "שקיעה", "Time": "16:47" },
                   { "TimeDesc": "צאת הכוכבים", "Time": "19:05" }
                    ];

    const listItems = times.map((item)=>
         <h1 >{item.TimeDesc + "  " + item.Time}</h1>
     
    );
       
 return  (
 
  <div>
      <h3 className="AreaTitle"></h3>
      <div className="AreaText">
         {listItems}
      </div>
     </div>
 
 );
}
export default ZmanHayom

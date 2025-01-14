import { useState } from "react";
//import "./styles.css";

const Tora = (props) =>{
  const times = [{ "TimeDesc": "הלכות שבת", "Time": "12:00" }, { "TimeDesc": "גמרא", "Time": "19:30" }
  ];
  
    
    
    const listItems = times.map((item)=>
         <h3 >{item.TimeDesc + "  " + item.Time}</h3>
     
    );
    
 return  (
     <div>
      <h1 className="AreaTitle" >{props.title}</h1>
      <div className="AreaText">
         {listItems}
      </div>
      
     
     </div>
  
 
 );
}
export default Tora

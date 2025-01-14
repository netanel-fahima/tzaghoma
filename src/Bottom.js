import { useState } from "react";


const texts = [{ "Text": "משיב הרוח ומוריד הגשם"},{ "Text": "ותן טל ומטר"}];
 
const Bottom = () =>{
  const listItems = texts.map((item)=>
         <b >{item.Text + ' *** '  }</b>
            
    );
  
 return  (
  <div className="Bottom">
    <div>
    
   
    <div  style={{width:"80%",border:"00px",borderStyle:"dashed"}}>
        <br>
        </br>
    </div>

  </div>
   
  </div>
  
  
 );
}
export default Bottom

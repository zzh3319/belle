import React from 'react'
import { Link } from 'react-router';
import { connect } from 'dva';
const TextContent = (props) => {
  
  let texContent=props.texContent; 

  return (
    <div id="textDescribe">
      
      
          {texContent?texContent.map((value,index)=>{
             return(
               <p key={index}>{value}</p>
              )
          }):""}
     
      
    </div>
  )
}


export default TextContent;
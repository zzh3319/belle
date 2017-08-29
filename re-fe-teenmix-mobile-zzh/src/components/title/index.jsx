import React from 'react'
import { Link } from 'react-router';
import style from './style/title.p.css'
const Title = (props) => {

 let ifShowLine=JSON.parse(props.title&&props.showLine);//"字符串"
 let borderTop=props.borderTop;
 let paddingTop=props.paddingTop;
 let backgroundColor=props.backgroundColor;
 let fontSize=props.fontSize;
  return (
     <div  id="title" className={borderTop+' '+backgroundColor+' '+paddingTop} >
        {

          ifShowLine?<p > 
                <span>/</span>
                <span>
                  <span className={"text"+' '+fontSize}>
                   { props.title} 
                  </span> 
                </span>
                <span>/</span>
            </p> :<p > 
          
                <span>
                  <span className={"text"+' '+fontSize}>
                   { props.title} 
                  </span> 
                </span>
           
            </p>}            
     </div>
  )
}

module.exports = Title;

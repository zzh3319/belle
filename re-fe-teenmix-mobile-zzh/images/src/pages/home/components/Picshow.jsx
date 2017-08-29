import React from 'react'
import { Link } from 'react-router';
const Picshow = (props) => {

  return (
     <div id="picshow">
        {(props.img&&props.link)?
            <Link to={props.link}>
                 <img src={props.img}  alt=""/>
            </Link>:""
        }
     </div>
  )
}

module.exports = Picshow;

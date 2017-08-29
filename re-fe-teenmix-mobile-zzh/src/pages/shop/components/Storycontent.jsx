import React, { Component, PropTypes } from 'react';
import style from '../style/storycontent.css';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import PureRenderMixin from 'react-addons-pure-render-mixin'

class Storycontent extends Component {    
     constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
     }

     loadContent(){
        let text=this.props.text;
          if (text) {
           return (
               <div id="storycontent">
                   <Row className="text-introduce" type="flex" align="top">
                       <Col className="title" lg={5} md={5}>
                            <div className="title-content">
                                <h1>{text.story.title}</h1>
                                <b>{text.story.subtitle}</b>
                            </div>
                       </Col>
                       <Col className="content" lg={16} md={16}>
                           <div className="connect-text">
                               {
                                   text.story.content.map((value,index)=>{
                                       return(<p key={index}>{value}</p>)
                                   })
                               }
                           </div>
                       </Col>
                   </Row>




                   <Row id="center-content" type="flex" align="top">
                      <Col className="title" lg={5} md={5}>
                           <div className="title-content">
                               <h1>{text.cultrue.title}</h1>
                               <b>{text.cultrue.subtitle}</b>
                           </div>
                      </Col>
                       <Col className="content" id="center-pic"  lg={16} md={16}>
                        {
                            text.cultrue.content.map((value,index)=>{
                                return(
                                    <dl className="content-box1" key={index}>
                                        <dt><img src={text.cultrue.content[index].img} alt=""/></dt>
                                        <dd>
                                             {
                                                text.cultrue.content[index].text.map((value,index)=>{
                                                    return (
                                                           <p key={index}>{value}</p>
                                                        )
                                                })
                                             }
                                        </dd>
                                    </dl>
                                    )
                            })
                        }
                       </Col>
                      <Col lg={3} md={3}></Col>
                   </Row>  


                   <Row className="text-introduce text2-box-bg" type="flex" align="top">
                       <Col className="title" lg={5} md={5}>
                            <div className="title-content">
                                <h1>{text.introduction.title}</h1>
                                <b>{text.introduction.subtitle}</b>
                            </div>
                       </Col>
                       <Col className="content" lg={16} md={16}>
                           <div className="connect-text">
                               {
                                   text.introduction.content.map((value,index)=>{
                                       return(<p key={index}>{value}</p>)
                                   })
                               }
                           </div>
                       </Col>
                   </Row>

                 </div>  
                  
                  )
          }
     }

      render() {
    
           return(
                  <div>
                      
                      { this.loadContent()}
                  </div>
            )
             
      }
    
}


Storycontent.propTypes = {
    location: PropTypes.object,
};
export default connect(function (state) {
    return { ...state.brandstory };
})(Storycontent);
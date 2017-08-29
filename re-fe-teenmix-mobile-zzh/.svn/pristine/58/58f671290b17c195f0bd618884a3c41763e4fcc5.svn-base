import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'dva/router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
class Productlist extends Component {
   constructor(props) {
      super(props)
      this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
      this.getImageData = this.getImageData.bind(this);
      this.changeRouteHandle = this.changeRouteHandle.bind(this);
    }
    changeRouteHandle(index){
       let  nav=[
         {
          "name":"潮酷派对",
          "type":"coolParty",
          "index":1
         },
         {
          "name":"商务会议",
          "type":"businessConference",
          "index":2
         },
         {
          "name":"青春校园",
          "type":"youthCampus",
          "index":3
         },
         {
          "name":"街头运动",
          "type":"streetSports",
          "index":4
         },
         {
          "name":"户外休闲",
          "type":"outdoorRecreation",
          "index":5
         },
         {
          "name":"甜蜜约会",
          "type":"sweetDate",
          "index":6
         },
         {
          "name":"时尚男鞋",
          "type":"fashionMenShoes",
          "index":7
         }
       ];
        browserHistory.push("/productCategories/?index="+(nav[index].type));
        /*index+1  因为产品分类的序号是从1开始的*/
    }
    getImageData(){
        if (!this.props.imagesData) {
          return; 
        } 
        let imagesData=this.props.imagesData;
        let productList=imagesData.map((value,index)=>{
           return (
            <div key={index} onClick={()=>{this.changeRouteHandle(index)}} >
              <dl >
                <dt><img src={value.img} alt=""/></dt>
                <dd><p className="text">{value.text}</p></dd>
              </dl>
            </div>
            )
         })
      return productList;
    }
    render() {

    
     return (
        <div id="productList">
          {this.getImageData()}
   
          
          
        </div>
     )
    }
  
                    
                     
                     
                     

}

Productlist.propTypes = {
    location: PropTypes.object,
};

export default Productlist;
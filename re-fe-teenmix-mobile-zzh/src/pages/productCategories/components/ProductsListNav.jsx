import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
// import Slider from 'react-slick'
import { connect } from 'dva';
// import { Carousel } from 'antd-mobile';
import PureRenderMixin from 'react-addons-pure-render-mixin';

class ProductsListNav extends Component {
   constructor(props) {
      super(props)
      this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
      this.changeNavColor=this.changeNavColor.bind(this);
      this.loadNavList=this.loadNavList.bind(this);
    
      this.nav=this.props.navList?this.props.navList:{};
      this.state={
        initNvaIndex:this.props.initNvaIndex||1,
        marginLeft:this.props.initNvaIndex>4?true:false,
      }
  
    }
  
    changeNavColor(index,type){
      this.setState({
         initNvaIndex:index,
      })

      this.props.changeInitCategorieCallBack(type)
    }
     


     loadNavList(){
         let navList=this.nav;
         let navArr=[];
         let copyIndexItem=null;
     

         for(let item in navList){
                if (navList[item].index===this.props.initNvaIndex) {
                    copyIndexItem=Object.assign({},navList[item]);
                     delete navList[item];
                     navList[item]=copyIndexItem;
              }
       }/*重新排序对象内容
        把当前显示的  排在第一个 
       */


         for(let item in navList){
                navArr.unshift(
                   <li  key={navList[item].index}  onClick={()=>{this.changeNavColor(navList[item].index,navList[item].type)}}  type={navList[item].type}><a className={this.state.initNvaIndex==navList[item].index?"click-a":""} href="#">{navList[item].name}</a></li>
                 )
         }
       return navArr;
     }

  
    render() {

  return (
    <div id="ListNav-wrap" className="paddingTop">
         <div className="rightMask"></div>
        <div className='productsListNav' >
           
            <ul className="carousel-panel">
               {this.loadNavList()}
            </ul>
      
        </div>
    </div>

      

  );
    }
  
}

ProductsListNav.propTypes = {
    location: PropTypes.object,
};

export default connect(function (state) {
    return { ...state.productCategories };
})(ProductsListNav);
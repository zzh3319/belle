import React, { Component, PropTypes } from 'react';
import style from './style/header.p.css'
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';

class Header extends Component {
   constructor(props){
      super(props);
     this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
     this.showNavHandle=this.showNavHandle.bind(this);
     this.removeMask=this.removeMask.bind(this);
     this.changeColorHandle=this.changeColorHandle.bind(this);
     this.stop=this.stop.bind(this);
     this.move=this.move.bind(this);
     this.preventDefault=this.preventDefault.bind(this);
     this.loadNavList=this.loadNavList.bind(this);
     this.nav={
       "":{
        "name":"首页",
        "link":"/",
        "index":1
       },

       "productCategories":{
        "name":"产品分类",
        "link":"/productCategories",
        "index":2
       },

       "movieShow":{
        "name":"本期大片",
        "link":"/movieShow",
        "index":3
       },

       "newListing":{
        "name":"新品上市",
        "link":"/newListing",
        "index":4
       },

       "brandStory":{
        "name":"品牌故事",
        "link":"/brandStory",
        "index":5
       },

       "contactUs":{
        "name":"联系我们",
        "link":"/contactUs",
        "index":6
       },
       "Shop":{
        "name":"云店",
        "link":"https://www.baidu.com/",
        "index":7
       }
     }
     let pathname=window.location.pathname.split("/")[1];

     let initLink=this.nav[pathname].index;

      this.state={
        ifClick:false,
        initLink:initLink?initLink:1,/*从url获取pathname 从而判断initLink*/
      }
   }
  preventDefault(e){e.preventDefault();};
   /***禁止滑动***/
  stop(){
           document.body.style.overflow='hidden';        
           document.addEventListener("touchmove",this.preventDefault,false);//禁止页面滑动
   }
   /***取消滑动限制***/
  move(){
           document.body.style.overflow='';//出现滚动条
           document.removeEventListener("touchmove",this.preventDefault,false);        
   }
   changeColorHandle(index){
      this.setState({
       initLink:index,
       ifClick:false,

      })
     this.move();  
   }
   showNavHandle(){
   
     this.move();
     this.setState({
      ifClick:!this.state.ifClick,
     },()=>{
         if (this.state.ifClick) {//由于this.setState是异步的 得回调
            this.stop();
            return ;
         }
           this.move();
     })
     // setTimeout(//由于this.setState是异步的  所以用定时函数
     //   function(){
     //   }.bind(this),0)
   }
   removeMask(){
      this.setState({
        ifClick:false,
      })
      this.move();
      return false;
   }
   loadNavList(){
      let navListDom=[];
      let navData=this.nav;
      for(let navItem in navData){
            if(navItem==="Shop"){//ract-router没有找到跳转外链的方法 所以用a 标签
               navListDom.push(
                 <li key={navData[navItem].index}>
                    <a  href={navData[navItem].link} onClick={()=>{this.changeColorHandle(navData[navItem].index)}} className={this.state.initLink==navData[navItem].index?"change-color":""} >{navData[navItem].name}</a>
                 </li>
               )
            }else{
                navListDom.push(
                  <li key={navData[navItem].index}>
                    <Link  to={navData[navItem].link} onClick={()=>{this.changeColorHandle(navData[navItem].index)}} className={this.state.initLink==navData[navItem].index?"change-color":""} >{navData[navItem].name}</Link>
                  </li>
                )
            }
      }
      return navListDom;
   }
   render() {
       return (
          <div id="header-container">
            <div className="header">
               <span className="toggle" onClick={this.showNavHandle}></span>
            </div>
            {
              this.state.ifClick?<div className="nav-container" onClick={()=>{this.removeMask()}}>
               <ul className="nav">
                 {
                    this.loadNavList()
                 }
               </ul>
            </div>:""
            }
          </div>
       
       );
   }

}

module.exports = Header;

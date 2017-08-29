import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'dva';
import { Carousel } from 'antd-mobile';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import style from './style/picCarousel.p.css';
class Piccarousel extends Component {
   constructor(props) {
      super(props)
      this.stop=this.stop.bind(this);
      this.move=this.move.bind(this);
      this.preventDefault=this.preventDefault.bind(this);
      this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
      this.removeMask=this.removeMask.bind(this);
      this.addImgList=this.addImgList.bind(this);
      this.state={
        ifShowToggle:true,
        initPage:this.props.initShowPic+1
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
    removeMask(){
        this.move();
        this.props.callback();
    }
    componentDidMount() {
      this.stop();
    }
    addImgList(){
      let imagesData=this.props.imagesData;
      if(!imagesData){
           return;
      } 
   
       let imgListDom=imagesData.map((value,index)=>{
      
         return (
            <div className='picShow'  key={index}>
                 <img src={value.img} alt=""/>
            </div>
          )
       })
       return imgListDom;
    }

    render() {
      const settings = {
        dots: false,
        infinite: true,
        speed: 600,
        autoplay:false,
        slidesToShow: 1,
        selectedIndex:this.props.initShowPic||0,//初始化当前页面
        slidesToScroll: 1,
        afterChange:(current)=>{
            this.setState({
               initPage:current+1
            })
        },
        beforeChange:(cur,next)=>{//第一次切换图片的时刻 消失切换按钮
            if (this.state.ifShowToggle) {
                this.setState({
                  ifShowToggle:false,
                })  
            }
        }
      };
      return (
        <div id='pic-carousel' onClick={()=>{this.removeMask()}}>
               <div  className='carousel' >
               <div className="show-Index">
                 <span>{this.state.initPage}</span>/
                 <spn>{this.props.imagesData.length}</spn>
               </div>
               <Carousel   {...settings}>
                     {

                       this.addImgList()
                     }
                
                </Carousel>

                {
                   this.state.ifShowToggle?(<div className="show-toggle">
                        <p className="toggle-btn">
                           <b><img src="/images/otherspic/arrow_l.png" alt=""/></b>
                           <span>左右滑动试试</span>
                           <b><img src="/images/otherspic/arrow_r.png" alt=""/></b>                    
                        </p>
                        <div className="toggle-hand"><img src="/images/otherspic/icon_hand.png" alt=""/>
                        </div>
                     </div>):""
                }
            </div>
        
        </div>

      );
    }
  
                        
}

Piccarousel.propTypes = {
    location: PropTypes.object,
};

module.exports = Piccarousel;

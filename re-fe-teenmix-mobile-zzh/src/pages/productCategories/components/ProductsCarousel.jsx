import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Title from 'src/components/title';
import { connect } from 'dva';
import { Carousel } from 'antd-mobile';
import linkJson from 'static/data/text/link.json';
import PureRenderMixin from 'react-addons-pure-render-mixin';



class ProductsCarousel extends Component {
   constructor(props) {
      super(props)
      this.loadCarousel=this.loadCarousel.bind(this);
      this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
      this.stop=this.stop.bind(this);
      this.move=this.move.bind(this);
      this.preventDefault=this.preventDefault.bind(this);
      this.removeMask=this.removeMask.bind(this);
      this.renderImageLink=this.renderImageLink.bind(this);
      this.loadImgNum=0;
      
      this.state={
        ifShowMaskToggle:true,
        initCategorie:this.props.initCategorie,
        ifImgLoadFinish:false,
        initPage:1,
        selectedIndex:0
      }
    }


    preventDefault(e){e.preventDefault();};
     /***禁止滑动***/
    stop(){
             document.getElementById('productCategories').style.overflow='hidden';        
             document.addEventListener("touchmove",this.preventDefault,false);//禁止页面滑动
     }
     /***取消滑动限制***/
    move(){
             document.getElementById('productCategories').style.overflow='';//出现滚动条
             document.removeEventListener("touchmove",this.preventDefault,false);        
     }
    removeMask(){
        this.move();
         this.setState({
           ifShowMaskToggle:false,
        },()=>{
            if (!this.state.ifShowMaskToggle) {/*解决点透事件  在mask 下面在加了一个mask-dontpass*/
               setTimeout(()=>{
               document.getElementsByClassName('mask-dontpass')[0].style.display="none";
               },420)
            }
        }) 
    }
  /*  componentDidMount() {
       
       // this.stop();
    }*/
    componentWillReceiveProps(){

      this.setState({
        ifImgLoadFinish:false,
        selectedIndex:0,
      })
      this.loadImgNum=0;
      this.carouselDom=[];
    }
    componentWillUnmount(){
      this.move();
    }

    renderImageLink(key,imgSrc,shoesName,shoesLink,bagName,bagLink){
                         
          var children=[];
          var pic=(<img key={key+"img"} className="carousel-pic" src={imgSrc} alt=""/>);

          var shoesBlink=shoesName?(<div key={key+"shoesBlink"} className="blink  box-shadow circle1 "></div>):null ;
          var shoesLine=shoesName?(<div key={key+"shoesLine"} className="line1"><img src="/images/otherspic/line.png" alt=""/><p className="text">{shoesName}</p></div>):null;

          var bagBlink=bagName?(<div key={key+"bagBlink"} className="blink  box-shadow circle2 "></div>):null;
          var bagLine=bagName?(<div key={key+"bagLine"} className="line2"><img src="/images/otherspic/line.png" alt=""/><p className="text">{bagName}</p></div>):null;

          var shoesLink=shoesLink?(<a key={key+"shoesLink"}  className="link1" href={shoesLink}></a>):null;
          var bagLink=bagLink?(<a  key={key+"bagLink"} className="link2" href={bagLink}></a>):null;
       
                       
         this.carouselDom.push(
              <div className="center-img" key={key+"key"}>
                {
                     [pic,shoesBlink,shoesLine,bagBlink,bagLine,shoesLink,bagLink]
                }
              </div>
          )
    }
    loadCarousel(){
         this.carouselDom=[]; 
         let imagesData=this.props.imagesData;
         if (!(imagesData&&linkJson)) {
               return ;
         }
         let initCategorie=this.props.initCategorie;//当前类型
         let currentJsonData=linkJson[initCategorie]; //linkJson 中当前类型的数据
         let currentImageData=imagesData[initCategorie];//当前类型的大图所有图片
         let length=currentImageData.length;
         
          if (this.loadImgNum!==length) {
              for(let i=0;i<length;i++){
                    let imgObj= new Image();
                    let that=this;
              
                    imgObj.onerror=imgObj.onload=function(){//预加载图片
                       that.loadImgNum++;
                       if (that.loadImgNum===length) {
                       
                            that.setState({
                                 ifImgLoadFinish:true,
                            })
                       }
                    }
                    imgObj.src=currentImageData[i];
              }
          }
           

         /*
         */
        
        
           for (let i = 0,length=currentImageData.length; i <length; i++) {
             
                     let shoesName=null;
                     let shoesLink=null;
                     let bagName=null;
                     let bagLink=null; 
          
                 if (currentJsonData&&currentJsonData[1+i]) {
                      let  currentLinkType=currentJsonData[1+i];
                           shoesName=currentLinkType.shoesName;
                           shoesLink=currentLinkType.shoesLink;
                           bagName=currentLinkType.bagName;
                           bagLink=currentLinkType.bagLink;
                 }

                this.renderImageLink(i,currentImageData[i],shoesName,shoesLink,bagName,bagLink);                       
               
           }

              return  this.carouselDom;
    }
   
    render() {
   
         const settings = {
           dots: false,
           infinite: true,
           speed: 700,
           autoplay:false,
           slidesToShow: 1,
           slidesToScroll: 1,
           adaptiveHeight:true,
           arrows:false,
           selectedIndex:this.state.selectedIndex,
           afterChange:(current)=>{
     
                this.setState({
                   initPage:current+1
                })
            },
         
         };

         let  nav=this.props.navList?this.props.navList:{};
         let imagesData=this.props.imagesData;
         let initCategorie=this.props.initCategorie;
       
          return (
            <div className="carousel-container">
                {
                  this.state.ifShowMaskToggle?
                     <div onTouchEnd={()=>{this.removeMask()}} className="carousel-mask">
                        <img  className="hand"  src="/images/otherspic/alert_2.png" alt=""/>
                     </div> 
                  :""
                }
                  <div  className="mask-dontpass">
                  </div> 
                  <Title backgroundColor="titleBck"  showLine="false" title={nav[this.props.initCategorie].name}/>
                <div id='productsCarousel'  >
                    <div className="carousel-wrap">
                       {
                         !this.state.ifImgLoadFinish?
                         <div className='loading'>
                            <img src="/images/otherspic/loading.gif" alt=""/>
                         </div>:""
                       }
                         
                         <Carousel   {...settings}>
                          {
                            this.loadCarousel()
                          }
                         </Carousel>
                    </div>
                </div>
                <div className="count">
                  <span>{this.state.initPage}</span>/
                  <span>{imagesData&&imagesData[initCategorie]?imagesData[initCategorie].length:null}</span>
                </div>
            </div>
          )
    }
  
}

ProductsCarousel.propTypes = {
    location: PropTypes.object,
};

export default connect(function (state) {

    return { ...state.productCategories };
    
})(ProductsCarousel);
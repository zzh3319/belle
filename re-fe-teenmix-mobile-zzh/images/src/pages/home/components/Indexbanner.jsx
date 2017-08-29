import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
// import Slider from 'react-slick'
import { Carousel } from 'antd-mobile';
import PureRenderMixin from 'react-addons-pure-render-mixin';
class Indexbanner extends Component {
   constructor(props) {
      super(props)
      this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  
    }
    // componentDidMount() {
    //   setTimeout(() => {
    //     window.dispatchEvent(new Event('resize'));
    //   }, 0);
    // }/*Carousel初始高度为0bug*/
    render() {
      const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplay:true,
        slidesToShow: 1,
        slidesToScroll: 1,
      };
      return (
        <div>
            <div id='banner' className='paddingTop' span={24}>
                <Carousel  ref={a => this.slider = a } {...settings}>
                  <div className='imgshow'>
                       <Link to="/movieShow">
                          <img src="/images/indexpic/banner/banner01.jpg" alt=""/>
                       </Link>  
                  </div>
                  <div className='imgshow'>
                       <Link to="/movieShow">
                          <img src="/images/indexpic/banner/banner02.jpg" alt=""/>
                       </Link>  
                  </div>
                  <div className='imgshow'>
                       <Link to="/movieShow">
                          <img src="/images/indexpic/banner/banner03.jpg" alt=""/>
                       </Link>  
                  </div>
                  <div className='imgshow'>
                       <Link to="/movieShow">
                          <img src="/images/indexpic/banner/banner04.jpg" alt=""/>
                       </Link>  
                  </div>
                  <div className='imgshow'>
                       <Link to="/movieShow">
                          <img src="/images/indexpic/banner/banner05.jpg" alt=""/>
                       </Link>  
                  </div>
                </Carousel>
            </div>
        </div>

          

      );
    }
  
                    
                     
                     
                     

}

Indexbanner.propTypes = {
    location: PropTypes.object,
};

export default Indexbanner;
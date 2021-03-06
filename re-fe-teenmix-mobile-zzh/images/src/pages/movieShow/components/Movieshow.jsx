import React, { Component, PropTypes } from 'react';
import MainLayout from 'src/layout/MainLayout';
import Title from 'src/components/title';
import { connect } from 'dva';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Piccarousel from 'src/components/picCarousel'

import '../style/movieshow.p.css';



class Movieshow extends Component {	
	  constructor(props){
	  	super(props);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	    this.alertCarousel = this.alertCarousel.bind(this);
	    this.removeChildCarousel = this.removeChildCarousel.bind(this);
	    this.addPiccarousel = this.addPiccarousel.bind(this);
	    this.state={
          ifClick:false,
          initShowPic:1,
	    }
	  }
	 
	  alertCarousel(index){
	  	this.setState({
	  		ifClick:true,
	  		initShowPic:index,
	  	})


	 }
	  removeChildCarousel(){
	  	 this.setState({
	  	 	ifClick:false,
	  	 })
	  }
	  addPiccarousel(){
	  	 if(this.state.ifClick){
             return (
               <Piccarousel imagesData={this.props.imagesData? this.props.imagesData:[]}s initShowPic={this.state.initShowPic}  callback={()=>{this.removeChildCarousel()}} />
            )
	  	 }
	
	  }
	  componentDidMount() {
	           this.node.scrollIntoView();
	      }
	  render() {

	  		return (
	            <div ref={node => this.node = node} id="movieshow">
	  	            <MainLayout>
	  	              <Title paddingTop="paddingTop" borderTop="borderTop" showLine="false" title="本期大片"/>
	  	              <div className="pic-list">
		  	              {
		  	              	 this.props.imagesData?
		  	              	 this.props.imagesData.map((value,index)=>{
		  	              	 	return(
		                           <div key={index} onClick={()=>{this.alertCarousel(index)}}><img src={value.img} alt=""/></div> 
		  	              	 		)
		  	              	 }):""
		  	              }
	  	    
	  	              </div>

	  	              <div>
	  	              {
	  	              	this.addPiccarousel()
	  	              }
	  	              </div>
	  			    </MainLayout>
	  			</div>
	  		)
	  }
	
}


Movieshow.propTypes = {
   location: PropTypes.object,
};



export default connect(function (state) {

    return { ...state.movieshow };

})(Movieshow);

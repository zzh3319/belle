import React, { Component, PropTypes } from 'react';
import MainLayout from 'src/layout/MainLayout';
import Title from 'src/components/title';
import { connect } from 'dva';
import PureRenderMixin from 'react-addons-pure-render-mixin';
// import Piccarousel from './Piccarousel'
import Piccarousel from 'src/components/picCarousel'
import '../style/newListing.p.css';
// import '../style/picCarousel.p.css';


class NewListing extends Component {	
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
               <Piccarousel initShowPic={this.state.initShowPic} imagesData={this.props.imagesData?this.props.imagesData:[]}   callback={()=>{this.removeChildCarousel()}} />
            )
	  	 }
	
	  }
	  componentDidMount() {
	          this.node.scrollIntoView();
	     }
	  render() {

	  		return (
	            <div ref={node => this.node = node} id="newListing">
	  	            <MainLayout>
	  	              <Title paddingTop="paddingTop" borderTop="borderTop" showLine="false" title="新品上市"/>
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


NewListing.propTypes = {
   location: PropTypes.object,
};

export default connect(function (state) {

    return { ...state.newListing };

})(NewListing);

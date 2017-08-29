import React, { Component, PropTypes } from 'react';
import MainLayout from 'src/layout/MainLayout';
import style from '../style/brandstory.css';
import Subbanner from 'src/components/subbanner';
import Storycontent from './Storycontent';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import PureRenderMixin from 'react-addons-pure-render-mixin';

class Brandstory extends Component {	
	  constructor(props){
          super(props)
          this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	  }
	  componentDidMount() {
	    this.node.scrollIntoView();
	  
	  }
	  render() {

	  		return (
	  			<div  ref={node => this.node = node} >
	  	            <MainLayout>
	  	             <Subbanner bannerimg='/images/sunbanner/banner_brand.jpg' background="#E9F5F5" />
                
	  			          <Storycontent/>
	  			      	</MainLayout>
	  			</div>
	  		)
	  }
	
}


Brandstory.propTypes = {
   location: PropTypes.object,
};
export default connect(function (state) {
    return { ...state.brandstory };
})(Brandstory);
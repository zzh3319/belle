import React, { Component, PropTypes } from 'react';
import MainLayout from 'src/layout/MainLayout';
import { connect } from 'dva';
import ProductsListNav from "./ProductsListNav"
import ProductsCarousel from "./ProductsCarousel"
import PureRenderMixin from 'react-addons-pure-render-mixin';

import '../style/productListNav.p.css';
import '../style/productCategories.p.css';
import '../style/productsCarousel.p.css';
import '../style/circle.css';

class ProductCategories extends Component {	
	  constructor(props) {
	  	super(props);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	    this.changeInitCategorieCallBack=this.changeInitCategorieCallBack.bind(this);
	    
	   let haseInitCategorie=window.location.search.split("index=")[1];
	   let  nav=this.props.navList?this.props.navList:{};
	  
	    this.state={
              initCategorie:haseInitCategorie||'coolParty',
              initNvaIndex:haseInitCategorie?nav[haseInitCategorie].index:1
	    };
	  }
      componentDidMount() {
           this.node.scrollIntoView();
      }
	  changeInitCategorieCallBack(type){

	  	
           this.setState({
           	  initCategorie:type,
           })
	  }
	  render() {

	  		return (
	  			<div ref={node => this.node = node} id="productCategories" >
	  	            <MainLayout>
	  	                <ProductsListNav initNvaIndex={this.state.initNvaIndex} changeInitCategorieCallBack={this.changeInitCategorieCallBack}/>
	  	                
	  	                <ProductsCarousel initCategorie={this.state.initCategorie}/>
	  			    </MainLayout>
	  			</div>
	  		)
	  }
	
}


ProductCategories.propTypes = {
   location: PropTypes.object,
};
export default connect(function (state) {
    return { ...state.productCategories };
})(ProductCategories);
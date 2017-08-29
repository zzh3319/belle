import React, { Component, PropTypes } from 'react';
import MainLayout from 'src/layout/MainLayout';
import Title from 'src/components/title';
import { connect } from 'dva';
import TextContent from './TextContent'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import '../style/brandstory.p.css';


class Brandstory extends Component {	
	  constructor(props){
	  	super(props);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	  
	  }
	  componentDidMount() {
	         this.node.scrollIntoView();
	  }

	  render() {
            let texContent=this.props.text;
	  		return (
	            <div ref={node => this.node = node} id="brandstory">
	  	            <MainLayout>
	  	              <Title paddingTop="paddingTop" fontSize="fontSizeForBrandstory" borderTop="borderTop" showLine="false" title="品牌故事"/>
	  	              <div className="title-slogan">
	  	                 {
	  	                 	texContent?
	  	                 	texContent.cultrue.content.map((value,index)=>{
	  	                 		return (
	  	                 			<div key={index} className="slogan-pic">
	  	                 				<img src={value.img} alt="加载中..."/>
	  	                 			</div>
	  	                 		)

	  	                 	}):""
	  	                 }
                        
	  	              </div>
	  	              <TextContent  texContent={texContent?[texContent.story.content[0],texContent.story.content[texContent.story.content.length-1]]:""}/>
                     { <Title  fontSize="fontSizeForBrandstory" showLine="false" title="百丽集团"/> }
                     <TextContent texContent={texContent?texContent.introduction.content:""}/>
	  			    </MainLayout>
	  			</div>
	  		)
	  }
	
}


Brandstory.propTypes = {
   location: PropTypes.object,
};

export default connect(function (state) {
    return { ...state.brandstory};
})(Brandstory);

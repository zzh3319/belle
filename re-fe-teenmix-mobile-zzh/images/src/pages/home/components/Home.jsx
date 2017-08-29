import React, { Component, PropTypes } from 'react';
import MainLayout from 'src/layout/MainLayout';
import { connect } from 'dva';
import { Link } from 'react-router';
import Indexbanner from './Indexbanner'
import Title from 'src/components/title';
import Productlist from './Productlist';
import Picshow from './Picshow';
import Aboutus from './Aboutus';
import '../style/indexbanner.p.css';
import '../style/productList.p.css';
import '../style/picshow.p.css';
import '../style/aboutus.p.css';
import PureRenderMixin from 'react-addons-pure-render-mixin';
class Home extends Component {
    constructor(props){
       super(props);
       this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    componentDidMount() {
             this.node.scrollIntoView();
        }
    render() {
        return (
            <div ref={node => this.node = node} id="home">
                <MainLayout>
                         <Indexbanner/>
                         <Title showLine="true" title="新品分类"/>
                         <Productlist imagesData={this.props.homePicList}/>
                         <Title showLine="true" title="本期大片"/>
                         <Picshow link="/movieShow"  img="/images/indexpic/movieshow/ad_indexdp.jpg" />
                         <Title showLine="true" title="新品上市"/>
                         <Picshow link="/newListing" img="/images/indexpic/newListing/ad_newproduct.jpg" />
                         <Title showLine="true" title="关于我们"/>
                         <Aboutus img1="/images/indexpic/aboutus/index_story.jpg" img2="/images/indexpic/aboutus/index_contact.jpg" link1="/brandStory" link2="/contactUs" />
                </MainLayout>
            </div>
        );
    }
}

Home.propTypes = {
    location: PropTypes.object,
};

export default connect(function (state) {
    return { ...state.home };
})(Home);

import React, { Component } from "react";
import '@styles/IndexAd.less'

export default class IndexAd extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { index_banner_image, index_banner_visible } = this.props.sysConfig;
    console.log(index_banner_image);
    
    return (
      <div className="index-ad">
        <img src={index_banner_image} alt=""/>
      </div>
    )
  }
}
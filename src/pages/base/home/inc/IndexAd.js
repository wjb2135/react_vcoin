import React, { Component } from "react";
import '@styles/IndexAd.less'

export default class IndexAd extends Component {
  render() {
    const { index_banner_image } = this.props.sysConfig;
    
    return (
      <div className="index-ad">
        <img src={index_banner_image} alt=""/>
      </div>
    )
  }
}
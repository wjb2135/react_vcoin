import React, { Component } from 'react'
import IndexHeader from './inc/indexHeader'
import "@styles/header.less";

class Header extends Component {
  componentDidMount() {
    this.getData()
  }
  getData() {
    this.postRequestParam("/api/system/get_config", {
      a: "afaf"
    });
  }
  render() {
    return (
      <div className="header-wrapper">
        <IndexHeader />
      </div>
    );
  }
}

export default Header
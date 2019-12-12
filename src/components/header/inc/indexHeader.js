import React, { Component } from 'react';
import "@/assets/styles/IndexHeader.less";
const Logo = require("@/assets/images/logo.png");

class IndexHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="header-index">
        <div className="main-header">
          <div className="logo">
            <img src={Logo} />
          </div>
          <ul className="nav">
            <li className="uppercase"></li>
          </ul>
        </div>
      </div>
    );
  }
}
export default IndexHeader;
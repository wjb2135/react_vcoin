import React, { Component, propTypes } from 'react'
import PropTypes from 'prop-types'

class tip extends Component {
  constructor(props) {
    super(props)
    this.state = {
      count: props.initCount
    }
  }
  render() {
    const { tipInfo } = this.props
    const listItems = tipInfo.map((item, index) => (
      <li key={index}>
        <span>{item.name}:</span>
        <span>{item.price}</span>
      </li>
    ));
    return <ul>{listItems}</ul>;
  }
}

tip.propTypes = {
  tipInfo: PropTypes.array.isRequired
};

export default tip
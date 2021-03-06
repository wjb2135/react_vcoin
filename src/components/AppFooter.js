import React, { Component } from "react"
import { connect } from "react-redux";
import { Image } from "antd";
import '@styles/AppFooter.less'

class AppFooter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bottomArticles: []
    }
  }
  async getBottomArticles () {
    let res = await this.postRequestParam('/api/system/get_bottom_articles')
    this.setState({
      bottomArticles: res.data
    });
  }
  componentDidMount() {
    this.getBottomArticles()
  }
  render() {
    const { bottomArticles } = this.state
    const { sysConfig } = this.props
    const bottomArticlesItem = bottomArticles.map((item, index) => (
      <li className="list" key={index}>
        <span className="title">{item.classify}</span>
        {/* {
          item.articles.map((i, index) => {
            <div className="list-item" key={index}>
              <a className="link" id="footerApi" href={i.link} target="_blank">{i.name}</a>
            </div>
          })
        } */}
      </li>
    ))

    let buttomCommunityLinksItem
    let buttomContactsItem
    let buttomFriendshipLinksItem
    if (sysConfig) {
      if (sysConfig.buttom_community_links && sysConfig.buttom_community_links.length > 0) {
        buttomCommunityLinksItem = sysConfig.buttom_community_links.map((item, index) => (
          <a href={item.link} title={item.name} className="icon-some-chat" target="_blank" key={index} rel="noopener noreferrer">
            <img src={item.icon} className="icon-community" alt="icon-community" />
          </a>
        ))
      }
      if (sysConfig.buttom_contacts && sysConfig.buttom_contacts.length > 0) {
        buttomContactsItem = sysConfig.buttom_contacts.map((item, index) => (
          <div className="no_link" key={index}>
            {item.caption}：<a href={item.link} target="_blank" rel="noopener noreferrer">{item.value}</a>
          </div>
        ))
      }
      if (sysConfig.buttom_friendship_links && sysConfig.buttom_friendship_links.length > 0) {
        buttomFriendshipLinksItem = sysConfig.buttom_friendship_links.map((item, index) => (
          <a className="text" href={item.link} target="_blank" key={index} rel="noopener noreferrer">{item.name}</a>
        ))
      }
      if (sysConfig.site_logo) {
      }
    }
    return (
      <div id="footerContainer" className="footer-container">
        <div className="footer-main">
          <div className="footer-left">
            <div className="logo">
              <Image width={140} src={sysConfig.site_logo} />
            </div>
            <div className="list">
              <div>
                <span className="icon-down-text down-copy">©2019 OKEX.COM</span>
                <span className="icon-down-text">市场有风险 投资需谨慎</span>
              </div>
            </div>
          </div>
          <div className="footer-right">
            <ul className="footer-ul">
              {bottomArticlesItem}
              <li className="list">
                <span className="title">联系我们</span>
                <div className="icon-list" id="footerMedia">
                  {buttomCommunityLinksItem}
                </div>
                {buttomContactsItem}
              </li>
            </ul>
          </div>
          <div className="clear"></div>
        </div>
        <div className="footer-link">
          <div className="link-line">
            <span className="title">友情链接：</span>
            {buttomFriendshipLinksItem}
          </div>
        </div>
      </div>
    )
  }
}

const stateToProps = (state) => {
  return {
    sysConfig: state.systemConfig
  }
}

export default connect(stateToProps, null)(AppFooter)
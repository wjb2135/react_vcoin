import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Switch } from 'antd';
import { IconFont } from "@js/common";

import '@styles/ucSecurity.less'

export default function UserIdentStatus(props) {
  const { userInfo, systemConfig, onChangeEmailVerifyEnabled, onChangeSmsVerifyEnabled, onChangeGoogleValidator } = props
  return (
    <div className="user-ident-status">
      <div className="nickname item">
        <div className="triangle" className={`triangle ${userInfo.nickname && 'adopt'}`}></div>
        <div className="left">
          <IconFont className="item-icon" type="icon-nicheng" />
          <span>昵称</span>
        </div>
        <div className="right">
          <span className="text">{userInfo.nickname}</span>
          {
            userInfo.nickname && (<span className="status">已设置</span>) || (<Link to="/uc/reset_name" className="not">去设置</Link>)
          }
        </div>
      </div>
      {
        (systemConfig.support_email_verify || userInfo.email_certified) && (
          <div className="mailbox item">
            <div className="triangle" className={`triangle ${userInfo.email_certified && 'adopt'}`}></div>
            <div className="left">
              <IconFont className="item-icon" type="icon-youxiang1" />
              <span>邮箱</span>
            </div>
            <div className="right">
              <span className="text">{userInfo.email || '请绑定账户邮箱'}</span>
              {
                userInfo.email_certified && (<span className="status">已绑定</span>) || (<Link to="/uc/binding_mailbox" className="not">去绑定</Link>)
              }
              {
                userInfo.email_certified && (
                  <span className="switch-box">
                    <label>开启验证</label>
                    <Switch defaultChecked={userInfo.email_verify_enabled} onChange={onChangeEmailVerifyEnabled} />
                  </span>
                )
              }
            </div>
          </div>
        )
      }
      {
        (systemConfig.support_mobile_verify || userInfo.mobile_certified) && (
          <div className="phone item">
            <div className="triangle" className={`triangle ${userInfo.mobile_certified && 'adopt'}`}></div>
            <div className="left">
              <IconFont className="item-icon" type="icon-shouji" />
              <span>手机</span>
            </div>
            <div className="right">
              <span className="text">{userInfo.mobile || '请绑定账户手机'}</span>
              {
                userInfo.mobile_certified && (<span className="status">已绑定</span>) || (<Link to="/uc/binding_phone" className="not">去绑定</Link>)
              }
              {
                userInfo.mobile_certified && (
                  <span className="switch-box">
                    <label>开启验证</label>
                    <Switch defaultChecked={userInfo.sms_verify_enabled} onChange={onChangeSmsVerifyEnabled} />
                  </span>
                )
              }
            </div>
          </div>
        )
      }
      <div className="sign-pw item">
        <div className={`triangle ${userInfo && 'adopt'}`}></div>
        <div className="left">
          <IconFont className="item-icon" type="icon-mima" />
          <span>登录密码</span>
        </div>
        <div className="right">
          <span className="text">登录时使用</span>
          <Link to="/uc/sign_password" className="not">修改</Link>
        </div>
      </div>
      <div className="capital-pw item">
        <div className={`triangle ${userInfo.is_fee_password && 'adopt'}`}></div>
        <div className="left">
          <IconFont className="item-icon" type="icon-zijinmima" />
          <span>资金密码</span>
        </div>
        <div className="right">
          <span className="text">账户资金变动时，需先验证资金密码</span>
          <Link to="/uc/finance_password" className="not">{userInfo.is_fee_password ? ' 修改' : '去设置'}</Link>
        </div>
      </div>
      {
        (userInfo.support_google_verify || userInfo.isset_google_key) && (
          <div className="capital-pw item">
            <div className={`triangle ${userInfo.isset_google_key && 'adopt'}`}></div>
            <div className="left">
              <IconFont className="item-icon" type="icon-zijinmima" />
              <span>谷歌身份验证器</span>
            </div>
            <div className="right">
              <span className="status"></span>
              {
                userInfo.isset_google_key ? (
                  <>
                    <span className="status">已绑定</span>
                    <span className="switch-box">
                      <label>开启验证</label>
                      <Switch defaultChecked={userInfo.google_verify_enabled} onChange={onChangeGoogleValidator} />
                    </span>
                  </>
                ) :
                (
                  <Link to="/uc/binding_google_validator" className="not">去绑定</Link>
                )
              }
            </div>
          </div>
        )
      }
      <div className="capital-pw item">
        <div className={`triangle ${userInfo.is_protection_code && 'adopt'}`}></div>
        <div className="left">
          <IconFont className="item-icon" type="icon-zijinmima" />
          <span>防钓鱼码</span>
        </div>
        <div className="right">
          <Link to="/uc/protection_code" className="not">{userInfo.is_protection_code ? ' 修改' : '去设置'}</Link>
        </div>
      </div>
    </div>
  )
}
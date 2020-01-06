import React, { Component } from 'react';

export default function UserRecord(props) {
  const { baseUserInfo } = props
  const nickname = baseUserInfo && baseUserInfo.nickname.substring(0, 1)
  const securityLevelText = {
    '0': '低',
    '1': '中',
    '2': '高'
  }
  return (
    <div className="user-record">
      <div className="user-photo">
        <div className="photo">{nickname}</div>
        <div className="user-name">
          <div className="name">{baseUserInfo.nickname}</div>
          <div className="id">UID：{baseUserInfo.id}</div>
        </div>
      </div>
      <div className="trade-record">
        <div className="trade-number round">
          <div className="inner">
            <div className="number">{baseUserInfo.trade_count} 次</div>
            <div className="txt">交易次数</div>
          </div>
        </div>
        <div className="release-time round">
          <div className="inner">
            <div className="minute">{baseUserInfo.release_avg_duration || '0.00'} 分钟</div>
            <div className="txt">平均放行</div>
          </div>
        </div>
        <div className="security-grade round">
          <div className="inner">
            <div className="grade">{securityLevelText[baseUserInfo.security_level]}</div>
            <div className="txt">平均放行</div>
          </div>
        </div>
      </div>
      <div className="time">
        <span className="register-time">
          注册时间：{baseUserInfo.created_at}
        </span>
        <span className="trade-time">
          首次交易时间：{baseUserInfo.first_trade_time || '尚未交易'}
        </span>
      </div>
    </div>
  )
}
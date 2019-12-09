import axios from "axios";
import { Component } from "react";
import { message } from 'antd';

let base = "/api";

// 请求前拦截
axios.interceptors.request.use(
  config => {
    // 在发送请求之前做某件事
    if (
      config.method === 'post' ||
      config.method === 'put' ||
      config.method === 'delete'
    ) {
      // 序列化
      config.data = qs.stringify(config.data)
    }

    if (config.params && config.params.needLinkPageLogin !== undefined) {
      needLinkPageLogin = config.params.needLinkPageLogin
    }

    // 若是有做鉴权token , 就给头部带上token
    if (getCookie('_TOKEN')) {
      config.headers.common['X-USER-TOKEN'] = getCookie('_TOKEN')
    }
    config.headers.common['X-LANG'] = localStorage.getItem('lang') || 'zh-cn'
    return config;
  },
  err => {
    console.log("请求超时");
    message.error("请求超时");
    return Promise.reject(err);
  }
);

// 返回后拦截
axios.interceptors.response.use(
  res => {
    // 对响应数据做些事
    if (res.data && res.data.errcode != 0) {
      if (res.data.errcode == 10006) { // 用户未登录或登录状态信息过期
        store.dispatch('setBaseLoginUserInfo', '')
        deleteCookie('_TOKEN')
        if (needLinkPageLogin) {
          router.push({
            path: '/login'
          })
        }
      } else if (res.data.errcode == 10010 || res.data.errcode == 10013) {
        return Promise.reject(res.data)
      } else {
        message.error(res.data.errmsg);
      }
      return Promise.reject(res.data);
    }
    return data;
  },
  err => {
    if (err.response.status === 504 || err.response.status === 404) {
      console.log("服务器被吃了⊙﹏⊙∥");
    } else if (err.response.status === 401) {
      console.log("登录信息失效⊙﹏⊙∥");
    } else if (err.response.status === 500) {
      console.log("服务器开小差了⊙﹏⊙∥");
    }
    return Promise.reject(err);
  }
);

// @RequestBody请求
const postRequestBody = (url, params) => {
  return axios({
    method: "post",
    url: `${base}${url}`,
    data: params,
    headers: {
      "Content-Type": "application/json",
      charset: "utf-8"
    }
  });
};

// @RequsetParam请求
const postRequestParam = (url, params) => {
  return axios({
    method: "post",
    url: `${base}${url}`,
    data: params,
    transformRequest: [
      function (data) {
        let ret = "";
        for (let it in data) {
          ret +=
            encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
        }
        return ret;
      }
    ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

const get = url => {
  return axios({
    method: "get",
    url: `${base}${url}`
  });
};

const multiple = function (requsetArray, callback) {
  axios.all(requsetArray).then(axios.spread(callback));
};

Component.prototype.get = get;
Component.prototype.postRequestBody = postRequestBody;
Component.prototype.postRequestParam = postRequestParam;
Component.prototype.multiple = multiple;
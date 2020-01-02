import React from "react";
import { Carousel, Spin } from "antd";
import '@styles/Banner.less'

export default function Banner(props) {
  const { loadingAd, listAd } = props;
  const listItem = listAd.map(item => (
    <div key={item.id}>
      <img src={item.image} alt={item.text} />
    </div>
  ));
  return (
    <div className="banner">
      {loadingAd ? <Spin /> : <Carousel autoplay>{listItem}</Carousel>}
    </div>
  );
}
import React from "react";
import "@styles/IndexAd.less";
export default function IndexAd(props) {
  const { sysConfig } = props;
  return (
    <div className="index-ad">
      <img src={sysConfig.index_banner_image} alt="" />
    </div>
  );
}

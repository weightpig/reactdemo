import React, { Component } from "react";
import { Breadcrumb } from "antd";
import { connect } from "react-redux";
import { changeStore } from "../store/actions.js";
import "./Crumb.scss";

class Crumb extends Component {
  constructor(props) {
    super(props);
  }
  state = {};

  crumbClick = (idx, url) => {
    this.props.change({
      crumb: this.props.crumb.splice(0, idx + 1)
    });
    this.props.push(url);
  };

  render() {
    const data = this.props.crumbData;
    return (
      <Breadcrumb separator="" className="crumb">
        {data.map((item, idx) => {
          let styleName = idx == 0 ? "first" : "spancenter";
          styleName =
            data.length - 1 == idx ? styleName + " active" : styleName;
          return (
            <Breadcrumb.Item
              className={styleName}
              onClick={() => {
                this.crumbClick(idx, item.url);
              }}
            >
              {item.name}
              <span className="after"></span>
              <span className="before"></span>
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state
  };
};
const mapDispatchToProps = dispatch => {
  return {
    change: parmares => dispatch(changeStore(parmares))
  };
};

// 导出 容器组件
export default connect(mapStateToProps, mapDispatchToProps)(Crumb);

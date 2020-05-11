import { Pagination } from "antd";
import React, { Component } from "react";
import "./PaginationOwn.scss";
export default class PaginationOwn extends Component {
  state = {};
  showTotal = total => {
    return `共 ${total} 项`;
  };

  itemRender = (current, type, originalElement) => {
    if (type === "prev") {
      return <a>{"< 上一页"}</a>;
    }
    if (type === "next") {
      return <a>{"下一页 >"}</a>;
    }
    return originalElement;
  };

  render() {
    const { total, onChange, current, inputValue } = this.props;
    const pageNumMax = Math.ceil(total / 10);
    const currentPage =
      Number(current) > pageNumMax ? pageNumMax : Number(current);
    return (
      <div className="jumpPage">
        <Pagination
          total={total}
          showTotal={this.showTotal}
          itemRender={this.itemRender}
          pageSize="10"
          onChange={onChange}
          current={currentPage}
        />
        <span className="pagesize">
          {total == 0 ? 0 : currentPage}
          <span>{`/${pageNumMax}`}</span>
        </span>
        <span>
          到第
          <input onChange={this.props.inpChange} value={inputValue} />页
        </span>
        <span className="okBtn" onClick={this.props.jump}>
          确定
        </span>
      </div>
    );
  }
}

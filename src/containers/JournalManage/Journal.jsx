import React, { Component } from "react";
import Layout from "../Layout/Layout.jsx";
import Crumb from "../../components/Crumb.jsx";
import { Select, Button, DatePicker, Table } from "antd";
import "./Journal.scss";
import { getlogData, getCreatePersonData } from "../../../common/api.js";
import { dealISLogin } from "../../../common/tools.js";
import { connect } from "react-redux";
import PaginationOwn from "../../components/PaginationOwn.jsx";
const { Option } = Select;

class Journal extends Component {
  constructor(props) {
    super(props);
  }

  columns = [
    {
      title: "时间",
      dataIndex: "Odate",
      key: "Odate"
    },
    {
      title: "账号",
      dataIndex: "Account",
      key: "Account"
    },
    {
      title: "姓名",
      dataIndex: "Lname",
      key: "Lname"
    },
    {
      title: "行为",
      dataIndex: "Behavior",
      key: "Behavior"
    },
    {
      title: "位置",
      dataIndex: "Location",
      key: "Location"
    }
  ];

  state = {
    accountValue: null,
    startTime: "",
    endTime: "",
    startValue: null,
    endValueue: null,
    reSetBtnDisabled: true,
    dataSource: [],
    pages: 0,
    pagination: {
      total: 0
    },
    pageNum: 1,
    pageInp: "",
    accountData: [],
    totalNum: 0
  };

  componentWillMount() {
    dealISLogin(this.props.loginName, this.props.history.push);
    this.getPersonData();
    this.getTableData();
  }
  accountChange = value => {
    this.setState({ accountValue: value });
    this.reSetIsDisabled();
  };

  startTimeChange = (time, timeString) => {
    this.setState({
      startTime: timeString,
      startValue: time
    });
    this.reSetIsDisabled();
  };

  endTimeChange = (time, timeString) => {
    this.setState({
      endTime: timeString,
      endValue: time
    });
    this.reSetIsDisabled();
  };

  disabledStartDate = startValue => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  // 重置按钮灰化判断
  reSetIsDisabled = () => {
    const { accountValue, startTime, endTime } = this.state;
    let flag = false;
    if (!accountValue && !startTime && !endTime) {
      flag = true;
    }
    this.setState({ reSetBtnDisabled: flag });
  };

  reSet = () => {
    this.setState(
      {
        accountValue: null,
        startValue: null,
        endValue: null,
        reSetBtnDisabled: true,
        pages: null,
        startTime: "",
        endTime: "",
        pageNum: 1
      },
      () => {
        this.getTableData();
      }
    );
  };

  getTableData = () => {
    const { accountValue, startTime, endTime, pageNum } = this.state;
    getlogData({
      accountid: accountValue,
      starttime: startTime,
      endtime: endTime,
      size: 10,
      currpage: pageNum
    }).then(res => {
      let dataSource = [];
      let totalNum = 0;
      if (res.status == 200 && res.data.code == "1") {
        dataSource = res.data.data.Data;
        totalNum = res.data.data.TotalNum;
      }
      this.setState({
        dataSource,
        totalNum
      });
    });
  };

  pageChange = page => {
    this.setState(
      {
        pageNum: page
      },
      () => {
        this.getTableData();
      }
    );
  };

  //跳到某页事件
  jump = () => {
    const { pageInp, totalNum } = this.state;
    const pageNumMax = Math.ceil(totalNum / 10);
    const currentPage =
      Number(pageInp) > pageNumMax ? pageNumMax : Number(pageInp);
    this.setState(
      {
        pageNum: currentPage,
        pageInp: ""
      },
      () => {
        this.getTableData();
      }
    );
  };

  inpChange = changeValue => {
    this.setState({
      pageInp: changeValue.target.value
    });
  };

  // 获取用户列表
  getPersonData = () => {
    getCreatePersonData().then(res => {
      if (res.status == 200 && res.data.code == "1") {
        this.setState({
          accountData: res.data.data
        });
      }
    });
  };

  //筛选
  filter = () => {
    this.setState(
      {
        pageNum: 1
      },
      () => {
        this.getTableData();
      }
    );
  };

  render() {
    const {
      pagination,
      dataSource,
      pageNum,
      pageInp,
      accountData,
      startValue,
      endValue,
      totalNum,
      accountValue
    } = this.state;
    return (
      <Layout
        push={this.props.history.push}
        children={
          <div className="journal">
            <Crumb
              crumbData={this.props.crumb}
              push={this.props.history.push}
            />
            <div className="filter">
              <span className="account">账号：</span>
              <Select
                className="accountSelect"
                onChange={this.accountChange}
                placeholder="请选择账号"
                value={accountValue}
              >
                {accountData.map(item => {
                  return <Option value={item.Id}>{item.account}</Option>;
                })}
              </Select>
              <span className="time">操作时段：</span>
              <DatePicker
                className="startTime"
                format="YYYY-MM-DD HH:mm"
                showTime={{ format: "HH:mm" }}
                placeholder="请选择开始日期"
                disabledDate={this.disabledStartDate}
                onChange={this.startTimeChange}
                value={startValue}
              />
              <span className="interval">-</span>
              <DatePicker
                className="endTime"
                format="YYYY-MM-DD HH:mm"
                showTime={{ format: "HH:mm" }}
                placeholder="请选择结束日期"
                disabledDate={this.disabledEndDate}
                onChange={this.endTimeChange}
                value={endValue}
              />
              <Button className="reSetBtn cancelBtnText" onClick={this.reSet}>
                重置
              </Button>
              <Button
                type="primary"
                className="filterBtn"
                onClick={this.filter}
              >
                筛选
              </Button>
            </div>
            <div className="logTable">
              <Table
                dataSource={dataSource}
                columns={this.columns}
                pagination={pagination}
                className="tablelog"
              />
              <PaginationOwn
                total={totalNum}
                onChange={this.pageChange}
                current={pageNum}
                jump={this.jump}
                inpChange={this.inpChange}
                inputValue={pageInp}
              />
            </div>
          </div>
        }
      />
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
    // change: parmares => dispatch(change_name(parmares))
  };
};

// 导出 容器组件
export default connect(mapStateToProps, mapDispatchToProps)(Journal);

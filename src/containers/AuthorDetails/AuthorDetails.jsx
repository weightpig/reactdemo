import React, { Component } from "react";
import Layout from "../Layout/Layout.jsx";
import Crumb from "../../components/Crumb.jsx";
import { Table, Button, Tabs, DatePicker } from "antd";
import "./AuthorDetails.scss";
import { getAuthorDetail, getCodeData } from "../../../common/api.js";
import { dealISLogin, formatDate } from "../../../common/tools.js";
import { changeStore } from "../../store/actions.js";
import { connect } from "react-redux";
import PaginationOwn from "../../components/PaginationOwn.jsx";

const { TabPane } = Tabs;

class AuthorDetails extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    tabKey: 1,
    tableData: [],
    startTime: "",
    startValue: "",
    endTime: "",
    endValue: "",
    pageNum: 1,
    pageInp: "",

    contractno: "",
    authoobject: "",
    authoproduct: "",
    authotype: "",
    authonum: "",
    startat: "",
    overaction: "",
    asofat: "",
    note: "",
    contractname: ""
  };

  columns = [
    {
      title: "激活码",
      dataIndex: "code",
      key: "code"
    },
    {
      title: "使用状态",
      dataIndex: "usingstate",
      key: "usingstate",
      render: usingstate => {
        return usingstate == 0 ? "已使用" : "未使用";
      }
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: status => {
        return status == 0 ? "有效" : "无效";
      }
    },
    {
      title: "激活时间",
      dataIndex: "activationat",
      key: "activationat",
      render: activationat => {
        return formatDate(activationat * 1000);
      }
    },
    {
      title: "机器ID",
      dataIndex: "hashid",
      key: "hashid"
    },
    {
      title: "地理位置",
      dataIndex: "ipadds",
      key: "ipadds"
    },
    {
      title: "操作",
      dataIndex: "id",
      key: "id",
      render: (id, record) => {
        return (
          <div className="operation">
            <span
              className="look"
              onclick={() => {
                this.toCustomerdes(id);
              }}
            >
              详情
            </span>
            <span
              className="look"
              style={
                record.actState == 0
                  ? { color: "red" }
                  : { color: "rgba(59, 159, 255, 1)" }
              }
            >
              {record.actState == 0 ? "停用" : "启用"}
            </span>
          </div>
        );
      }
    }
  ];

  componentWillMount() {
    dealISLogin(this.props.loginName, this.props.history.push);
    this.getTableData();
    this.getAuthorData();
  }

  getAuthorData = () => {
    const {} = this.state;
    getAuthorDetail(this.props.authorId).then(res => {
      if (res.status == 200 && res.data.code == "1") {
        this.setState({ ...res.data.data });
      }
    });
  };

  getTableData = () => {
    const { startTime, endTime } = this.state;
    getCodeData({
      id: this.props.authorId,
      startat: startTime,
      asofat: endTime,
      code: ""
    }).then(res => {
      if (res.status == 200 && res.data.code == "1") {
        this.setState({
          tableData: res.data.data.Data
        });
      }
    });
  };

  cancelClick = () => {
    const crumb = this.props.crumb;
    this.props.change({
      crumb: crumb.splice(0, crumb.length - 1)
    });
    window.history.go(-1);
  };

  editAuthor = () => {
    const crumb = this.props.crumb;

    this.props.change({
      authorPageType: "edit",
      crumb: crumb.concat({
        name: "修改授权",
        url: "/createAuthor"
      })
    });
    this.props.history.push("/createAuthor");
  };

  tabChange = activeKey => {
    this.setState({
      tabKey: activeKey
    });
  };

  startTimeChange = (time, timeString) => {
    this.setState({ startTime: Date.parse(timeString), startValue: time });
    this.reSetIsDisabled();
  };

  endTimeChange = (time, timeString) => {
    this.setState({ endTime: Date.parse(timeString), endValue: time });
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

  reSet = () => {
    this.setState({
      startTime: "",
      endTime: "",
      pages: null
    });
    this.reSetIsDisabled();
    this.getTableData();
  };

  pageChange = page => {
    this.setState({
      pageNum: page
    });
  };

  //跳到某页事件
  jump = () => {
    const { pageInp, dataSource } = this.state;
    this.setState({
      pageNum: pageInp
    });
  };

  inpChange = changeValue => {
    this.setState({
      pageInp: changeValue.target.value
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
      contractno,
      authoobject,
      authoproduct,
      authotype,
      authonum,
      startat,
      overaction,
      asofat,
      note,
      tabKey,
      pagination,
      pageNum,
      pageInp,
      tableData,
      contractname
    } = this.state;
    const operation = ["终身有效", "仅系统提醒", "提醒并取消授权"];
    return (
      <Layout
        push={this.props.history.push}
        children={
          <div className="authorDetails">
            <Crumb
              crumbData={this.props.crumb}
              push={this.props.history.push}
            />
            <div className={tabKey == 1 ? "tab" : "minTab"}>
              <Tabs defaultActiveKey="1" onChange={this.tabChange}>
                <TabPane tab="授权详情" key="1" className="authoeTab">
                  <div>
                    <span className="head">合同编号：</span>
                    <span className="content">
                      {contractno + "|" + contractname}
                    </span>
                  </div>
                  <div>
                    <span className="head">授权对象：</span>
                    <span className="content">{authoobject}</span>
                  </div>
                  <div>
                    <span className="head">授权产品：</span>
                    <span className="content">
                      {authoproduct === 0 ? "V20专业版" : ""}
                    </span>
                  </div>
                  <div>
                    <span className="head">授权类型：</span>
                    <span className="content">
                      {authotype === 0 ? "激活码" : "KMS"}
                    </span>
                  </div>
                  <div>
                    <span className="head">授权数量：</span>
                    <span className="content">{authonum}</span>
                  </div>
                  <div>
                    <span className="head">开始日期：</span>
                    <span className="content">
                      {formatDate(startat * 1000, "y-m-d")}
                    </span>
                  </div>
                  <div>
                    <span className="head">过期操作：</span>
                    <span className="content">{operation[overaction]}</span>
                  </div>
                  <div>
                    <span className="head">截止日期：</span>
                    <span className="content">
                      {formatDate(asofat * 1000, "y-m-d")}
                    </span>
                  </div>
                  <div>
                    <span className="head">备注信息：</span>
                    <span className="content">{!note ? "无" : note}</span>
                  </div>
                  <div className="btns">
                    <Button
                      type="primary"
                      className="cancel"
                      onClick={this.cancelClick}
                    >
                      返回
                    </Button>
                    <Button type="primary" onClick={this.editAuthor}>
                      修改授权
                    </Button>
                  </div>
                </TabPane>
                <TabPane tab="激活码管理" key="2" className="filter">
                  <span className="time">激活时段：</span>
                  <DatePicker
                    placeholder="请选择开始日期"
                    disabledDate={this.disabledStartDate}
                    onChange={this.startTimeChange}
                  />
                  <span className="interval">-</span>
                  <DatePicker
                    placeholder="请选择结束日期"
                    disabledDate={this.disabledEndDate}
                    onChange={this.endTimeChange}
                  />

                  <Button
                    type="primary"
                    className="reSetBtn"
                    onClick={this.reSet}
                  >
                    重置
                  </Button>
                  <Button
                    type="primary"
                    className="filterBtn"
                    onClick={this.filter}
                  >
                    筛选
                  </Button>
                </TabPane>
              </Tabs>
            </div>
            <div className={tabKey == 2 ? "showTable" : "noneTable"}>
              <span className="allNum">总激活数量：{"0 / 0"}</span>
              <Table
                dataSource={tableData}
                columns={this.columns}
                pagination={pagination}
                className="acttable"
              />
              <PaginationOwn
                total={tableData.length}
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
    change: parmares => dispatch(changeStore(parmares))
  };
};

// 导出 容器组件
export default connect(mapStateToProps, mapDispatchToProps)(AuthorDetails);

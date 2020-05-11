import React, { Component } from "react";
import ReactDom from "react-dom";
import { Provider } from "react-redux";
import { HashRouter as Router, Route, Redirect } from "react-router-dom";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";
import Login from "./containers/Login/login.jsx";
import Customer from "./containers/CustomerManage/Customer.jsx";
import Limits from "./containers/LimitsManage/Limits.jsx";
import { createStore } from "redux";
import Reducer from "./store/reducer.js";
import Journal from "./containers/JournalManage/Journal.jsx";
import Person from "./containers/Person/Person.jsx";
import CustomerDetails from "./containers/CustomerDetails/CustomerDetails.jsx";
import CreateAuthor from "./containers/CreateAuthor/CreateAuthor.jsx";
import AuthorDetails from "./containers/AuthorDetails/AuthorDetails.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const myReducer = persistReducer(
      {
        key: "root",
        storage
      },
      Reducer
    );
    const store = createStore(myReducer);
    const persistor = persistStore(store);

    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Router>
            <div className="routerDiv">
              {/* 登录页面 */}
              <Route path="/login" component={Login} />
              {/* 客户管理 */}
              <Route path="/customer" component={Customer} />
              {/* 授权管理 */}
              <Route path="/limits" component={Limits} />
              {/* 操作日志管理页面 */}
              <Route path="/journal" component={Journal} />
              {/* 个人中心 */}
              <Route path="/person" component={Person} />
              {/* 客户详情 */}
              <Route path="/customerDetails" component={CustomerDetails} />
              {/* 新建授权 */}
              <Route path="/createAuthor" component={CreateAuthor} />
              {/* 授权详情 */}
              <Route path="/authorDetails" component={AuthorDetails} />
              {/* 匹配不到跳首页 */}
              <Route path="/*">
                <Redirect
                  to={{
                    pathname: "/login"
                  }}
                />
              </Route>
            </div>
          </Router>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;

ReactDom.render(<App />, document.getElementById("root"));

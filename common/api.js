import axios from "axios";

// const baseURL = "/v1";
const baseURL = "http://10.20.23.136:80/v1";
// const baseURL = "http://10.20.23.29:80/v1";

//开始请求设置，发起拦截处理
// axios.interceptors.request.use(
//   config => {
//     //得到参数中的requestname字段，用于决定下次发起请求，取消相应的  相同字段的请求
//     //post和get请求方式的不同，使用三木运算处理
//     // let requestName =
//     //   config.method === "post"
//     //     ? config.data.requestName
//     //     : config.params.requestName;
//     // //判断，如果这里拿到上一次的requestName，就取消上一次的请求
//     // if (requestName) {
//     //   if (axios[requestName] && axios[requestName].cancel) {
//     //     axios[requestName].cancel();
//     //   }
//     //   config.cancelToken = new CancelToken(c => {
//     //     axios[requestName] = {};
//     //     axios[requestName].cancel = c;
//     //   });
//     // }
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );
// // respone拦截器
// axios.interceptors.response.use(
//   response => {
//     return response;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );

// 登录
export const login = params => {
  return axios.post(baseURL + "/login", params);
};

// 操作日志查询
export const getlogData = params => {
  return axios.get(
    baseURL +
      `/user/operation-log?accountid=${params.accountid}&starttime=${params.starttime}&endtime=${params.endtime}&currpage=${params.currpage}&size=${params.size}`
  );
};

// 退出登录
export const layOutDel = username => {
  return axios.get(`${baseURL}/user/logout?userName=${username}`);
};

// 修改密码
export const editPwd = (userName, params) => {
  return axios.post(baseURL + `/user/edit-pass?userName=${userName}`, params);
};

// 客户管理数据查询
export const getCustomerData = params => {
  return axios.get(
    baseURL + `/user/customer-tube?${params.type}=${params.value}`
  );
};

// 客户详情查询
export const getCustomerDetailsData = params => {
  return axios.post(baseURL + `/user/customer-det`, params);
};

// 新建授权
export const createAuthorPost = (params, type, id) => {
  let url = baseURL + "/user/ct-autho";
  if (type == "edit") {
    url = baseURL + `/user/up-autho?id=${id}`;
  }
  return axios.post(url, params);
};

//授权管理数据查询
export const getAuthorData = params => {
  return axios.post(baseURL + `/user/customer-det`, params);
};

// 授权管理页面创建人数据查询
export const getCreatePersonData = params => {
  return axios.get(baseURL + `/user/get-user`);
};

// 授权详情接口
export const getAuthorDetail = params => {
  return axios.get(baseURL + `/user/autho-det?id=${params}`);
};

// 激活码管理
export const getCodeData = params => {
  return axios.get(
    baseURL +
      `/user/act-management?id=${params.id}&startat=${params.startat}&asofat=${params.asofat}&code=${params.code}`
  );
};

//下载
export const down = params => {
  window.location.href =
    baseURL + `/user/actcode-download?id=${params.id}&type=${params.type}`;
};

//离线激活
export const active = params => {
  return axios.post(baseURL + `/online-act`, params);
};

//启用或停止
export const stopOrOpen = params => {
  return axios.post(baseURL + `/user/actcode-state`, params);
};

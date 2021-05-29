import { apiModel } from "./apiParameters.js";
//order api
let orderApiModel = {
  data: null,
  apiGetRoute: "/api/order/",
  apiPostRoute: "/api/orders",
  apiRoute: "",
  apiGet: function (orderNumber) {
    let parameters = JSON.parse(JSON.stringify(apiModel.requestParameters)); //deep copy
    let method = { method: "GET" };
    this.apiRoute = this.apiGetRoute + orderNumber;
    parameters = Object.assign(parameters, method);
    return fetch(this.apiRoute, parameters)
      .then((response) => {
        return response.text();
      })
      .then((result) => {
        this.data = result;
      });
  },
  apiPost: function (data = {}) {
    let parameters = JSON.parse(JSON.stringify(apiModel.requestParameters)); //deep copy
    let method = { method: "POST" };
    this.apiRoute = this.apiPostRoute;
    parameters = { body: JSON.stringify(data), ...method, ...parameters };
    return fetch(this.apiRoute, parameters)
      .then((response) => {
        return response.text();
      })
      .then((result) => {
        this.data = result;
      });
  },

  parseGetData: function () {
    if (this.data === "") return;
    let parsedData = JSON.parse(this.data);
    let message = null;
    if (parsedData["error"]) {
      message = parsedData["message"];
      console.log("fetch error! apiGet" + message);
      return message;
    }
    message = parsedData;
    console.log("parseGetData");
    console.log(message);
    return message;
  },
  parsePostData: function () {
    if (this.data === "") return;
    let parsedData = JSON.parse(this.data);
    let message = null;
    if (parsedData["error"]) {
      message = parsedData["message"];
      console.log("fetch error! apiPost" + message);
      return message;
    }
    message = parsedData;
    console.log("parsePostData");
    console.log(message);
    return message;
  },
};

let orderApiController = {
  doGet: async function (orderNumber) {
    let response = {};
    let success = false;
    let message = null;
    await orderApiModel.apiGet(orderNumber).then(() => {
      success = true;
      message = orderApiModel.parseGetData();
    });
    response = {
      success: success,
      message: message,
    };
    return response;
  },
  doPost: async function (data = {}) {
    let response = {};
    let success = false;
    let message = null;
    await orderApiModel.apiPost(data).then(() => {
      success = true;
      message = orderApiModel.parsePostData();
    });
    response = {
      success: success,
      message: message,
    };
    return response;
  },
};

export { orderApiController };

import { apiModel } from "./apiParameters.js";
//booking api
let bookingApiModel = {
  data: null,
  apiRoute: "/api/booking",
  apiGet: function () {
    let parameters = JSON.parse(JSON.stringify(apiModel.requestParameters)); //deep copy
    let method = { method: "GET" };
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
    parameters = { body: JSON.stringify(data), ...method, ...parameters };
    return fetch(this.apiRoute, parameters)
      .then((response) => {
        return response.text();
      })
      .then((result) => {
        this.data = result;
      });
  },
  apiDelete: function () {
    let parameters = JSON.parse(JSON.stringify(apiModel.requestParameters)); //deep copy
    let method = { method: "DELETE" };
    parameters = Object.assign(parameters, method);
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
    return message;
  },
  parsePostData: function () {
    if (this.data === "") return;
    let parsedData = JSON.parse(this.data);
    let message = null;
    if (parsedData["ok"]) {
      return message;
    }
    if (parsedData["error"]) {
      message = parsedData["message"];
      console.log("fetch error! apiPost" + message);
      return message;
    }
    message =
      "Oh No! Something went wrong with the server or at the 'doPost' state";
    return message;
  },
  parseDeleteData: function () {
    if (this.data === "") return;
    let parsedData = JSON.parse(this.data);
    let message = null;
    if (parsedData["ok"]) {
      return message;
    }
    if (parsedData["error"]) {
      message = parsedData["message"];
      console.log("fetch error! apiDelete" + message);
      return message;
    }
    message =
      "Oh No! Something went wrong with the server or at the 'doDelete' state";
    return message;
  },
};

let bookingApiController = {
  doGet: async function () {
    let response = {};
    let success = false;
    let message = null;
    await bookingApiModel.apiGet().then(() => {
      success = true;
      message = bookingApiModel.parseGetData();
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
    await bookingApiModel.apiPost(data).then(() => {
      success = true;
      message = bookingApiModel.parsePostData();
    });
    response = {
      success: success,
      message: message,
    };
    return response;
  },
  doDelete: async function () {
    let response = {};
    let success = false;
    let message = null;
    await bookingApiModel.apiDelete().then(function () {
      success = true;
      message = bookingApiModel.parseDeleteData();
    });
    response = {
      success: success,
      message: message,
    };
    return response;
  },
};

export { bookingApiController };

//booking api

let bookingApiModel = {
  data: null,
  parsedData: null,
  apiRoute: "/api/booking",
  requestParameters: {
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "user-agent": "Mozilla/4.0 MDN Example",
      "content-type": "application/json",
    },
    mode: "cors",
    redirect: "follow",
    referrer: "no-referrer",
  },
  apiGet: function () {
    let parameters = { mode: "cors" };
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
    let parameters = JSON.parse(JSON.stringify(this.requestParameters)); //deep copy
    let method = {
      method: "POST",
    };
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
    let parameters = { mode: "cors" };
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
    this.parsedData = JSON.parse(this.data);
  },
  parsePostData: function () {
    if (this.data === "") return;
    this.parsedData = JSON.parse(this.data);
  },
  parseDeleteData: function () {
    if (this.data === "") return;
    this.parsedData = JSON.parse(this.data);
  },
};

let bookingApiController = {
  doGet: async function () {
    let success = false;
    let message = null;
    await bookingApiModel.apiGet().then(() => {
      success = true;
      bookingApiModel.parseGetData();
      let parsedData = bookingApiModel.parsedData;
      if (parsedData["error"]) {
        message = parsedData["message"];
        console.log("fetch error! apiGet" + message);
      } else {
        message = parsedData;
      }
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
      bookingApiModel.parsePostData();
      let parsedData = bookingApiModel.parsedData;
      if (parsedData["ok"]) {
        success = true;
      } else if (parsedData["error"]) {
        message = parsedData["message"];
        console.log("fetch error! apiPost" + message);
      } else {
        message =
          "Oh No! Something went wrong with the server or at the 'doPost' state";
      }
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
      bookingApiModel.parseDeleteData();
      let parsedData = bookingApiModel.parsedData;
      if (parsedData["ok"]) {
        success = true;
      } else if (parsedData["error"]) {
        message = parsedData["message"];
        console.log("fetch error! apiDelete" + message);
      } else {
        message =
          "Oh No! Something went wrong with the server or at the 'doDelete' state";
      }
    });
    response = {
      success: success,
      message: message,
    };
    return response;
  },
};

let apiModel = {
  route_attraction: "/attraction/",
  // route_apiAttraction: "/api/attraction/",
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
};

//index api
let indexApiModel = {
  data: null,
  apiRoute: "/api/attractions?",
  apiGet: function (currentPage = 0, keyword = "") {
    //透過 fetch 從 api 取得資料
    let url = this.apiRoute + "page=" + currentPage;
    if (keyword !== "" && keyword !== undefined) {
      url += "&" + "keyword=" + keyword;
    }
    return fetch(url, {
      mode: "cors",
    })
      .then((response) => {
        return response.text();
      })
      .then((result) => {
        this.data = result;
      });
  },
  parseGetData: function () {
    //Get next page (int or null) and attraction datas (Array: [img, name, MRT, category])
    if (this.data === "") return;
    let jsonData = JSON.parse(this.data);
    let nextPage = jsonData.nextPage;

    let dataList = jsonData.data;
    let attractionsArr = [];

    // Get each data: img(the first url), name, MRT, category, id
    if (dataList === undefined) return [];

    let dataListLen = dataList.length;
    for (let i = 0; i < dataListLen; i++) {
      let data = dataList[i];
      let img = data.images[0];
      let name = data.name;
      let mrt = data.mrt;
      let category = data.category;
      let id = data.id;
      attractionsArr.push([img, name, mrt, category, id]);
    }
    return [nextPage, attractionsArr];
  },
};

let indexApiController = {
  doGet: async function (currentPage = 0, keyword = "") {
    let response = null;
    await indexApiModel.apiGet(currentPage, keyword).then(function () {
      response = indexApiModel.parseGetData();
    });
    return response;
  },
};

//attractoin api
let attApiModel = {
  data: null,
  apiGet: function (url) {
    url = "/api" + url;
    //透過 fetch 從 api 取得資料 /api/attraction/<attractionId>')
    return fetch(url, {
      mode: "cors",
    })
      .then((response) => {
        return response.text();
      })
      .then((result) => {
        this.data = result;
      });
  },
  parseGetData: function () {
    //Get next page (int or null) and attraction datas (Array: [img, name, MRT, category])
    if (this.data === "") return;
    let jsonData = JSON.parse(this.data);
    let data = jsonData.data;
    let attContentArr = [];

    let attractionId = data.id;
    // Get each data: imgList, name, category, mrt, description, address, transport
    let images = data.images === null ? "null" : data.images;
    let name = data.name === null ? "null" : data.name;
    let category = data.category === null ? "null" : data.category;
    let mrt = data.mrt === null ? "null" : data.mrt;
    let description = data.description === null ? "null" : data.description;
    let address = data.address === null ? "null" : data.address;
    let transport = data.transport === null ? "null" : data.transport;

    //images list
    let imgList = [];
    if (images.length !== 0) {
      images.forEach((url) => imgList.push(url));
    }
    attContentArr = [name, category, mrt, description, address, transport];

    return [attractionId, imgList, attContentArr];
  },
};

let attApiController = {
  doGet: async function (url) {
    let response = null;
    await attApiModel.apiGet(url).then(function () {
      response = attApiModel.parseGetData();
    });
    return response;
  },
};

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
      success = true;
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
      success = true;
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

import { apiModel } from "./apiParameters.js";
//index api
let indexApiModel = {
  data: null,
  apiRoute: "",
  api: "/api/attractions?",
  apiGet: function (currentPage = 0, keyword = "") {
    this.apiRoute = this.api + "page=" + currentPage;
    if (keyword !== "" && keyword !== undefined) {
      this.apiRoute += "&" + "keyword=" + keyword;
    }

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

export { indexApiController };

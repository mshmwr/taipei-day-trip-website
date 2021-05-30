import { apiModel } from "./apiParameters.js";
//attraction api
let attApiModel = {
  data: null,
  api: "/api",
  apiRoute: "",
  apiGet: function (url) {
    this.apiRoute = this.api + url;

    let parameters = JSON.parse(JSON.stringify(apiModel.requestParameters)); //deep copy
    let method = { method: "GET" };
    parameters = Object.assign(parameters, method);
    //透過 fetch 從 api 取得資料 /api/attraction/<attractionId>')
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

export { attApiController };

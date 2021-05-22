//api

// let userApiModel = {
//   data: null,
//   parsedData: null,
//   apiRoute: "/api/booking",
//   requestParameters: {
//     cache: "no-cache",
//     credentials: "same-origin",
//     headers: {
//       "user-agent": "Mozilla/4.0 MDN Example",
//       "content-type": "application/json",
//     },
//     mode: "cors",
//     redirect: "follow",
//     referrer: "no-referrer",
//   },
//   apiGet: function () {
//     let parameters = { mode: "cors" };
//     let method = { method: "GET" };
//     parameters = Object.assign(parameters, method);
//     return fetch(this.apiRoute, parameters)
//       .then((response) => {
//         return response.text();
//       })
//       .then((result) => {
//         this.data = result;
//       });
//   },
//   apiPost: function (data = {}) {
//     let parameters = JSON.parse(JSON.stringify(this.requestParameters)); //deep copy
//     let method = {
//       method: "POST",
//     };
//     parameters = { body: JSON.stringify(data), ...method, ...parameters };
//     return fetch(this.apiRoute, parameters)
//       .then((response) => {
//         return response.text();
//       })
//       .then((result) => {
//         this.data = result;
//       });
//   },
//   apiDelete: function () {
//     let parameters = { mode: "cors" };
//     let method = { method: "DELETE" };
//     parameters = Object.assign(parameters, method);
//     return fetch(this.apiRoute, parameters)
//       .then((response) => {
//         return response.text();
//       })
//       .then((result) => {
//         this.data = result;
//       });
//   },

//   parseGetData: function () {
//     //Get user's data
//     if (this.data === "") return;
//     let jsonData = JSON.parse(this.data);
//     let dataDic = jsonData.data;
//     if (dataDic === null) this.parsedData = null;
//     else {
//       this.parsedData = [dataDic.id, dataDic.name, dataDic.email];
//     }
//   },
//   parsePostData: function () {
//     if (this.data === "") return;
//     this.parsedData = JSON.parse(this.data);
//   },
//   parseDeleteData: function () {
//     if (this.data === "") return;
//     this.parsedData = JSON.parse(this.data);
//   },
// };

function init() {
  dialogController.init();
  navController.init();

  navController.checkUserLogin(); //一進入頁面就先確認使用者登入狀態
}

window.onload = function () {
  init();
};

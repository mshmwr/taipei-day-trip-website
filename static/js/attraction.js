// //import js file
// let newscript = document.createElement("script");
// newscript.setAttribute("type", "text/javascript");
// newscript.setAttribute("src", "../static/js/index.js");
// let head = document.getElementsByTagName("head")[0];
// head.appendChild(newscript);

let attModels = {
  data: null,
  parsedData: null,
  getAttractionData: function (url = "", attractionId = 0) {
    //透過 fetch 從 api 取得資料 /api/attraction/<attractionId>')
    if (url === "") return;

    if (attractionId !== 0 && attractionId !== undefined) {
      url += "/" + attractionId;
    }

    console.log("url: " + url);
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
  parseAttractionData: function () {
    //Get next page (int or null) and attraction datas (Array: [img, name, MRT, category])
    if (this.data === "") return;
    console.log("this.data = " + this.data);
    let jsonData = JSON.parse(this.data);
    let data = jsonData.data;
    let attractionsArr = [];

    // Get each data: imgList, name, category, mrt, description, address, transport
    let images = data.images;
    let name = data.name;
    let category = data.category;
    let mrt = data.mrt;
    let description = data.description;
    let address = data.address;
    let transport = data.transport;

    //images list
    let imgList = [];
    if (images.length === 0) {
      images.forEach((url) => imgList.push(url));
    }
    attractionsArr = [
      imgList,
      name,
      category,
      mrt,
      description,
      address,
      transport,
    ];

    this.parsedData = attractionsArr;
  },
};

let attDataController = {
  init: function () {
    let url = "http://127.0.0.1:3000/api/attraction";
    this.getAttraction(url, 100);
  },
  getAttraction: function (url = "", attractionId = 0) {
    attModels.getAttractionData(url, attractionId).then(function () {
      attModels.parseAttractionData();
      attView.fillContent(attModels.parsedData);
    });
  },
};

let attView = {
  fillContent: function (inputList = []) {
    let contentList = inputList.filter((data) => {
      // exclude images
      return typeof data === typeof "";
    });
    if (contentList.length !== attDomList.length) return;
    let len = contentList.length;
    for (let i = 0; i < len; i++) {
      attDomList[i].innerHTML = contentList[i];
    }
  },
};

//DOMs
let profileTitleDOM;
let profileCATDOM;
let profileMRTDOM;
let infosDescriptionDOM;
let infosAddressContentDOM;
let infosTransportContentDOM;
let bookingPriceContentDOM;
let attDomList = null;
window.onload = function () {
  profileTitleDOM = document.getElementById("profile-title");
  profileCATDOM = document.getElementById("profile-CAT");
  profileMRTDOM = document.getElementById("profile-MRT");
  infosDescriptionDOM = document.getElementById("infos-description");
  infosAddressContentDOM = document.getElementById("infos-addressContent");
  infosTransportContentDOM = document.getElementById("infos-transportContent");
  bookingPriceContentDOM = document.getElementById("booking-priceContent");
  attDomList = [
    profileTitleDOM,
    profileCATDOM,
    profileMRTDOM,
    infosDescriptionDOM,
    infosAddressContentDOM,
    infosTransportContentDOM,
  ];
  attDataController.init();

  //check radio input
  let radioList = [];
  let priceList = [2000, 2500];
  if (document.querySelector('input[name="time"]')) {
    document.querySelectorAll('input[name="time"]').forEach((elem) => {
      radioList.push(elem.value);
      elem.addEventListener("change", function (event) {
        let item = event.target.value;
        let price = item === radioList[0] ? priceList[0] : priceList[1];
        bookingPriceContentDOM.innerHTML = price;
      });
    });
  }
};

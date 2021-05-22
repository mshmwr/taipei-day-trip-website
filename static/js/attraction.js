let attModels = {
  data: null,
  parsedData: null,
  attDomList: null,
  profileTitleDOM: null,
  profileCATDOM: null,
  profileMRTDOM: null,
  infosDescriptionDOM: null,
  infosAddressContentDOM: null,
  infosTransportContentDOM: null,
  bookingPriceContentDOM: null,
  bookingButtonDOM: null,
  attractionId: null,

  init: function () {
    this.getDOM();
    this.attDomList = [
      this.profileTitleDOM,
      this.profileCATDOM,
      this.profileMRTDOM,
      this.infosDescriptionDOM,
      this.infosAddressContentDOM,
      this.infosTransportContentDOM,
    ];
  },
  getDOM: function () {
    this.profileTitleDOM = document.getElementById("profile-title");
    this.profileCATDOM = document.getElementById("profile-CAT");
    this.profileMRTDOM = document.getElementById("profile-MRT");
    this.infosDescriptionDOM = document.getElementById("infos-description");
    this.infosAddressContentDOM = document.getElementById(
      "infos-addressContent"
    );
    this.infosTransportContentDOM = document.getElementById(
      "infos-transportContent"
    );
    this.bookingPriceContentDOM = document.getElementById(
      "booking-priceContent"
    );
    this.bookingButtonDOM = document.getElementById("booking-button");
  },
  getAttractionData: function (url) {
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
  parseAttractionData: function () {
    //Get next page (int or null) and attraction datas (Array: [img, name, MRT, category])
    if (this.data === "") return;
    let jsonData = JSON.parse(this.data);
    let data = jsonData.data;
    let attractionsArr = [];

    this.attractionId = data.id;
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

let attController = {
  init: function () {
    attModels.init();
    let thisUrl = window.location.toString();
    let url = thisUrl.replace(route_attraction, api_attraction);
    this.getAttraction(url);
    this.addClickEvent();
  },
  getAttraction: function (url) {
    attModels.getAttractionData(url).then(function () {
      attModels.parseAttractionData();
      attView.fillContent(attModels.parsedData);
      attView.renderImages(attModels.parsedData[0]);
      attView.renderBookingPrice();
      pictureSliderView.setArrowClick();
      pictureSliderView.showSlides();

      navController.checkUserLogin();
    });
  },

  addClickEvent: function () {
    attModels.bookingButtonDOM.addEventListener("click", async () => {
      if (navModel.isUserLogin === false) {
        dialogModel.dialogDOM.style.display = "block";
        dialogModel.dialogMessageDOM.style.display = "none";
      } else {
        //建立景點資訊存到session
        let form = document.getElementById("form_attraction");
        let time = "";
        let dateControl = document.querySelector('input[type="date"]');

        for (let i = 0; i < form.time.length; i++) {
          if (form.time[i].checked) {
            time = form.time[i].value;
            break;
          }
        }
        bookingData = {
          attractionId: attModels.attractionId,
          date: dateControl.value, //"2022-01-31",
          time: time, //"afternoon",
          price: attModels.bookingPriceContentDOM.textContent,
        };
        console.log("bookingData");
        console.log(bookingData);

        let response = await bookingApiController.doPost(bookingData);
        if (response["success"]) {
          document.location.assign("/booking");
        } else {
          console.log(response["message"]);
          alert("勝敗乃兵家常事 大俠請重新來過"); //沒有照正常流程走，有缺資料
        }
      }
    });
  },
};

let attView = {
  fillContent: function (inputList = []) {
    let contentList = inputList.filter((data) => {
      // exclude images
      return typeof data === typeof "";
    });
    if (contentList.length !== attModels.attDomList.length) return;
    let len = contentList.length;
    for (let i = 0; i < len; i++) {
      attModels.attDomList[i].innerHTML = contentList[i];
    }
  },
  renderImages: function (imageUrls = []) {
    //get imageUrls length
    for (let i = 0; i < imageUrls.length; i++) {
      this.renderImage(imageUrls[i], i);
      this.renderDot(i);
    }
    this.addDotsEvent();
  },
  renderImage: function (url = "", index = 0) {
    //get dom: img-slider = imgSliderDOM
    //create div: mySlides fade
    let imgDivElement = document.createElement("div");
    imgDivElement.className = "mySlides fade";

    //create img: src=url
    let imgElement = document.createElement("img");
    imgElement.src = url;

    //appendChild
    imgDivElement.appendChild(imgElement);
    pictureSliderModel.imgSliderDOM.appendChild(imgDivElement);
  },
  renderDot: function (index = 0) {
    //get dom: dotGroup = dotGroupDon
    //create span: dot, onclick
    let dotspanElement = document.createElement("div");
    dotspanElement.className = "dot";

    if (index === 0) {
      dotspanElement.className += " active";
    }

    //appendChild
    pictureSliderModel.dotGroupDOM.appendChild(dotspanElement);
  },
  addDotsEvent: function () {
    let dots = document.getElementsByClassName("dot");
    if (dots.length === 0) return;
    for (let i = dots.length - 1; i >= 0; i--) {
      dots[i].onclick = function () {
        pictureSliderView.currentSlide(i + 1); //編號是從1開始
      };
    }
  },
  renderBookingPrice: function () {
    //check radio input
    let radioList = [];
    let priceList = [2000, 2500];
    if (document.querySelector('input[name="time"]')) {
      document.querySelectorAll('input[name="time"]').forEach((elem) => {
        radioList.push(elem.value);
        elem.addEventListener("change", function (event) {
          let item = event.target.value;
          let price = item === radioList[0] ? priceList[0] : priceList[1];
          attModels.bookingPriceContentDOM.textContent = price;
        });
      });
    }
  },
};

let pictureSliderModel = {
  imgSliderDOM: null, //slider dom
  dotGroupDOM: null, //slider dom
  leftArrowDOM: null,
  rightArrowDOM: null,
  init: function () {
    this.getDOM();
  },
  getDOM: function () {
    this.imgSliderDOM = document.getElementById("img-slider");
    this.dotGroupDOM = document.getElementById("dotGroup");
    this.leftArrowDOM = document.getElementById("leftArrow");
    this.rightArrowDOM = document.getElementById("rightArrow");
  },
};

//picture slider
let pictureSliderView = {
  slideIndex: 1,
  plusSlides: function (n) {
    this.showSlides((this.slideIndex += n));
  },
  currentSlide: function (n) {
    this.showSlides((this.slideIndex = n));
  },
  showSlides: function (n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");

    if (n > slides.length) {
      this.slideIndex = 1;
    }
    if (n < 1) {
      this.slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[this.slideIndex - 1].style.display = "block";
    dots[this.slideIndex - 1].className += " active";
  },
  setArrowClick: function () {
    pictureSliderModel.leftArrowDOM.onclick = () => {
      this.DoPlusSlides(-1);
    };
    pictureSliderModel.rightArrowDOM.onclick = () => {
      this.DoPlusSlides(1);
    };
  },
  DoPlusSlides: function (n) {
    pictureSliderView.plusSlides(n);
  },
};
let pictureSliderController = {
  init: function () {
    pictureSliderModel.init();
  },
};

function init() {
  attController.init();
  pictureSliderController.init();
  dialogController.init();
  navController.init();
}

window.onload = function () {
  init();
};

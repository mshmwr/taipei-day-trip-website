import { changeText } from "./ui/utils.js";
import { bookingApiController } from "./api/bookingApi.js";
import { attApiController } from "./api/attApi.js";
import { dialogController, navController, getData } from "./ui/member.js";

let attModels = {
  data: null,
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
  calenderDOM: null,
  attractionSectionItemDOM: null,
  loadingDOM: null,
  isFirst: true,

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
    this.calenderDOM = document.querySelector('input[type="date"]');
    this.attractionSectionItemDOM = document.getElementById(
      "attractionSectionItem"
    );
    this.loadingDOM = document.getElementById("loading");
  },
};

let attController = {
  init: function () {
    attModels.init();
    let url = window.location.pathname;
    this.addClickEvent();
    this.doRender(url);
  },
  doRender: async function (url) {
    let response = await attApiController.doGet(url);

    if (attModels.isFirst) {
      this.showLoading(false);
      attModels.isFirst = false;
    }
    attModels.attractionId = response[0];
    attView.renderImages(response[1]);
    attView.fillContent(response[2]);
    attView.renderBookingPrice();
    attView.setDate();
    pictureSliderView.setArrowClick();
    pictureSliderView.showSlides();

    navController.checkUserLogin();
  },
  addClickEvent: function () {
    attModels.bookingButtonDOM.addEventListener("click", async (e) => {
      e.preventDefault();
      if (getData.getIsUserLogin() === false) {
        getData.getDialogDOMs()["dialogDOM"].style.display = "block";
        getData.getDialogDOMs()["dialogMessageDOM"].style.display = "none";
      } else {
        //建立景點資訊存到session
        let form = document.getElementById("form_attraction");
        let time = "";

        //get radio type value
        for (let i = 0; i < form.time.length; i++) {
          if (form.time[i].checked) {
            time = form.time[i].value;
            break;
          }
        }

        let bookingData = {
          attractionId: attModels.attractionId,
          date: attModels.calenderDOM.value, //"2022-01-31",
          time: time, //"afternoon",
          price: attModels.bookingPriceContentDOM.textContent,
        };
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

  showLoading: function (isShow) {
    if (isShow === true) {
      attModels.attractionSectionItemDOM.style.display = "none";
      attModels.loadingDOM.style.display = "block";
      return;
    }
    attModels.attractionSectionItemDOM.style.display = "block";
    attModels.loadingDOM.style.display = "none";
  },
};

let attView = {
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
  fillContent: function (inputList = []) {
    let contentList = inputList.filter((data) => {
      // exclude not string type data
      return typeof data === typeof "";
    });
    if (contentList.length !== attModels.attDomList.length) return;
    let len = contentList.length;
    for (let i = 0; i < len; i++) {
      changeText(attModels.attDomList[i], contentList[i]);
    }
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
  setDate: function () {
    let tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    let localISOTime = new Date(Date.now() - tzoffset)
      .toISOString()
      .slice(0, -1);
    const today = localISOTime.slice(0, 10);
    attModels.calenderDOM.value = today;
    attModels.calenderDOM.min = today;
  },
};

let pictureSliderModel = {
  imgSliderDOM: null,
  dotGroupDOM: null,
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
      this.doPlusSlides(-1);
    };
    pictureSliderModel.rightArrowDOM.onclick = () => {
      this.doPlusSlides(1);
    };
  },
  doPlusSlides: function (n) {
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

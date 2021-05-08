//import js file
let newscript = document.createElement("script");
newscript.setAttribute("type", "text/javascript");
newscript.setAttribute("src", "../static/js/dataManager.js");
let head = document.getElementsByTagName("head")[0];
head.appendChild(newscript);

let attModels = {
  data: null,
  parsedData: null,
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

let attDataController = {
  init: function () {
    let thisUrl = window.location.toString();
    let url = thisUrl.replace(route_attraction, api_attraction);
    this.getAttraction(url);
  },
  getAttraction: function (url) {
    attModels.getAttractionData(url).then(function () {
      attModels.parseAttractionData();
      attView.fillContent(attModels.parsedData);
      attView.renderImages(attModels.parsedData[0]);
      attView.renderBookingPrice();
      pictureSliderView.setArrowClick();
      pictureSliderView.showSlides();
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
    imgSliderDOM.appendChild(imgDivElement);
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
    dotGroupDOM.appendChild(dotspanElement);
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
          bookingPriceContentDOM.innerHTML = price;
        });
      });
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
let imgSliderDOM; //slider dom
let dotGroupDOM; //slider dom
let leftArrowDOM;
let rightArrowDOM;

let attDomList = null;
window.onload = function () {
  profileTitleDOM = document.getElementById("profile-title");
  profileCATDOM = document.getElementById("profile-CAT");
  profileMRTDOM = document.getElementById("profile-MRT");
  infosDescriptionDOM = document.getElementById("infos-description");
  infosAddressContentDOM = document.getElementById("infos-addressContent");
  infosTransportContentDOM = document.getElementById("infos-transportContent");
  bookingPriceContentDOM = document.getElementById("booking-priceContent");
  imgSliderDOM = document.getElementById("img-slider");
  dotGroupDOM = document.getElementById("dotGroup");
  leftArrowDOM = document.getElementById("leftArrow");
  rightArrowDOM = document.getElementById("rightArrow");
  attDomList = [
    profileTitleDOM,
    profileCATDOM,
    profileMRTDOM,
    infosDescriptionDOM,
    infosAddressContentDOM,
    infosTransportContentDOM,
  ];
  attDataController.init();
};

//picture slider
let pictureSliderView = {
  slideIndex: 1,
  test2: function () {
    alert("2!!!");
  },
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
    leftArrowDOM.onclick = function () {
      DoPlusSlides(-1);
    };
    rightArrowDOM.onclick = function () {
      DoPlusSlides(1);
    };
  },
};
function DoPlusSlides(n) {
  pictureSliderView.plusSlides(n);
}
// let slideIndex = 1;
// // Next/previous controls
// function plusSlides(n) {
//   showSlides((slideIndex += n));
// }

// // Thumbnail image controls
// function currentSlide(n) {
//   showSlides((slideIndex = n));
// }

// function showSlides(n) {
//   let i;
//   let slides = document.getElementsByClassName("mySlides");
//   let dots = document.getElementsByClassName("dot");

//   if (n > slides.length) {
//     slideIndex = 1;
//   }
//   if (n < 1) {
//     slideIndex = slides.length;
//   }
//   for (i = 0; i < slides.length; i++) {
//     slides[i].style.display = "none";
//   }
//   for (i = 0; i < dots.length; i++) {
//     dots[i].className = dots[i].className.replace(" active", "");
//   }
//   slides[slideIndex - 1].style.display = "block";
//   dots[slideIndex - 1].className += " active";
// }

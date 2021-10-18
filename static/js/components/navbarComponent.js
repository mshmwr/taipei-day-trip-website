//建立logo組件
class MyLogo extends HTMLElement {
  static style = `
  @import "../static/css/reset.css";
  @import "../static/css/common.css";
  `;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.styling();
    this.render();
  }
  styling() {
    this.stylesheet = document.createElement("style");
    this.stylesheet.textContent = MyLogo.style;
    this.shadowRoot.appendChild(this.stylesheet);
  }
  render() {
    //navLogo
    this.navDivLogo = document.createElement("div");
    this.navDivLogo.id = "navDiv-logo";
    this.navDivLogo.classList.add("common-text", "navDiv--logo");
    this.navDivLogo.textContent = "台北一日遊";

    this.shadowRoot.appendChild(this.navDivLogo);
  }
}

class MyButton extends HTMLElement {
  static style = `
  @import "../static/css/reset.css";
  @import "../static/css/common.css";
  `;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.styling();
    this.render();
  }
  styling() {
    this.stylesheet = document.createElement("style");
    this.stylesheet.textContent = MyLogo.style;
    this.shadowRoot.appendChild(this.stylesheet);
  }
  render() {
    this.myBtn = document.createElement("div");
    this.myBtn.id = this.getAttribute("id");
    this.myBtn.classList.add("common-text", "navDiv--menu--btn-text");
    this.myBtn.textContent = this.getAttribute("text");
    this.shadowRoot.appendChild(this.myBtn);
  }
}
//組件外部
window.customElements.define("my-logo", MyLogo);
window.customElements.define("my-button", MyButton);

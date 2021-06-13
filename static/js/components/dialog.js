dialog =
  '      <div class="dialog" id="dialog">\
  <div class="dialogMask" id="dialogMask"></div>\
  <div class="dialogBox">\
    <div class="dialogBox__decoratorBar"></div>\
    <div class="dialogBox__icon" id="closeIcon">\
      <img />\
    </div>\
    <div class="dialogBox__form">\
      <form id="dialogForm">\
        <p class="common-text common-text-bold dialogBox__form-text dialogContent">登入會員帳號</p>\
        <input\
          type="text"\
          placeholder="輸入姓名"\
          class="common-text dialogContent dialogBox__form__inputField"\
          required\
        />\
        <input\
          type="email"\
          placeholder="輸入電子信箱"\
          id="dialog-email"\
          class="dialogContent dialogBox__form__inputField"\
          required\
        />\
        <input\
          type="password"\
          placeholder="輸入密碼"\
          class="dialogContent dialogBox__form__inputField"\
          autocomplete="on"\
          required\
        />\
        <input\
          type="submit"\
          value="登入帳戶"\
          class="common__btn dialogContent dialogBox__form__btn"\
        />\
      </form>\
      <p class="dialogBox__form__message" id="dialogMessage">error msg</p>\
      <a href="#" class="common-text dialogContent dialogBox__form__loginRegisterText">還沒有帳戶？點此註冊</a>\
    </div>\
  </div>\
</div>\
';

document.write(dialog);

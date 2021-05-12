dialog =
  '<div class="dialog" id="dialog">\
  <div class="dialogMask" id="dialogMask"></div>\
  <div class="dialogBox">\
    <div class="dialogBox-decoratorBar"></div>\
    <div class="dialogBox-icon" id="closeIcon">\
      <img />\
    </div>\
    <div class="dialogBox-main">\
      <p class="dialogBox-mainText dialogContent">登入會員帳號</p>\
      <input type="text" placeholder="輸入姓名" class="dialogContent" />\
      <input type="text" placeholder="輸入電子信箱" id="dialog-email" class="dialogContent"/>\
      <input type="text" placeholder="輸入密碼" class="dialogContent" />\
      <button><p class="dialogContent">登入帳戶</p></button>\
      <p class="dialogMessage" id="dialogMessage">error msg</p>\
      <div class="dialogLoginRegister">\
        <a href="#" class="dialogContent">還沒有帳戶？點此註冊</a>\
      </div>\
    </div>\
  </div>\
</div>\
';

document.write(dialog);

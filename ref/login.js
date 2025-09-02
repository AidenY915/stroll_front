const loginFrame = document.createElement("div");
loginFrame.id = "loginFrame";
loginFrame.innerHTML = `
    <div class = "logoContainer">
      <img src = "pages/images/Dog_Paw_Print_logo.png" class = 'logoImg'>
      <p>산책갈까</p>
    </div>
    <p>Log in</p>
    <form method = "post" action = "login">
    <input type='text' name='id'/>
    <input type='password' name='password'/>
    <input type='hidden' name='path' value='${window.location.pathname}${window.location.search}'/>
    <button>로그인</button>
    <a id="registerLink" href="register">회원가입</a>
    </form>
`;
loginFrame.style.zIndex = "51";

const showLogInFrame = () => {
  curtain.style.display = "block";
  $("body").append($(loginFrame));
  $(loginFrame).find('input[type="text"]').focus();
};

const closeLoginFrame = function (e) {
  if ($("body").children("#loginFrame").length == 0) {
    return;
  }
  if ($(loginFrame).has(e.target).length === 0 && e.target !== loginFrame) {
    $(loginFrame).detach();
    $(loginFrame).find('input[type="text"]').val("");
    $(loginFrame).find('input[type="password"]').val("");
    curtain.style.display = "none";
  }
};

$(document).ready().on("mouseup", closeLoginFrame);
$(loginFrame).find("form").on("submit", closeLoginFrame);

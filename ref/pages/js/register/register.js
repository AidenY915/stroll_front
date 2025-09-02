document.addEventListener("DOMContentLoaded", () => {
  document.registerForm.id.addEventListener("focusout", checkId);
  document.registerForm.password2.addEventListener("focusout", checkPassword);
  document.registerForm.nickname.addEventListener("focusout", checkNickname);
  document.registerForm.addEventListener("submit", checkBeforeSubmit);
});

const idDuplicateMessageSpan = document.getElementById("idDuplicateMessage");
const nicknameDuplicateMessageSpan = document.getElementById(
  "nicknameDuplicateMessage"
);
const passwordMessageSpan = document.getElementById("passwordMessageSpan");

const checkId = function () {
  const checkIdHttpRequest = new XMLHttpRequest();
  checkIdHttpRequest.open("post", "duplicateCheck?id=" + this.value);
  checkIdHttpRequest.addEventListener("readystatechange", function () {
    if (this.readyState == 4 && this.status == 200) {
      const result = this.response;
      console.log(result);

      if (result == "true") {
        idDuplicateMessageSpan.innerText = "사용 가능한 아이디입니다.";
        idDuplicateMessageSpan.style.color = "#198754";
      } else if (result == "false") {
        idDuplicateMessageSpan.innerText = "이미 사용 중인 아이디입니다.";
        idDuplicateMessageSpan.style.color = "red";
      }
    }
  });
  if (this.value == "") {
    idDuplicateMessageSpan.innerText = "아이디를 입력해주세요.";
    idDuplicateMessageSpan.style.color = "red";
  } else checkIdHttpRequest.send();
};
const checkPassword = function () {
  if (this.value === document.registerForm.password.value) {
    passwordMessageSpan.innerText = "비밀번호가 일치합니다.";
    passwordMessageSpan.style.color = "#198754";
  } else {
    passwordMessageSpan.innerText = "비밀번호가 일치하지 않습니다.";
    passwordMessageSpan.style.color = "red";
  }
  if (document.registerForm.password.value == "") {
    passwordMessageSpan.innerText = "비밀번호를 입력하세요.";
    passwordMessageSpan.style.color = "red";
  }
};
const checkNickname = function () {
  const checkNicknameHttpRequest = new XMLHttpRequest();
  checkNicknameHttpRequest.open(
    "post",
    "duplicateCheck?nickname=" + this.value
  );
  checkNicknameHttpRequest.addEventListener("readystatechange", function () {
    if (this.readyState == 4 && this.status == 200) {
      const result = this.response;
      if (result == "true") {
        nicknameDuplicateMessageSpan.innerText = "사용 가능한 닉네임입니다.";
        nicknameDuplicateMessageSpan.style.color = "#198754";
      } else if (result == "false") {
        nicknameDuplicateMessageSpan.innerText = "이미 사용 중인 닉네임입니다.";
        nicknameDuplicateMessageSpan.style.color = "red";
      }
    }
  });
  if (this.value == "") {
    nicknameDuplicateMessageSpan.innerText = "닉네임을 입력해주세요.";
    nicknameDuplicateMessageSpan.style.color = "red";
  } else checkNicknameHttpRequest.send();
};

const checkBeforeSubmit = function (event) {
  if (idDuplicateMessageSpan.innerText != "사용 가능한 아이디입니다.") {
    alert("사용 가능한 아이디를 입력하세요.");
    this.id.focus();
    event.preventDefault();
  }
  if (nicknameDuplicateMessageSpan.innerText != "사용 가능한 닉네임입니다.") {
    alert("사용 가능한 닉네임을 입력하세요.");
    this.nickname.focus();
    event.preventDefault();
  }
  if (this.password.value != this.password2.value) {
    alert("비밀번호를 확인하세요.");
    this.password.focus();
    event.preventDefault();
  }
};

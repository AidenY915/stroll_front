const curtain = document.createElement("div");
curtain.style.position = "fixed";
curtain.style.left = "0px";
curtain.style.top = "0px";
curtain.style.zIndex = "50";
curtain.style.width = "100vw";
curtain.style.height = "100vh";
curtain.style.opacity = "0.7";
curtain.style.display = "none";
curtain.style.backgroundColor = "black";

let gnb;

document.addEventListener("DOMContentLoaded", () => {
  gnb = document.getElementById("gnb");
  let btnLiInitialPos = window
    .getComputedStyle(document.querySelector("#gnb > ul > li:last-child"))
    .getPropertyValue("left");
  const body = document.querySelector("body");
  body.insertBefore(gnb, body.childNodes[0]);
  body.appendChild(curtain);
  $("#searchBtn").on("click", function () {
    console.log(btnLiInitialPos);
    $("#gnb>ul>*").not(":first-child").not(":last-child").hide();
    $(this)
      .parent()
      .animate({ left: "200px" }, 250, "linear", function () {
        $("#searchInput").show(100).focus();
      });
  });
  $("#searchInput").on("focus", function () {
    curtain.style.display = "block";
  });
  $("#searchInput").on("blur", function () {
    curtain.style.display = "none";
    const $btnLi = $(this).parent();
    $("#searchInput").hide(0, "linear", () => {
      $btnLi.animate({ left: btnLiInitialPos }, 250, "linear", function () {
        $("#gnb>ul>*").not(":first-child").not(":last-child").show();
      });
    });
  });
  $("#searchInput").on("keydown", function (event) {
    if (event.key === "Enter") {
      location.assign("aroundme?keywords=" + this.value);
    }
  });
});

let beforeScroll = 0;

const changeGnbColor = function () {
  const scrollY = window.scrollY;
  if (scrollY != 0 && beforeScroll != 0) return;
  if (scrollY > 0) {
    $(gnb).finish().animate({ backgroundColor: "white" }, 200, "linear");
    $(gnb).css("color", "rgba(0, 0, 0, 0.6)");
    $("#gnb li:first-child").css("color", "#ff5f55");
    $("#searchIcon").attr("src", "pages/images/search_icon_black.png");
  } else {
    $(gnb).finish().animate(
      {
        backgroundColor: "#ff5f55",
      },
      200,
      "linear"
    );
    $(gnb).css("color", "white");
    $("#gnb li:first-child").css("color", "white");
    $("#searchIcon").attr("src", "pages/images/search_icon.png");
  }
  beforeScroll = window.scrollY;
};

document.addEventListener("scroll", changeGnbColor);

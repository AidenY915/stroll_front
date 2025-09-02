document.removeEventListener("scroll", changeGnbColor);

$(() => {
  $(gnb).css({ color: "rgba(0, 0, 0, 0.6)", backgroundColor: "white" });
  $("#gnb li:first-child").css("color", "#ff5f55");
  $("#searchIcon").attr("src", "pages/images/search_icon_black.png");
});

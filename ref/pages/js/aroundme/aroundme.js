

$(() => {
  $(".locationBtn").on("click", () => {
    $("#mapContainer").css("display", "block");
    map.relayout();
  });
  $("body").on("click", closeMap);
  $(".categoryUl > li, .orderByUl > li").on("click", clickLi);
  $(".categoryUl > li:first-child, .orderByUl > li:first-child").trigger(
    "click"
  );
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");
  const order = urlParams.get("order");
  console.log(category);
  console.log(order);
  if (category != null)
    $(`.categoryUl > li[data-category = '${category}']`).trigger("click");
  if (order != null)
    $(`.orderByUl > li[data-order = '${order}']`).trigger("click");
  
  $(".distanceFilter > .filterSlider").on("change", changeDistanceFilter)  
  $(".starFilter > .filterSlider").on("change", changeStarFilter)
  $(".submitBtn").on("click", changePage1)
});


let $lastClickedCategory;
let $lastClickedOrderBy;

const clickLi = function () {
  if ($(this).parent().hasClass("categoryUl")) {
    if ($lastClickedCategory !== undefined)
      $lastClickedCategory.css("color", "");
    $lastClickedCategory = $(this);
    document.research.category.value = this.dataset.category;
  } else if ($(this).parent().hasClass("orderByUl")) {
    if ($lastClickedOrderBy !== undefined) $lastClickedOrderBy.css("color", "");
    $lastClickedOrderBy = $(this);
    document.research.order.value = this.dataset.order;
  }
  $(this).css("color", "#ff5f55");
};

const closeMap = function (e) {
  const map = document.querySelector("#mapContainer");
  if (
    $(map).has(e.target).length === 0 &&
    e.target !== map &&
    e.target !== document.querySelector(".locationBtn")
  ) {
    $(map).hide();
  }
};


const changeDistanceFilter = function() {
	$("#maxDistance").text("내 주변 " + this.value + "00m 이하");
}
const changeStarFilter = function() {
	$("#minStar").text("★" + this.value + "개 이상");
}

const changePage1 = function() {
	research.page.value=1;
}
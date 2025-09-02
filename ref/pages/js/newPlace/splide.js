var splide;
document.addEventListener("DOMContentLoaded", function () {
  splide = new Splide(".splide", {
    perPage: 4,
    perMove: 4,
    pagination: false,
    width: "490px",
    padding: "0",
    rewind: true,
    focus: 0,
    trimSpace: true,
  });
  $("input[name='imgs']").on("change", appendSplideLi);
  splide.mount();
});

let beforeClicked;
const appendSplideLi = function () {
  console.log(this.files);
  $(".splide__list>li").remove();
  Array.from(this.files).forEach((element) => {
    const imgUrl = window.URL.createObjectURL(element);
    $(".splide__list").append(
      $(`<li class="splide__slide">
          <img src="${imgUrl}" />
          </li>`)
    );
  });

  $(".splide__list>li:eq(0)>img").on("load", function () {
    $(this).trigger("click");
  });

  $(".splide__slide>img").on("click", function () {
    $(".displayedImg").attr("src", $(this).attr("src"));
    $(beforeClicked).css("border", "");
    $(this).css("border", "1px solid black");
    beforeClicked = this;
  });
  splide.mount();
};

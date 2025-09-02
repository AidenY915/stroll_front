document.addEventListener("DOMContentLoaded", function () {
  var splide = new Splide(".splide", {
    perPage: 4,
    perMove: 4,
    pagination: false,
    width: "490px",
    padding: "0",
    rewind: true,
    focus: 0,
    trimSpace: true,
  });
  if ($("li.splide__slide").length == 0) {
    for (let i = 0; i < 3; i++) {
      $(".splide__list").append(
        $(`<li class="splide__slide">
        <img src="https://picsum.photos/490/348" />
        </li>`)
      );

      $(".splide__list").append(
        $(`<li class="splide__slide">
        <img src="https://picsum.photos/491/349" />
        </li>`)
      );

      $(".splide__list").append(
        $(`<li class="splide__slide">
        <img src="https://picsum.photos/492/348" />
        </li>`)
      );
    }
  }
  splide.mount();
  $(".splide__list>li:eq(0)>img").on("load", function () {
    $(this).trigger("click");
  });

  let beforeClicked;
  $(".splide__slide>img").on("click", function () {
    $(".displayedImg").attr("src", $(this).attr("src"));
    $(beforeClicked).css("border", "");
    $(this).css("border", "1px solid black");
    beforeClicked = this;
  });
});

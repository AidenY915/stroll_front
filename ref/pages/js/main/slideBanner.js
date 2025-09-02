document.addEventListener("DOMContentLoaded", function () {
  var splide = new Splide(".splide", {
    type: "loop",
    perPage: 1,
    perMove: 1,
    autoplay: true,
    interval: 3000,
    speed: 500,
    pagination: false,
    width: "100%",
    padding: "0",
    arrows: false,
    pauseOnHover: false,
    pauseOnFocus: false,
  });
  splide.mount();
});

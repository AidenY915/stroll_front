const resultList = [];

const liTemplete = (
  no,
  imgSrc = "http://placehold.it/180x240",
  placeName = "장소 이름",
  stars = "0"
) => `<a href = 'detail?no=${no}'>
  <img class = "placeImg" src=${imgSrc}>
  <div>
  <p class = "placeName">${placeName}</p>
  <p class = "star">${stars}</p>
  </div>
</a>`;

const addLi = function (
  no,
  imgSrc = "http://placehold.it/180x240",
  placeName = "장소 이름",
  stars = "0"
) {
  let li = document.createElement("li");
  li.innerHTML = liTemplete(no, imgSrc, placeName, stars);
  resultList.push(li);
};

//for (let i = 1; i <= 10; i++) {
//  addLi(i);
//}

document.addEventListener("DOMContentLoaded", () => {
  const resultContentsUl = document.querySelector(".results");
  resultList.forEach((e) => {
    resultContentsUl.append(e);
  });
});

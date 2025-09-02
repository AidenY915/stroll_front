/*

*/
class Page {
  title;
  $contentHTML;
  constructor(title, $content) {
    this.title = title;
    this.$content = $content;
  }
}

class board {
  title;
  content;
  createdDate;
  constructor(title, content) {
    (this.title = title), (this.content = content);
    const date = new Date();
    this.createdDate =
      date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
  }
}

const dropDownBoard = function () {
  $(this).find(".boardContent").toggle();
  const upDown = $(this).find(".boardTitle > span").text();
  $(this)
    .find(".boardTitle > span")
    .text(upDown == "▽" ? "△" : "▽");
};

const loadBoard = function ($content, boards) {
  boards.forEach((e) => {
    const $li = $(`
      <li>
        <div>
          <p class = 'boardTitle'>${e.title}<span>▽</span></p>
          
          <p class = 'createdDate'>${e.createdDate}</p>
        </div>
        <article class = 'boardContent'>${e.content}</article>
      </li>`);
    const $ul = $content.find(".boardUl");
    $ul.append($li);
    $li.on("click", dropDownBoard);
  });
};

const pages = [];

const switchContent = function (page) {
  $("header h1").text(page.title);
  $(".content>*").detach();
  $(".content").append(page.$content);
};

let clickedBefore;

$(() => {
  $(".sideLnb > ul > li").on("click", function () {
    if (clickedBefore !== undefined) {
      clickedBefore.style.color = "inherit";
      clickedBefore.style.fontWeight = "400";
    }
    clickedBefore = this;
    this.style.color = "#ff5f55";
    this.style.fontWeight = "700";
    switchContent(pages[$(this).index()]);
  });
  $(".sideLnb > ul > li:eq(0)").trigger("click");
});

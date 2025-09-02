const FAQs = [];

for (let i = 0; i < 4; i++) {
  FAQs.push(
    new board(
      "자주 묻는 질문" + i,
      `안녕하세요.
      <br>
  여행할때, 산책갈까입니다.
  <br>
  <br>
  금주 '산책갈까 응원하기' 이벤트 당첨은 내부 사정으로 인하여 한주 쉬어가게 되었습니다.
  <br>
  산책갈까 응원하기 이벤트에 관심을 가지고 참여해 주신 모든 고객님께 감사 인사드리며,
  앞으로도 많은 관심과 참여 부탁드립니다.
  <br>
  감사합니다.`
    )
  );
}

const $FAQContent = $(`
  <article class = "boardContainer">
    <p>FAQ</p>
    <ul class = 'boardUl'>
    </ul>
  </article>
`);

loadBoard($FAQContent, FAQs);

const FAQPage = new Page("자주 묻는 질문", $FAQContent);

pages[1] = FAQPage;

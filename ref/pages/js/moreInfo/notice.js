const notices = [];

for (let i = 0; i < 10; i++) {
  notices.push(
    new board(
      "[공지]공지사항입니다." + i,
      `안녕하세요.
  <br>
여행할때, 여기어때입니다.
<br>
<br>
금주 '여기어때 응원하기' 이벤트 당첨은 내부 사정으로 인하여 한주 쉬어가게 되었습니다.
<br>
여기어때 응원하기 이벤트에 관심을 가지고 참여해 주신 모든 고객님께 감사 인사드리며,
앞으로도 많은 관심과 참여 부탁드립니다.
<br>
감사합니다.`
    )
  );
}

const $noticeContent = $(`
  <article class = "boardContainer">
    <p>서비스 공지사항</p>
    <ul class = 'boardUl'>
    </ul>
  </article>
`);

loadBoard($noticeContent, notices);

const noticePage = new Page("공지사항", $noticeContent);

pages[0] = noticePage;

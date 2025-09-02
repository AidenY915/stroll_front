<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>더보기</title>
    <link rel="icon" href="pages/images/favicon.png" />
    <link rel="stylesheet" href="pages/css/frameCss.css" />
    <link rel="stylesheet" href="pages/css/moreInfo/moreInfo.css" />
    <script
      src="https://code.jquery.com/jquery-3.7.1.min.js"
      integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
      crossorigin="anonymous"
    ></script>
    <script
      src="https://code.jquery.com/ui/1.13.2/jquery-ui.min.js"
      integrity="sha256-lSjKY0/srUM9BE3dPm+c4fBo1dky2v27Gdjm2uoZaL0="
      crossorigin="anonymous"
    ></script>
    <script src="pages/js/footer.js"></script>
    <script src="pages/js/moreInfo/moreInfo.js"></script>
    <script src="pages/js/moreInfo/notice.js"></script>
    <script src="pages/js/moreInfo/faq.js"></script>
  </head>
  <body>
  <%@include file = "gnb.jsp"%>
    <header>
      <div class="container">
        <h1>공지사항</h1>
      </div>
    </header>
    <div class="container">
      <aside class="sideLnb">
        <ul>
          <li>공지사항</li>
          <li>자주 묻는 질문</li>
          <li>문의 사항</li>
        </ul>
      </aside>
      <section class="content"></section>
    </div>
  </body>
</html>

<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<link rel="stylesheet" href="pages/css/gnb.css" />
<link rel="stylesheet" href="pages/css/login.css" />

<script src="pages/js/gnb.js"></script>
<script src="pages/js/login.js"></script>
</head>
<body>
	<section id="gnb">
		<ul>
			<li><a href='main'>산책갈까</a></li>
			<c:choose>
				<c:when test="${sessionScope.id == null}">
					<li><a onclick='showLogInFrame()'>로그인</a></li>
				</c:when>
				<c:otherwise>
					<li><a href="logout">로그아웃</a></li>
				</c:otherwise>
			</c:choose>
			<li><a href='moreInfo'>더보기</a></li>
			<c:if test="${sessionScope.id != null}">
				<li><a href='mypage'>마이페이지</a></li>
			</c:if>
			<li><a href='aroundme'>내 주변</a></li>
			<li><a id='searchBtn'><img id='searchIcon'
					src='pages/images/search_icon.png'></a><input id="searchInput"
				type="search" /></li>
		</ul>
	</section>
</body>
</html>

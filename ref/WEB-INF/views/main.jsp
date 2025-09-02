<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>산책갈까</title>
<link rel="icon" href="pages/images/favicon.png">
<!--   <link rel="stylesheet" href="pages/css/gnb.css" /> -->
<link rel='stylesheet' href='pages/css/frameCss.css'>
<link rel="stylesheet" href="pages/css/main/main.css" />
<!-- splider -->
<link
	href="
https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css
"
	rel="stylesheet" />
<script src="https://code.jquery.com/jquery-3.7.1.min.js"
	integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
	crossorigin="anonymous"></script>
<script src="https://code.jquery.com/ui/1.13.2/jquery-ui.min.js"
	integrity="sha256-lSjKY0/srUM9BE3dPm+c4fBo1dky2v27Gdjm2uoZaL0="
	crossorigin="anonymous"></script>
<script
	src="
https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js
"></script>
<!--<script src="pages/js/gnb.js"></script>-->
<script src="pages/js/footer.js"></script>
<script src='pages/js/main/slideBanner.js'></script>
</head>
<body>
	<%@ include file='gnb.jsp'%>
	<script src='pages/js/main/gnbAnimationOff.js'></script>
	<header>
		<section class="splide" aria-label="Splide Basic HTML Example">
			<div class="splide__track">
				<ul class="splide__list">
					<li class="splide__slide"><img class="bannerImg"
						src="pages/images/banner1.jpg" /></li>
					<li class="splide__slide"><img class="bannerImg"
						src="pages/images/banner2.jpg" /></li>
					<li class="splide__slide"><img class="bannerImg"
						src="pages/images/banner3.jpg" /></li>
				</ul>
			</div>
		</section>
	</header>
	<section class="container">
		<section class='category'>
			<a
				href='${pageContext.request.contextPath}/../aroundme/aroundme.html'><img
				src="pages/images/inn_icon.png">
				<p>펜션</p></a><a href='../aroundme/aroundme.html'><img
				src="pages/images/cafe_icon.svg">
				<p>카페</p></a><a href='../aroundme/aroundme.html'><img
				src="pages/images/restaurant_icon.svg">
				<p>미용</p></a><a href='../aroundme/aroundme.html'><img
				src="pages/images/hospital_icon.svg">
				<p>동물병원</p></a><a href='../aroundme/aroundme.html'><img
				src="pages/images/playground_icon.svg">
				<p>놀이터</p></a><a href='../aroundme/aroundme.html'><img
				src="pages/images/kindergarten.svg">
				<p>유치원</p></a>
		</section>
		<section class='news'>
			<h2>
				산책갈까 소식
				<h2>
					<article></article>
		</section>
		<img src='templete.png'>;
	</section>
	<footer> </footer>
</body>
</html>

$(()=>{
	$(".wishBtn").on("click", clickWishBtn);
})    

const clickWishBtn = function() {
  	const imgsrc = $(".wishBtn>img").attr("src");
	if(imgsrc.includes("beforeWish.png")){
		$(".wishBtn>img").attr("src", "pages/images/wished.png");
		$.ajax({url : `addToWishList${window.location.search}`});
	}else if(imgsrc.includes("wished.png")){
		$(".wishBtn>img").attr("src", "pages/images/beforeWish.png");
		$.ajax({url : `deleteFromWishList${window.location.search}`});
	}  
  };
  
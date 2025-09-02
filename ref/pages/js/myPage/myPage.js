document.addEventListener("DOMContentLoaded", ()=>{
	document.querySelector("#withdrawLi").addEventListener("click", showWithdraw);
	let listQuery = (String(window.location.search)).replace("?list=", "") ;
	listQuery = listQuery=="" ? "wishList" : listQuery
	selectedLi = document.getElementById(listQuery+"Li");
	selectedLi.classList.add("selectedLi");
})

let selectedLi;

const showWithdraw = function() {
	document.querySelector(".content").remove()
	const content = document.createElement("section");
	content.className = "content";
	content.innerHTML = `
		<h3>회원탈퇴</h3>
		<hr/>
		<form method='post' action='withdraw' id = "withdrawForm">
		<p>회원탈퇴를 하시려면 비밀번호를 입력하십시오.</p>
		<table>
			<tr><td>비밀번호</td><td><input type="password" name="password"></td><td><button class = "withdrawBtn">회원탈퇴</button></td></tr>
		</table>
		</form>
	`
	document.querySelector("body>div.container").appendChild(content);
	
	selectedLi.classList.remove("selectedLi");
	this.classList.add("selectedLi");
}



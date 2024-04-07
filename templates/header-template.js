function headerTemplate() {
	let splittedLoginPerson;
	if (logedInPerson) {
		splittedLoginPerson = logedInPerson.split(" ");
	}
	return `
	<div id="header-left">
		<div id="text-top">Kanban Project Management Tool</div>
		<img id="logo-header-mobile" src="./img/start_logo.svg" alt="">
	</div>
	<div id="header-right">
		<a href="./help.html"  id="help-icon"><img src="./img/help.svg" alt="Help"></a>
		<div id="cycle-name" onclick="overlayHeaderShow()">
			${logedInPerson ?
			`<p id="initial-of-current-person">
					${splittedLoginPerson[0] ? splittedLoginPerson[0].charAt(0) : ''}
					${splittedLoginPerson[1] ? splittedLoginPerson[1].charAt(0) : ''}
				</p>`
			:
			`<p id="initial-of-current-person">G</p>`
		}
		</div>
	</div>
	<div id="overlay-header" class="overlay-header overlay-hidden flex-column">
		<a href="./legal_notice.html".html">Legal Notice</a>
		<a href="./Privacy.html">Privacy Policy</a>
		<a href="./index.html">
			<p onclick="logOut()">Log out</p>
		</a>
	</div>
	`;
}

function overlayHeaderShow() {
	let overlayHeader = document.getElementById('overlay-header');
	overlayHeader.classList.toggle('overlay-hidden');
}

function logOut() {
	if(logedInPerson) {
		localStorage.removeItem('logedIn Person', '');
	}
	if(logedInAsGuest) {
		localStorage.removeItem('logedIn as Guest', '');
	}
	if(logedInWithName) {
		localStorage.removeItem('logedIn with Name', '');
	}
}
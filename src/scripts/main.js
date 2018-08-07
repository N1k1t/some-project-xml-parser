document.onreadystatechange = () => document.readyState == 'interactive' ? onReady() : null;


/*=============================
=            READY            =
=============================*/
function onReady(){
	let { xml } = parseSearch();

	if ( xml ) initXMLDetails(xml);
}


/*===========================
=            XML            =
===========================*/
async function initXMLDetails(fileName){
	let res = await makeGetRequest(`xml/${fileName}.xml`).catch(() => onError());

	if ( !res ) return false;

	let xmlElem = parseXML(res);
	let xmlDoc = xmlElem.documentElement;
	let htmlToInsert = `
		<h1>Детали файла "${fileName}"</h1>
		<hr class="default" />
		<p><b>Число внутренних ссылок "l:href"</b><b class="bold">${getInternalLinks().length}</b></p>
		<p><b>Число битых внутренних ссылок</b><b class="bold">${calcInvalidInternalLinks()}</b></p>
		<hr class="default" />
		<p><b>Всего символов в тегах</b><b class="bold">${xmlDoc.textContent.length}</b></p>
		<p><b>Всего букв в тегах с пробелами</b><b class="bold">${xmlDoc.textContent.replace(/[^\w^а-яА-Я^\s]/g, '').length}</b></p>
		<p><b>Всего букв в тегах без пробелов</b><b class="bold">${xmlDoc.textContent.replace(/[^\w^а-яА-Я]/g, '').length}</b></p>
		<hr class="default" />
		<p><b>Всего кириллических букв</b><b class="bold">${xmlDoc.textContent.replace(/[^а-яА-Я]/g, '').length}</b></p>
		<p><b>Всего латинских букв</b><b class="bold">${xmlDoc.textContent.replace(/[^a-zA-Z]/g, '').length}</b></p>
		<p><b>Всего чисел</b><b class="bold">${xmlDoc.textContent.replace(/[^\d]/g, '').length}</b></p>
		<p><b>Всего пробелов</b><b class="bold">${xmlDoc.textContent.replace(/[^\s]/g, '').length}</b></p>
		<p><b>Всего точек</b><b class="bold">${xmlDoc.textContent.replace(/[^\.]/g, '').length}</b></p>
		<p><b>Всего запятых</b><b class="bold">${xmlDoc.textContent.replace(/[^\,]/g, '').length}</b></p>
		<p><b>Всего абзацев</b><b class="bold">${xmlDoc.textContent.replace(/[^\n]/g, '').length}</b></p>`;

	insertHTML(htmlToInsert);

	function getInternalLinks(){
		let result = [];

		for ( let anchor of xmlElem.querySelectorAll('a') ){
			let id = anchor.getAttribute('l:href') || '';

			if ( id[0] == '#' ) result.push(id);
		}

		return result;
	}
	function calcInvalidInternalLinks(){
		let length = 0;

		// xmlElem.getElementById && xmlElem.querySelector('#id') - not works in IE11
		getInternalLinks().map(id => xmlDoc.querySelector(`*[id="${id.substr(1)}"]`) ? null : length++);

		return length
	}
	function onError(){
		insertHTML(`<h1>Файл "${fileName}" не найден!</h1>`);
	}
	function insertHTML(html){
		document.querySelector('section.details').innerHTML = html;
	}
}
function parseXML(xml){
	let parser = new DOMParser();

	return parser.parseFromString(xml, 'text/xml');
}


/*============================
=            AJAX            =
============================*/
function makeGetRequest(path, cb = Function(null)){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', path, true);
	xhr.send();

	return new Promise((resolve, reject) => {
		xhr.onreadystatechange = () => {
			if ( xhr.readyState != 4 ) return;
			if ( xhr.status == 404 ) return reject();

			resolve(xhr.response);
			cb(xhr.response);
		}
	})
}


/*=============================
=            UTILS            =
=============================*/
function parseSearch(){
	let result = {};

	if ( !location.search ) return result;

	let query = location.search.substr(1);
	let queryParts = query.split('&');

	for ( let part of queryParts ){
		let [ key, value ] = part.split('=');

		result[key] = decodeURI(value);
	}

	return result;
}
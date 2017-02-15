var app = app || {};

+function() {
	"use strict";

	// Cat listing (ul) View
	app.listView = {
		createCatList: () => {
			const catList = document.createElement('ul');
			catList.id = 'cat-list';
			catList.className = 'section';
			return catList;
		},

		render: (cats, catList) => {
			catList.innerHTML = "";
			const fragment = document.createDocumentFragment();
			cats.forEach((cat, i) => {
				const li = document.createElement('li');
				li.textContent = cat.name;
				li.setAttribute('data-catid', i);
				fragment.appendChild(li);
			});
			catList.appendChild(fragment);
		}
	}

}();


// Environment check for node
if (typeof module !== 'undefined' && module.exports) {
	module.exports.listView = app.listView;
}
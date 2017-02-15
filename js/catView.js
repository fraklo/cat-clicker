var app = app || {};

+function() {
	"use strict";

	// Main Cat view
	app.catView = {
		createCatSection: () => {
			const html = `
				<div class="cat-wrapper">
					<h3 class="cat-name"></h3>
					<img class="cat-image" />
					<span class="click-count"></span>
				</div>`;
			const catSection = document.createElement('div');
			catSection.id = 'cat-section';
			catSection.className = 'section';
			catSection.innerHTML = html;
			// innerchild accessors
			catSection.img = catSection.getElementsByClassName('cat-image')[0];
			catSection.catName = catSection.getElementsByClassName('cat-name')[0];
			catSection.clickCount = catSection.getElementsByClassName('click-count')[0];
			return catSection;
		},

		render: (cat, catSection) => {
			if(typeof cat !== 'object') throw new Error('Requires valid cat object');
			catSection.img.src = cat.image;
			catSection.catName.textContent = cat.name;
			app.catView.setCatSectionCount(catSection, cat.clickCount);
		},

		// Syncs current cat click-count display with cat clickCount
		setCatSectionCount: (catSection, count) =>
			catSection.clickCount.textContent = count
	}

}();


// Environment check for node
if (typeof module !== 'undefined' && module.exports) {
	module.exports.catView = app.catView;
}
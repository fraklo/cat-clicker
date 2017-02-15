var app = app || {};

+function() {
	"use strict";

	app.model = {
		// Given catId, checks for existing cat
		catExists: (catId, data) =>
			data.cats[catId] ? true : false,

		getAllCats: data =>
			data.cats || [],

		getCatById: (catId, data) =>
			app.model.catExists(catId, data) ? data.cats[catId] : null,

		getCurrentCat: data => 
			app.model.getCatById(data.currentCatId, data),

		getCurrentCatId: data => {
			if(data.currentCatId >= 0) {
				return data.currentCatId;
			} else {
				throw new Error('No current cat id set');
			}
		},

		setCatClickCount: (cat, clickCount) => {
			if(clickCount >= 0) {
				cat.clickCount = clickCount;
			} else {
				throw new Error('Click Count must be an Integer of 0 or greater');
			}
		},

		setCurrentCatId: (catId, data) => {
			if(app.model.catExists(catId, data)) {
				data.currentCatId = catId;
			} else {
				throw new Error('Cat id must be a valid id');
			}
		},

		// Given cat data, syncs cat data object with new data
		syncNewCatData: (newCatData, data) => {
			const catId = app.model.getCurrentCatId(data);
			// merge new cat data with old cat data
			data.cats[catId] = Object.assign({}, data.cats[catId], newCatData);
		},

		validateData: (data) => {
			if(typeof data !== 'object' || !data.cats) {
				return false;
			}
			return data;
		}
	}

}();

// Environment check for node
if (typeof module !== 'undefined' && module.exports) {
	module.exports.model = app.model;
}
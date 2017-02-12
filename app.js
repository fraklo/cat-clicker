"use strict";

const utils = {
	// Returns form data object
	getFormData: form => {
		if(typeof form !== 'object' || !form.children) 
			throw new Error('Requires valid form object');
		// create array from form children
		const elsArray = [...form.children];
		return elsArray.reduce( (data, el) => {
			if(el.name) {
				// if element has name add property to object with element value
				data[el.name] = el.value;
			}
			return data;
		}, {});
	},

	// Given data, updates form
	setFormData: (form, data) => {
		if(typeof form !== 'object' || !form.children) 
			throw new Error('Requires valid form object');
		if(typeof data !== 'object') throw new Error('Requires valid data object');
		// create array from form children
		const elsArray = [...form.children];
		elsArray.map( el => {
			// if data property exists ensure string value for inputs
			let val = data[el.name] === undefined ? '' : `${data[el.name]}`;
			if(el.name && val) {
				// data contains value for input
				el.value = data[el.name];
			}
		});
	}
}

// Admin to edit current cat info
const adminView = {
	createAdminSection: () => {
		const html = `
			<button class="admin-toggle">Admin</button>
			<div class="admin-wrapper">
				<form name="admin-form">
					<input type="text" name="name" class="admin-input" />
					<input type="text" name="image" class="admin-input" />
					<input type="number" name="clickCount" class="admin-input" />
					<button type="button" class="admin-toggle">Cancel</button>
					<button type="Submit">Submit</button>
				</form>
			</div>`;
		const adminSection = document.createElement('div');
		adminSection.id = 'admin-section';
		adminSection.className = 'section';
		adminSection.innerHTML = html;
		adminSection.form = adminSection.getElementsByTagName('form')[0];
		return adminSection;
	},

	handleSubmit: adminSection =>
		adminSection.classList.remove('active'),

	toggleView: el =>
		el.classList.toggle('active'),

	// Syncs clickCount input with current cat clickCount
	updateCounter: (count, form) => {
		const counter = form.querySelector('[name=clickCount]');
		counter.value = count;
	}
}

// Cat listing (ul) View
const listView = {
	createCatList: app => {
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

// Main Cat view
const catView = {
	createCatSection: () => {
		const html = `
			<div class="cat-wrapper">
				<h3 class="cat-title"></h3>
				<img class="cat-image" />
				<span class="click-count"></span>
			</div>`;
		const catSection = document.createElement('div');
		catSection.id = 'cat-section';
		catSection.className = 'section';
		catSection.innerHTML = html;
		catSection.img = catSection.getElementsByClassName('cat-image')[0];
		catSection.title = catSection.getElementsByClassName('cat-title')[0];
		catSection.counter = catSection.getElementsByClassName('click-count')[0];
		return catSection;
	},

	render: (cat, catSection) => {
		if(typeof cat !== 'object') throw new Error('Requires valid cat object');
		catSection.img.src = cat.image;
		catSection.title.textContent = cat.name;
		catView.updateCounter(cat.clickCount, catSection);
	},

	// Syncs current cat click-count display with cat clickCount
	updateCounter: (count, catSection) =>
		catSection.counter.textContent = count
}

const model = {
	// Given catId, checks for existing cat
	catExists: (catId, data) =>
		data.cats[catId] ? true : false,

	getAllCats: (data) => {
		if(data.cats) {
			return data.cats
		} else {
			return [];
		}
	},

	getCatById: (catId, data) =>
		model.catExists(catId, data) ? data.cats[catId] : null,

	getCurrentCat: data => 
		model.getCatById(data.currentCatId, data),

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
		if(model.catExists(catId, data)) {
			data.currentCatId = catId;
		} else {
			throw new Error('Cat Id must be a valid Id');
		}
	},

	// Given cat data, syncs cat data object with new data
	syncCatData: (data, newCatData) => {
		const catId = model.getCurrentCatId(data);
		data.cats[catId] = Object.assign({}, data.cats[catId], newCatData);
	},

	validateData: (data) => {
		if(!data) throw new Error('Data is empty');
		if(!data.cats) throw new Error('Data missing cats 🐱');
		return data;
	}
}

const controller = function() {
	let data;
	let adminSection;
	let catList;
	let catSection;
	return {
		init: modelData => {
			data = model.validateData(modelData);
			model.setCurrentCatId(0, data);

			const app = document.getElementById('app');
			const cats = model.getAllCats(data);

			catList = listView.createCatList(cats);
			app.appendChild(catList);

			catSection = catView.createCatSection();
			app.appendChild(catSection);

			adminSection = adminView.createAdminSection();
			app.appendChild(adminSection);

			controller.initEventListeners();
			controller.triggerEvent('catUpdated');
		},

		handleClickCount: () => {
			const cat = model.getCurrentCat(data);
			const clickCount = cat.clickCount > 0 ? cat.clickCount + 1 : 1;
			model.setCatClickCount(cat, clickCount);
			controller.triggerEvent('counterIncremented');
		},

		initEventListeners: () => {
			// Admin form event listeners
			adminSection.addEventListener('click', event => {
				if(event.target.classList.contains('admin-toggle')) {
					adminView.toggleView(adminSection);
				}
			});
			// form submitted, update cat data with form data
			const adminForm = adminSection.form;
			adminSection.addEventListener('submit', event => {
				event.preventDefault();
				const formData = utils.getFormData(adminForm);
				controller.updateCurrentCat(formData);
				adminView.handleSubmit(adminSection);
			});

			// Cat list event listeners
			// cat clicked, load corresponding cat
			catList.addEventListener('click', event => {
				const el = event.target;
				if(el.tagName.toUpperCase() == 'LI') {
					controller.loadCat(el.dataset.catid);
				}
			});

			// Cat Section event listeners
			// image is clicked, update clickCount
			catSection.addEventListener('click', event => {
				if(event.target.tagName.toUpperCase() == 'IMG') {
					controller.handleClickCount();
				}
			});

			// General event listners
			// counter incremented
			document.addEventListener('counterIncremented', () => {
				const cat = model.getCurrentCat(data);
				// update cat view counter
				catView.updateCounter(cat.clickCount, catSection);
				// update admin view with new cat data
				adminView.updateCounter(cat.clickCount, adminForm);
			});
			// cat loaded
			document.addEventListener('catLoaded', () => {
				const cat = model.getCurrentCat(data);
				// re-render cat view
				catView.render(cat, catSection);
				// update admin form data with new cat
				utils.setFormData(adminForm, cat)
			});
			// cat updated 
			document.addEventListener('catUpdated', () => {
				const cats = model.getAllCats(data);
				// full app re-render
				listView.render(cats, catList);
				// re-use render calls from catLoaded
				controller.triggerEvent('catLoaded');
			});
		},

		// Given cat id, loads cat into cat view
		loadCat: catId => {
			model.setCurrentCatId(catId, data);
			controller.triggerEvent('catLoaded');
		},

		triggerEvent: event => {
			document.dispatchEvent(new Event(event));
		},

		// Syncs current cat with cat data
		// triggers views to re-render with new data
		updateCurrentCat: newCatdata => {
			model.syncCatData(data, newCatdata);
			// list view only updates when cat changed
			const cats = model.getAllCats(data);
			listView.render(cats, catList);
			controller.triggerEvent('catLoaded');
		}
	};
}();

// Environment check for node
if (typeof module !== 'undefined' && module.exports) {
	module.exports.adminView = adminView;
	module.exports.catView = catView;
	module.exports.listView = listView;
	module.exports.model = model;
	module.exports.utils = utils;
}
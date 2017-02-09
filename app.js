const utils = {
	// Returns form data object
	getFormData: form => {
		if(typeof form != 'object' || !form.children) 
			throw new Error('Requires valid form object');
		const els = form.children;
		return Array.from(els).reduce( (data, el) => {
			if(el.name) {
				data[el.name] = el.value;
			}
			return data;
		}, {});
	},

	// Given data, updates form
	setFormData: (form, data) => {
		const els = form.children;
		for(let i = 0, el, val; i < els.length; i++) {
			el = els[i];
			val = data[el.name] != undefined ? `${data[el.name]}` : '';
			if(el.name && val) {
				el.value = data[el.name];
			}
		}
	}
}

// Admin to edit current cat info
const adminView = {
	init: app => {
		const adminSection = adminView.createAdminSection();
		app.appendChild(adminSection);
		adminSection.addEventListener('click', event => {
			if(event.target.classList.contains('admin-toggle')) {
				adminView.toggleView(adminSection);
			}
		});
		this.form = adminSection.getElementsByTagName('form')[0];
	},

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
		return adminSection;
	},

	getForm: () => 
		this.form,

	handleSubmit: (form, update) => {
		update(utils.getFormData(form));
		form.classList.remove('active');
	},

	toggleView: el =>
		el.classList.toggle('active'),

	// Syncs clickCount input with current cat clickCount
	updateCounter: (form, cat) => {
		const counter = form.querySelector('[name=clickCount]');
		counter.value = cat.clickCount;
	},

	// Syncs form inputs with cat data
	updateFormData: (form, data) =>
		utils.setFormData(form, data)
}

// Cat listing (ul) View
const listView = {
	init: (app, cats) => {
		this.catList = listView.createCatList();
		app.appendChild(this.catList);
		listView.render(cats);
	},

	createCatList: () => {
		const catList = document.createElement('ul');
		catList.id = 'cat-list';
		catList.className = 'section';
		return catList;
	},

	getList: () =>
		this.catList,

	render: cats => {
		this.catList.innerHTML = "";
		const fragment = document.createDocumentFragment();
		cats.forEach((cat, i) => {
			const li = document.createElement('li');
			li.textContent = cat.name;
			li.setAttribute('data-catid', i);
			fragment.appendChild(li);
		});
		this.catList.appendChild(fragment);
	}
}

// Main Cat view
const catView = {
	init: app => {
		this.catSection = catView.createCatSection();
		app.appendChild(this.catSection);

		this.img = this.catSection.getElementsByClassName('cat-image')[0];
		this.title = this.catSection.getElementsByClassName('cat-title')[0];
		this.counter = this.catSection.getElementsByClassName('click-count')[0];
	},

	createCatSection: () => {
		const html = `
			<div class="cat-wrapper">
				<h3 class="cat-title"></h3>
				<img class="cat-image" />
				<span class="click-count"></span>
			</div>`;
		const catView = document.createElement('div');
		catView.id = 'cat-section';
		catView.className = 'section';
		catView.innerHTML = html;
		return catView;
	},

	getCatSection: () =>
		this.catSection,

	render: cat => {
		if(typeof cat !== 'object') throw new Error('Requires valid cat object');
		this.img.src = cat.image;
		this.title.textContent = cat.name;
		catView.updateCounter(cat.clickCount);
	},

	// Syncs current cat click-count display with cat clickCount
	updateCounter: count =>
		this.counter.textContent = count
}

const model = {
	init: data => {
		if(!data) throw new Error('Data is empty');
		if(!data.cats) throw new Error('Data missing cats 🐱');
		this.data = data;
	},

	// Given catId, checks for existing cat
	catExists: catId =>
		this.data.cats[catId] ? true : false,

	getAllCats: () => {
		if(this.data.cats) {
			return this.data.cats
		} else {
			return [];
		}
	},

	getCatById: catId =>
		model.catExists(catId) ? this.data.cats[catId] : null,

	getCurrentCat: () => 
		model.getCatById(this.data.currentCatId),

	getCurrentCatId: () => {
		if(this.data.currentCatId >= 0) {
			return this.data.currentCatId;
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

	setCurrentCatId: catId => {
		if(model.catExists(catId)) {
			this.data.currentCatId = catId;
		} else {
			throw new Error('Cat Id must be a valid Id');
		}
	},

	// Given cat data, syncs cat data object with new data
	updateCat: (catId, newCatData) => {
		if(model.catExists(catId)) {
			const cat = this.data.cats[catId];
			this.data.cats[catId] = Object.assign({}, cat, newCatData);
		} else {
			throw new Error('Cat Id must be a valid Id');	
		}
	}
}

const controller = {
	init: data => {
		const app = document.getElementById('app');

		model.init(data);
		model.setCurrentCatId(0);

		const cats = model.getAllCats();
		listView.init(app, cats);

		catView.init(app);

		adminView.init(app);

		controller.initEventListeners();
		controller.triggerEvent('loadCat');
	},

	handleClickCount: () => {
		const cat = model.getCurrentCat();
		const clickCount = cat.clickCount > 0 ? cat.clickCount + 1 : 1;
		model.setCatClickCount(cat, clickCount);
		controller.triggerEvent('counterIncremented');
	},

	initEventListeners: () => {
		// Admin form event listeners
		const adminForm = adminView.getForm();
		// form submitted, update cat data with form data
		adminForm.addEventListener('submit', event => {
			event.preventDefault();
			adminView.handleSubmit(adminForm, controller.updateCurrentCat);
		});

		// Cat list event listeners
		const catList = listView.getList();
		// cat clicked, load corresponding cat
		catList.addEventListener('click', event => {
			const el = event.target;
			if(el.tagName.toUpperCase() == 'LI') {
				controller.loadCat(el.dataset.catid);
			}
		});

		// Cat Section event listeners
		const catSection = catView.getCatSection();
		// image is clicked, update clickCount
		catSection.addEventListener('click', event => {
			if(event.target.tagName.toUpperCase() == 'IMG') {
				controller.handleClickCount();
			}
		});

		// General event listners
		// new cat loaded
		document.addEventListener('loadCat', () => {
			const cat = model.getCurrentCat();
			// re-render cat view
			catView.render(cat);
			// update admin form data with new cat
			adminView.updateFormData(adminForm, cat);
		});
		// counter incremented
		document.addEventListener('counterIncremented', () => {
			const cat = model.getCurrentCat();
			// update cat view counter
			catView.updateCounter(cat.clickCount);
			// update admin view with new cat data
			adminView.updateCounter(adminForm, cat);
		});
	},

	// Given cat id, loads cat into cat view
	loadCat: catId => {
		model.setCurrentCatId(catId);
		controller.triggerEvent('loadCat');
	},

	triggerEvent: event => {
		document.dispatchEvent(new Event(event));
	},

	// Syncs current cat with cat data
	// triggers views to re-render with new data
	updateCurrentCat: newCat => {
		const currentCatId = model.getCurrentCatId();
		model.updateCat(currentCatId, newCat);
		// list view only updates when cat changed
		const cats = model.getAllCats();
		listView.render(cats);
		controller.triggerEvent('loadCat');
	}
}

// Environment check for node
if (typeof module !== 'undefined' && module.exports) {
	module.exports.adminView = adminView;
	module.exports.catView = catView;
	module.exports.listView = listView;
	module.exports.model = model;
	module.exports.utils = utils;
}
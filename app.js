const utils = {
	// Returns form data object
	getFormData: form => {
		const els = this.form.children;
		return Array.from(els).reduce( (data, el) => {
			if(el.name) {
				data[el.name] = el.value;
			}
			return data;
		}, {});
	}
}

// Admin to edit current cat info
const adminView = {
	init: () => {
		this.adminSection = document.getElementById('admin-section');
		this.adminSection.addEventListener('click', () => {
			if(event.target.classList.contains('admin-toggle')) {
				adminView.toggle();
			}
		});
		this.form = document.forms.namedItem('admin-form');
		this.form.addEventListener('submit', adminView.handleSubmit);
		document.addEventListener('loadCat', adminView.updateFormData);
		document.addEventListener('counterIncremented', adminView.updateCounter);
	},

	handleSubmit: event => {
		event.preventDefault();
		controller.updateCurrentCat(utils.getFormData(this.form));
		adminView.toggle();
	},

	toggle: () => {
		this.adminSection.classList.toggle('active');
	},

	// Syncs clickCount input with current cat clickCount
	updateCounter: () => {
		const counter = Array.from(this.form.children)
			.filter( input => input.name == 'clickCount' )[0];
		const cat = model.getCurrentCat();
		counter.value = cat.clickCount;
	},

	// Syncs form with cat object data
	updateFormData: () => {
		const els = this.form.children;
		let el;
		const cat = model.getCurrentCat();
		for(let i = 0; i < els.length; i++) {
			el = els[i];
			if(el.name) {
				el.value = cat[el.name];
			}
		}
	}
}

// Cat listing (ul) View
const listView = {
	init: () => {
		this.catList = document.getElementById('cat-list');
		listView.render();
	},

	render: () => {
		this.catList.innerHTML = "";
		const fragment = document.createDocumentFragment();
		model.getAllCats().forEach((cat, i) => {
			const li = document.createElement('li');
			li.textContent = cat.name;
			li.addEventListener('click', () => {
				controller.loadCat(i);
			})
			fragment.appendChild(li);
		})
		this.catList.appendChild(fragment);
		this.catList.children = this.catList.children[0];
	}
}

// Main Cat view
const catView = {
	init: () => {
		this.catSection = document.getElementById('cat-section');
		this.img = this.catSection.getElementsByClassName('cat-image')[0];
		this.img.addEventListener('click', event => {
			controller.handleClickCount();
		})
		this.title = this.catSection.getElementsByClassName('cat-title')[0];
		this.counter = this.catSection.getElementsByClassName('click-count')[0];
		document.addEventListener('loadCat', catView.render);
		document.addEventListener('counterIncremented', catView.updateCounter);
	},

	render: () => {
		const cat = model.getCurrentCat();
		this.img.src = cat.image;
		this.title.textContent = cat.name;
		catView.updateCounter();
	},

	// Syncs current cat clickCount display with cat clickCount
	updateCounter: () => {
		const cat = model.getCurrentCat();
		this.counter.textContent = cat.clickCount;
	},
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
		if(Number.isInteger(this.data.currentCatId)) {
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
		model.init(data);
		model.setCurrentCatId(0);
		adminView.init();
		listView.init();
		catView.init();
		controller.triggerEvent('loadCat');
	},

	handleClickCount: () => {
		const cat = model.getCurrentCat();
		const clickCount = cat.clickCount > 0 ? cat.clickCount + 1 : 1;
		model.setCatClickCount(cat, clickCount);
		controller.triggerEvent('counterIncremented');
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
		listView.render();
		controller.triggerEvent('loadCat');
	}
}

// Environment check for node
if (typeof module !== 'undefined' && module.exports) {
	module.exports.model = model;
}
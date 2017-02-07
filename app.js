+function() {
	const utils = {
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

	const catData = {
		currentCat: null,
		cats: [
			{
				name: 'Spencer',
				image: 'http://thecatapi.com/api/images/get.php?id=4e2',
				clickCount: 0
			},
			{
				name: 'Fluffykins',
				image: 'http://thecatapi.com/api/images/get.php?id=7me',
				clickCount: 0
			},
			{
				name: 'Buttons',
				image: 'http://thecatapi.com/api/images/get.php?id=ec4',
				clickCount: 0
			},
			{
				name: 'George',
				image: 'http://thecatapi.com/api/images/get.php?id=cmk',
				clickCount: 0
			}
		]
	}

	const adminView = {
		init: () => {
			this.adminSection = document.getElementById('admin-section');
			this.adminSection.addEventListener('click', event => {
				if(event.target.classList.contains('admin-toggle')) {
					adminView.toggle();
				}
			})
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

		updateCounter: () => {
			const counter = Array.from(this.form.children).filter( input => input.name == 'clickCount' )[0];
			const cat = controller.getCurrentCat();
			counter.value = cat.clickCount;
		},

		updateFormData: () => {
			const els = this.form.children;
			let el;
			const cat = controller.getCurrentCat();
			for(let i = 0; i < els.length; i++) {
				el = els[i];
				if(el.name) {
					el.value = cat[el.name];
				}
			}
		}
	}

	const listView = {
		init: () => {
			this.catList = document.getElementById('cat-list');
			listView.render();
		},

		render: () => {
			this.catList.innerHTML = "";
			const fragment = document.createDocumentFragment();
			controller.getCats().forEach((cat, i) => {
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

	const catView = {
		init: () => {
			this.catSection = document.getElementById('cat-section');
			this.img = this.catSection.getElementsByClassName('cat-image')[0];
			this.img.addEventListener('click', event => {
				controller.incrementClickCount();
			})
			this.title = this.catSection.getElementsByClassName('cat-title')[0];
			this.counter = this.catSection.getElementsByClassName('click-count')[0];
			document.addEventListener('loadCat', catView.render);
			document.addEventListener('counterIncremented', catView.updateCounter);
		},

		render: () => {
			const cat = controller.getCurrentCat();
			this.img.src = cat.image;
			this.title.textContent = cat.name;
			catView.updateCounter();
		},

		updateCounter: () => {
			const cat = controller.getCurrentCat();
			this.counter.textContent = cat.clickCount;
		},
	}

	const controller = {
		init: () => {
			controller.setCurrentCat(0);
			adminView.init();
			listView.init();
			catView.init();
			controller.triggerData('loadCat');
		},

		getCats: () => 
			catData.cats,

		getCurrentCat: () => 
			catData.cats[catData.currentCat],

		loadCat: cat => {
			controller.setCurrentCat(cat);
			controller.triggerData('loadCat');
		},

		incrementClickCount: () => {
			const cat = controller.getCurrentCat();
			cat.clickCount++;
			controller.triggerData('counterIncremented');
		},

		setCurrentCat: cat => 
			catData.currentCat = cat,

		triggerData: event => {
			document.dispatchEvent(new Event(event));
		},

		updateCurrentCat: newCat => {
			catData.cats[catData.currentCat] = newCat;
			listView.render();
			controller.triggerData('loadCat');
		}
	}

	controller.init();
	
}();
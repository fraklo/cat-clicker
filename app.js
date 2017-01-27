+function() {
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

	const listView = {
		render: () => {
			const fragment = document.createDocumentFragment();
			controller.getCats().forEach((cat, i) => {
				const li = document.createElement('li');
				li.textContent = cat.name;
				li.addEventListener('click', () => {
					controller.loadCat(i);
				})
				fragment.appendChild(li);
			})
			const catList = document.getElementById('cat-list');
			catList.appendChild(fragment);
		}
	}

	const catView = {
		init: () => {
			this.catShow = document.getElementById('cat-show');
			this.img = this.catShow.getElementsByClassName('cat-image')[0];
			this.img.addEventListener('click', event => {
				controller.incrementClickCount();
			})
			this.title = this.catShow.getElementsByClassName('cat-title')[0];
			this.counter = this.catShow.getElementsByClassName('click-count')[0];
			catView.render();
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
			listView.render();
			catView.init();
		},

		getCats: () => 
			catData.cats,

		getCurrentCat: () => 
			catData.cats[catData.currentCat],

		loadCat: cat => {
			controller.setCurrentCat(cat);
			catView.render();
		},

		incrementClickCount: () => {
			const cat = controller.getCurrentCat();
			cat.clickCount++;
			catView.updateCounter();
		},

		setCurrentCat: cat => 
			catData.currentCat = cat
	}

	controller.init();
	
}();
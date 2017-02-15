var app = app || {};

+function() {

	app.controller = function() {
		let data;
		let adminSection;
		let catList;
		let catSection;
		const { model,
					 listView,
					 catView,
					 adminView,
					 utils } = app;
		return {
			init: modelData => {
				data = model.validateData(modelData);
				model.setCurrentCatId(0, data);

				const mainEl = document.getElementById('app');
				const cats = model.getAllCats(data);

				catList = listView.createCatList(cats);
				mainEl.appendChild(catList);

				catSection = catView.createCatSection();
				mainEl.appendChild(catSection);

				adminSection = adminView.createAdminSection();
				mainEl.appendChild(adminSection);

				app.controller.initEventListeners();
				app.controller.triggerEvent('catUpdated');
			},

			// Handlers
			// admin toggle button clicked, toggle admin view
			handleAdminSectionClick: event => {
				if(event.target.classList.contains('admin-toggle')) {
					adminView.toggleView(adminSection);
				}
			},

			// admin form submitted, update cat data with form data
			handleAdminSectionSubmit: adminForm => {
				const formData = utils.getFormData(adminForm);
				app.controller.updateCurrentCat(formData);
				adminView.handleSubmit(adminSection);
			},

			// cat list item clicked, load corresponding cat
			handleCatListClicked: event => {
				const el = event.target;
				if(el.tagName.toUpperCase() == 'LI') {
					app.controller.loadCat(el.dataset.catid);
				}
			},

			// new cat loaded, update catView and admin form data
			handleCatLoaded: adminForm => {
				const cat = model.getCurrentCat(data);
				// re-render cat view
				catView.render(cat, catSection);
				// update admin form data with new cat
				utils.setFormData(adminForm, cat);
			},

			// cat image clicked, update clickCount
			handleCatSectionClicked: event => {
				if(event.target.tagName.toUpperCase() == 'IMG') {
					const cat = model.getCurrentCat(data);
					const clickCount = Number.parseInt(cat.clickCount) + 1;
					model.setCatClickCount(cat, clickCount);
					app.controller.triggerEvent('counterIncremented');
				}
			},

			// cat data updated, re-render all the things
			handleCatUpdated: () => {
				const cats = model.getAllCats(data);
				listView.render(cats, catList);
				// re-use render calls from catLoaded
				app.controller.triggerEvent('catLoaded');
			},

			// counter updated, update catview & admin counters
			handleCounterIncremented: adminForm => {
				const cat = model.getCurrentCat(data);
				// update cat view counter
				catView.setCatSectionCount(catSection, cat.clickCount);
				// update admin view with new cat data
				adminView.setAdminFormCount(adminForm, cat.clickCount);
			},

			initEventListeners: () => {
				// grab admin form for quick reference to pass to some functions
				const adminForm = adminSection.getElementsByTagName('form')[0];

				// Admin section event listeners
				adminSection.addEventListener('click',
					app.controller.handleAdminSectionClick);

				adminSection.addEventListener('submit', event => {
					event.preventDefault();
					app.controller.handleAdminSectionSubmit(adminForm);
				});

				// Cat list event listeners
				catList.addEventListener('click', app.controller.handleCatListClicked);

				// Cat Section event listeners
				catSection.addEventListener('click', app.controller.handleCatSectionClicked);

				// General event listners
				document.addEventListener('counterIncremented', () =>
					app.controller.handleCounterIncremented(adminForm) );

				document.addEventListener('catLoaded', () =>
					app.controller.handleCatLoaded(adminForm) );

				document.addEventListener('catUpdated', app.controller.handleCatUpdated);
			},

			// Given cat id, loads cat into cat view
			loadCat: catId => {
				model.setCurrentCatId(catId, data);
				app.controller.triggerEvent('catLoaded');
			},

			triggerEvent: event => {
				document.dispatchEvent(new Event(event));
			},

			// Syncs current cat with cat data
			updateCurrentCat: newCatdata => {
				model.syncNewCatData(newCatdata, data);
				app.controller.triggerEvent('catUpdated');
			}
		}
	}();
}();

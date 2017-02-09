const expect = require('chai').expect;
const jsdom = require('jsdom').jsdom;
const app = require('../app');
require('jsdom-global')();

describe('catView', () => {
	const catView = app.catView;
	let document;
	let mainApp;
	beforeEach(() => {
		document = jsdom("<div id='app'></div>").defaultView.document
		mainApp = document.getElementById('app');
		catView.init(mainApp);
	});

	describe('init', () => {
		it('should create cat section', () => {
			const catSection = mainApp.querySelectorAll('#cat-section');
			expect(catSection.length).to.be.equal(1);
		});
	});

	describe('createCatSection', () => {
		const catSection = catView.createCatSection();
		it('should create cat section el', () => {
			const catSectionEl = mainApp.querySelector('#cat-section');
			expect(catSection.innerHTML).to.be.equal(catSectionEl.innerHTML);
		});

		it('should create cat-title el', () => {
			const catTitle = catSection.querySelectorAll('.cat-title');
			expect(catTitle.length).to.equal(1);
		});

		it('should create img el', () => {
			const img = catSection.querySelectorAll('img');
			expect(img.length).to.equal(1);
		});

		it('should create clickCount el', () => {
			const clickCount = catSection.querySelectorAll('.click-count');
			expect(clickCount.length).to.equal(1);
		});
	});

	describe('getCatSection', () => {
		it('should return the cat section html el', () => {
			const catSection = catView.getCatSection();
			const catSectionEl = mainApp.querySelector('#cat-section');
			expect(catSection).to.deep.equal(catSectionEl);
		});
	});

	describe('render', () => {
		beforeEach(() =>
			catView.render({ name:"", image:"", clickCount:""})
		);
		const cat = {
			name: "fluffy",
			image: "http://thecatapi.com/",
			clickCount: 3
		};

		it('should set cat-name to cat name', () => {
			const catTitle = mainApp.querySelector('.cat-title');
			catView.render(cat);
			expect(catTitle.textContent).to.be.equal('fluffy');
		});

		it('should set img tag src to cat image', () => {
			const img = mainApp.querySelector('img');
			catView.render(cat);
			expect(img.src).to.be.equal(cat.image);
		});

		it('should set click-count to cat clickCount', () => {
			const clickCount = mainApp.querySelector('.click-count');
			catView.render(cat);
			expect(clickCount.textContent).to.be.equal('3');
		});

		it('should throw error "Requires valid cat object" if no object', () => {
			const error = () => catView.render();
			expect(error).to.throw('Requires valid cat object');
		});
	});

	describe('updateCounter', () => {
		it('should update click to cat clickCount', () => {
			const clickCount = mainApp.querySelector('.click-count');
			catView.updateCounter(8);
			expect(clickCount.textContent).to.be.equal('8');
			catView.updateCounter(2);
			expect(clickCount.textContent).to.be.equal('2');
		});
	});
	
});
const expect = require('chai').expect;
const jsdom = require('jsdom').jsdom;
const app = require('../js/catView');
require('jsdom-global')();

describe('catView', () => {
	const catView = app.catView;

	describe('createCatSection', () => {
		const catSection = catView.createCatSection();

		it('should create and return catSection', () => {
			expect(catSection.id).to.equal('cat-section');
		});

		it('should set id and class for catSection', () => {
			expect(catSection.id).to.equal('cat-section');
			expect(catSection.className).to.equal('section');
		});

		it('should contain el set to catSection.catName with class cat-name', () => {
			const el = catSection.querySelector('.cat-name');
			expect(el.className).to.be.equal('cat-name');
			expect(catSection.catName).to.be.equal(el);
		});

		it('should contain el set to catSection.img with class cat-image', () => {
			const el = catSection.querySelector('.cat-image');
			expect(el.className).to.be.equal('cat-image');
			expect(catSection.img).to.be.equal(el);
		});

		it('should contain el set to catSection.clickCount with class click-count', () => {
			const el = catSection.querySelector('.click-count');
			expect(el.className).to.be.equal('click-count');
			expect(catSection.clickCount).to.be.equal(el);
		});
	});

	describe('render', () => {
		const catSection = catView.createCatSection();
		const catData = {
			name: "Steve",
			image: "http://rando-image.com/",
			clickCount: '9'
		};
		catView.render(catData, catSection);

		it('should set catName el content to catData.name', () => {
			expect(catSection.catName.textContent).to.be.equal(catData.name);
		});

		it('should set img el src to catData.image', () => {
			expect(catSection.img.src).to.be.equal(catData.image);
		});

		it('should set clickCount el content to catData.clickCount', () => {
			expect(catSection.clickCount.textContent).to.be.equal(catData.clickCount);
		});
	});

	describe('setCatSectionCount', () => {
		it('should set cat section count to given count', () => {
			const catSection = catView.createCatSection();
			expect(catSection.clickCount.textContent).to.be.equal('');
			catView.setCatSectionCount(catSection, 5);
			expect(catSection.clickCount.textContent).to.be.equal('5');
		});
	});

});
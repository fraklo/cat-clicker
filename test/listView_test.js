const expect = require('chai').expect;
const jsdom = require('jsdom').jsdom;
const app = require('../js/listView');
require('jsdom-global')();

describe('listView', () => {
	const listView = app.listView;
	
	describe('createCatList', () => {
		const catList = listView.createCatList();

		it('should create and return catList', () => {
			expect(catList.id).to.equal('cat-list');
		});

		it('should set id and class for catSection', () => {
			expect(catList.id).to.equal('cat-list');
			expect(catList.className).to.equal('section');
		});
	});

	describe('render', () => {
		const catList = listView.createCatList();
		const cats = [
			{ name: 'Spencer' },
			{ name: 'Fluffykins' }
		];

		it('should not append more cats on render', () => {
			// Initial render
			listView.render(cats, catList);
			expect(catList.children.length).to.equal(2);
			// Secondary render call
			listView.render(cats, catList);
			// lenght should still be 2
			expect(catList.children.length).to.equal(2);
		});

		it('should render lis with cat names', () => {
			listView.render(cats, catList);
			const catNames = ['Spencer', 'Fluffykins'];
			const catLiMap = [...catList.children].map(
				li => li.textContent 
			);
			expect(catLiMap).to.deep.equal(catNames);
		});

		it('should update lis with new cat info', () => {
			const newCats = [
				{ name: 'Steve' },
				{ name: 'Buttons' },
				{ name: 'George' }
			];
			listView.render(newCats, catList);
			const catNames = ['Steve', 'Buttons', 'George'];
			const catLiMap = [...catList.children].map(
				li => li.textContent 
			);
			expect(catLiMap).to.deep.equal(catNames);
			expect(catList.children.length).to.be.equal(3);
		});

	});
});
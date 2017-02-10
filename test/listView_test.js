const expect = require('chai').expect;
const jsdom = require('jsdom').jsdom;
const app = require('../app');
require('jsdom-global')();

describe('listView', () => {
	const listView = app.listView;
	const document = jsdom("<div id='app'></div>").defaultView.document;
	const mainApp = document.getElementById('app');
	const cats = [
		{ name: 'Spencer' },
		{ name: 'Fluffykins' }
	];
	listView.init(mainApp, cats);
	const list = mainApp.querySelector('ul');

	describe('init', () => {
		it('should create cat-list with cats', () => {
			const catList = mainApp.querySelectorAll('#cat-list');
			expect(catList.length).to.be.equal(1);

			const catLis = mainApp.querySelectorAll('li');
			expect(catLis.length).to.equal(2);
		});

	});

	describe('render', () => {
		it('should not append more cats on render', () => {
			listView.render(cats);
			const catLis = mainApp.querySelectorAll('li');
			expect(catLis.length).to.equal(2);
		});

		it('should render lis with cat names', () => {
			listView.render(cats);
			const catNames = ['Spencer', 'Fluffykins'];
			const catLiMap = [...mainApp.querySelectorAll('li')]
				.map( li => li.textContent );
			expect(catLiMap).to.deep.equal(catNames);
		});

		it('should update lis with new cat info', () => {
			listView.render([
				{ name: 'Buttons' },
				{ name: 'George' }
			]);
			const catNames = ['Buttons', 'George'];
			const catLiMap = [...mainApp.querySelectorAll('li')]
				.map( li => li.textContent );
			expect(catLiMap).to.deep.equal(catNames);
		});

	});
});
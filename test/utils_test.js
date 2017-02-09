const expect = require('chai').expect;
const jsdom = require('jsdom').jsdom;
const app = require('../app');

describe('utils', () => {
	const utils = app.utils;
	let document;
	beforeEach(() => {
		document = jsdom(
			`<form class='form'>
				<input type="text" name="first_name" value="first" />
				<input type="text" name="last_name" value="last" />
				<input type="number" name="count" value="count" />
			</form>`).defaultView.document;
	});

	describe('getFormData', () => {
		it('should return all data in form', () => {
			const form = document.forms[0];
			const formData = utils.getFormData(form);
			expect(formData).to.deep.equal({
				first_name: "first",
				last_name: "last",
				count: "count"
			});
		});

		it('should throw error on no form object', () => {
			const error = () => utils.getFormData();
			expect(error).to.throw('Requires valid form object');
		});

		it('should return empty object if form empty', () => {
			const emptyDocument = jsdom(
				`<form class='form'></form>`).defaultView.document;
			const emptyForm = emptyDocument.forms[0];
			const formData = utils.getFormData(emptyForm);
			expect(formData).to.deep.equal({});
		});
	});

	describe('setFormData', () => {
		let doc;
		before(() => {
			const document = jsdom(
				`<form class='form'>
					<input type="text" name="first_name" value="first" />
					<input type="text" name="last_name" value="last" />
					<input type="number" name="count" value="count" />
				</form>`
			);
			doc = document.defaultView.document;
		});

		it('should set form inputs based on object data', () => {
			const data = { 
				first_name: "John",
				last_name: "Doe",
				count: "3"
			};
			const form = doc.forms[0];
			utils.setFormData(form, data);
			const formData = utils.getFormData(doc.forms[0]);
			expect(formData).to.deep.equal(data);
		});

		it('should only update data present in object and form', () => {
			const data = { 
				first_name: "Joe",
				test: "3"
			};
			const form = doc.forms[0];
			utils.setFormData(form, data);
			const formData = utils.getFormData(doc.forms[0]);
			expect(formData).to.deep.equal({ 
				first_name: "Joe",
				last_name: "Doe",
				count: "3"
			});
		});
	});
	
});
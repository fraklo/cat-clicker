const expect = require('chai').expect;
const jsdom = require('jsdom').jsdom;
const app = require('../app');

describe('utils', () => {
	const utils = app.utils;

	describe('getFormData', () => {
		const getFormData = utils.getFormData;
		const document = jsdom(
			`<form class='form'>
				<input type="text" name="first_name" value="first" />
				<input type="text" name="last_name" value="last" />
				<input type="number" name="count" value="count" />
			</form>`
		);
		const doc = document.defaultView.document;

		it('should return all data in form', () => {
			const form = doc.forms[0];
			const formData = getFormData(form);
			expect(formData).to.deep.equal({
				first_name: "first",
				last_name: "last",
				count: "count"
			});
		});

		it('should throw error on no form object', () => {
			const error = () => getFormData();
			expect(error).to.throw('Requires valid form object');
		});

		it('should return empty object if form empty', () => {
			const emptyForm = jsdom(`<form class='form'></form>`);
			const emptyDoc = emptyForm.defaultView.document;
			const form = emptyDoc.forms[0];
			const formData = getFormData(form);
			expect(formData).to.deep.equal({});
		});
	});

	describe('setFormData', () => {
		const setFormData = utils.setFormData;
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
			setFormData(form, data);
			const formData = utils.getFormData(doc.forms[0]);
			expect(formData).to.deep.equal(data);
		});

		it('should only update data present in object and form', () => {
			const data = { 
				first_name: "Joe",
				test: "3"
			};
			const form = doc.forms[0];
			setFormData(form, data);
			const formData = utils.getFormData(doc.forms[0]);
			expect(formData).to.deep.equal({ 
				first_name: "Joe",
				last_name: "Doe",
				count: "3"
			});
		});
	});
});
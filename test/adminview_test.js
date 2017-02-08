const expect = require('chai').expect;
const jsdom = require('jsdom').jsdom;
const app = require('../app');
require('jsdom-global')();

describe('adminView', () => {
	const adminView = app.adminView;
	const document = jsdom("<div id='app'></div>").defaultView.document;
	const mainApp = document.getElementById('app');
	adminView.init(mainApp);
	const form = mainApp.querySelector('form');

	describe('init', () => {
		it('should create admin section with form', () => {
			const adminSection = mainApp.querySelectorAll('#admin-section');
			expect(adminSection.length).to.be.equal(1);

			const form = mainApp.querySelectorAll('form');
			expect(form.length).to.equal(1);
			expect(form[0].name).to.equal('admin-form');
		});

		it('should add admin toggle event listeners', () => {
			const toggle = mainApp.querySelector('.admin-toggle');
			const adminSection = mainApp.querySelector('#admin-section');
			expect(adminSection.classList.contains('active')).to.be.false;
			toggle.click();
			expect(adminSection.classList.contains('active')).to.be.true;
		});
	});

	describe('getForm', () => {
		it('should return adminForm', () => {
			const adminForm = adminView.getForm();
			expect(adminForm).to.deep.equal(form);
		});
	});

	describe('handleSubmit', () => {
		it('should execute update function on data', () => {
			// var to assert whether update function ran
			let newData;
			// stub update function
			const update = data => {
				newData = data;
			};
			adminView.handleSubmit(form, update);	
			expect(newData).to.deep.equal({
				clickCount: '',
				image: '',
				name: ''
			});
		});

		it('should remove active class on submit', () => {
			form.classList.add('active');
			adminView.handleSubmit(form, () => false);	
			expect(form.className).to.be.equal('');
		});

		it('should throw error if 2nd param is not function', () => {
			const error = () => adminView.handleSubmit(form, {});
			expect(error).to.throw('update is not a function');
		});
	});

	describe('toggleView', () => {
		it('should toggle element active class', () => {
			adminView.toggleView(form);
			expect(form.className).to.be.equal('active');
			adminView.toggleView(form);
			expect(form.className).to.be.equal('');
		});
	});

	describe('updateCounter', () => {
		let cat = {
			clickCount: '0'
		};
		const clickCount = form.querySelector('[name=clickCount]');

		it('should set clickCount input to 0', () => {
			adminView.updateCounter(form, cat);
			expect(clickCount.value).to.be.equal('0');
		});

		it('should update clickCount input to 2', () => {
			cat.clickCount = '2';
			adminView.updateCounter(form, cat);
			expect(clickCount.value).to.be.equal('2');
		});
	});
	
	describe('updateFormData', () => {
		let document;
		let form;
		let data;
		beforeEach(() => {
			data = {
				clickCount: '3',
				name: 'Steve'
			};
			document = jsdom(
				`<div id='admin-section'>
					<form name='admin-form'>
						<input name='clickCount' type='number' value='' />
						<input name='name' type='number' value='Joe' />
					</form>
				</div>`
			).defaultView.document;
			 form = document.forms[0];
		});

		it('should handle zero value', () => {
			data.clickCount = 0;
			adminView.updateFormData(form, data);
			const formData = app.utils.getFormData(form);
			expect(formData).to.deep.equal({
				clickCount: '0',
				name: 'Steve'
			});
		});
		
		it('should set form data to match object data', () => {
			adminView.updateFormData(form, data);
			const formData = app.utils.getFormData(form);
			expect(formData).to.deep.equal(data);
		});

		it('should ignore data not found in form', () => {
			data.things = 3;
			adminView.updateFormData(form, data);
			const formData = app.utils.getFormData(form);
			expect(formData).to.deep.equal({
				clickCount: '3',
				name: 'Steve'
			});
		});

		it('should handle empty object', () => {
			adminView.updateFormData(form, {});
			const formData = app.utils.getFormData(form);
			expect(formData).to.deep.equal({
				clickCount: '',
				name: 'Joe'
			});
		});
	});

});
const expect = require('chai').expect;
const jsdom = require('jsdom').jsdom;
const app = require('../js/adminView');
require('jsdom-global')();

describe('adminView', () => {
	const adminView = app.adminView;
	
	describe('createAdminSection', () => {
		const adminSection = adminView.createAdminSection();
		
		it('should create and return adminSection', () => {
			expect(adminSection.id).to.equal('admin-section');
		});

		it('should set id and class for adminSection', () => {
			expect(adminSection.id).to.equal('admin-section');
			expect(adminSection.className).to.equal('section');
		});

		it('should contain form with name "admin-form"', () => {
			const form = adminSection.getElementsByTagName('form')[0];
			expect(form.name).to.be.equal('admin-form');
		});

		it('should contain input with name "name" and class "admin-input"', () => {
			const input = adminSection.querySelector('input[name=name]');
			expect(input.className).to.be.equal('admin-input');
		});

		it('should contain input with name "image" and class "admin-input"', () => {
			const input = adminSection.querySelector('input[name=image]');
			expect(input.className).to.be.equal('admin-input');
		});

		it('should contain input with name "clickCount" and class "admin-input"', () => {
			const input = adminSection.querySelector('input[name=clickCount]');
			expect(input.className).to.be.equal('admin-input');
		});
	});

	describe('handleSubmit', () => {
		it('should remove active class on submit', () => {
			const adminSection = adminView.createAdminSection();
			adminSection.classList.add('active');
			expect(adminSection.classList.contains('active')).to.be.true;
			adminView.handleSubmit(adminSection);
			expect(adminSection.classList.contains('active')).to.be.false;
		});
	});

	describe('toggleView', () => {
		it('should toggle element active class', () => {
			const adminSection = adminView.createAdminSection();
			adminView.toggleView(adminSection);
			expect(adminSection.classList.contains('active')).to.be.true;
			adminView.toggleView(adminSection);
			expect(adminSection.classList.contains('active')).to.be.false;
		});
	});

	describe('setAdminFormCount', () => {
		it('should set form count to given count', () => {
			const adminSection = adminView.createAdminSection();
			const form = adminSection.getElementsByTagName('form')[0];
			const formCount = form.querySelector('[name=clickCount]');
			expect(formCount.value).to.be.equal('');
			adminView.setAdminFormCount(form, 5);
			expect(formCount.value).to.be.equal('5');
			adminView.setAdminFormCount(form, 12);
			expect(formCount.value).to.be.equal('12');
		});
	});

});
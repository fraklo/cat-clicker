var app = app || {};

+function() {
	"use strict";
	// Admin to edit current cat info
	app.adminView = {
		createAdminSection: () => {
			const html = `
				<button class="admin-toggle">Admin</button>
				<div class="admin-wrapper">
					<form name="admin-form">
						<input type="text" name="name" class="admin-input" />
						<input type="text" name="image" class="admin-input" />
						<input type="number" name="clickCount" class="admin-input" />
						<button type="button" class="admin-toggle">Cancel</button>
						<button type="Submit">Submit</button>
					</form>
				</div>`;
			const adminSection = document.createElement('div');
			adminSection.id = 'admin-section';
			adminSection.className = 'section';
			adminSection.innerHTML = html;
			return adminSection;
		},

		handleSubmit: adminSection =>
			adminSection.classList.remove('active'),

		toggleView: el =>
			el.classList.toggle('active'),

		// Syncs clickCount input with current cat clickCount
		setAdminFormCount: (form, count) => {
			const counter = form.querySelector('[name=clickCount]');
			counter.value = count;
		}
	}

}();

// Environment check for node
if (typeof module !== 'undefined' && module.exports) {
	module.exports.adminView = app.adminView;
}
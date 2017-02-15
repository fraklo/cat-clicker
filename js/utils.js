var app = app || {};

+function() {
	"use strict";

	app.utils = {
		// Returns form data object
		getFormData: form => {
			if(typeof form !== 'object' || !form.children) 
				throw new Error('Requires valid form object');
			// create array from form children
			const elsArray = [...form.children];
			return elsArray.reduce( (data, el) => {
				if(el.name) {
					// if element has name add property to object with element value
					data[el.name] = el.value;
				}
				return data;
			}, {});
		},

		// Given data, updates form
		setFormData: (form, data) => {
			if(typeof form !== 'object' || !form.children) 
				throw new Error('Requires valid form object');
			if(typeof data !== 'object') throw new Error('Requires valid data object');
			// create array from form children
			const elsArray = [...form.children];
			elsArray.map( el => {
				// if data property exists ensure string value for inputs
				let val = data[el.name] === undefined ? '' : `${data[el.name]}`;
				if(el.name && val) {
					// data contains value for input
					el.value = data[el.name];
				}
			});
		}
	}

}();


// Environment check for node
if (typeof module !== 'undefined' && module.exports) {
	module.exports.utils = app.utils;
}
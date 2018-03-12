function GlobalMenuView() {
	this.context = {};
	this.currentModel = null;
	this.init = function(model) {      
		this.currentModel = model;
	}
	
	this.update = function() {
		this.compileTemplate('#menuCategoriesTemplate', '#menuCategories .row');
		this.compileTemplate('#categoryMealsTemplate', '#categoryMeals');
	}
	this.compileTemplate = function(tmpl, container) {
		let source = $(tmpl).html();
		let template = Handlebars.compile(source);
		this.context.categories = this.currentModel.categories;
		let html = template(this.context);
		$(container).empty();
		$(container).append(html);
	}
}

/* function CategoriesMenuView() {
	this.currentHash = window.location.hash; 
	this.context = {};
	this.currentModel = null;
	this.init = function(model) {      
		this.currentModel = model;
	}
	
	this.update = function() {
		this.source = $('#categoryMealsTemplate').html();
		this.template = Handlebars.compile(this.source);
		this.context.category = this.currentModel.categories[this.currentModel.hashCategories[this.currentHash]];
		this.html = this.template(this.context);
		$('#categoryMeals').empty(this.html);
		$('#categoryMeals').append(this.html);
	}
} */
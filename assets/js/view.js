function GlobalMenuView() {
	this.context = {};
	this.currentModel = null;
	this.init = function(model) {      
		this.currentModel = model;
	}
	
	this.update = function() {
		this.source = $('#globalMenu').html();
		this.template = Handlebars.compile(this.source);
		this.context.categories = this.currentModel.categories;
		this.html = this.template(this.context);
		$('#menuCategories .row').append(this.html);
	}
}
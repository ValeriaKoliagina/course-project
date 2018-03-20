function GlobalMenuView() {
	this.context = {};
	this.currentModel = null;
	this.init = function(model) {      
		this.currentModel = model;
	}
	
	this.update = function() {
		this.compileTemplate('#menuCategoriesTemplate', '#menuCategories .row');
		this.compileTemplate('#categoryMealsTemplate', '#categoryMeals');
/* 		this.compileTemplate('#modalMenuTemplate', '#modalMenu'); */
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

// view для официанта
	//отрисовка aside при новом заказе
function WaiterView() {
	this.context = {};
	this.currentModel = null;
	this.init = function(model) {      
		this.currentModel = model;
	}
	
	this.update = function() {
		this.compileTemplate('#accordionTemplate', '#accordion');
		$('.accordionMeal').on('click', teideController.chooseMeal);
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
	//отрисовка нового заказа
function OrderWaiterView() {
	this.context = {};
	this.currentModel = null;
	this.init = function(model) {      
		this.currentModel = model;
	}
	
	this.update = function() {
		this.compileTemplate('#guestOrderTemplate', '#guestOrder');
		$('.close').on('click', teideController.deleteItem);
		$('.count').on('change', teideController.countItems);
		$('#table-number').on('change', teideController.saveTable);
		$('#orderTime').on('change', teideController.changeOrderTime);
		$('#messageWaiter').on('change', teideController.saveMessage);
		$('#orderOK').on('click', teideController.makeOrder.bind(teideController));
	}
	this.compileTemplate = function(tmpl, container) {
		let source = $(tmpl).html();
		let template = Handlebars.compile(source);
		this.context.newOrder = this.currentModel.newOrder;
		this.context.tableNums = [1, 2, 3, 4, 5, 6, 7, 8];
		let html = template(this.context);
		$(container).empty();
		$(container).append(html);
	}
}
//все заказы официанта
function ReceivedOrdersWaiterView() {
	this.context = {};
	this.currentModel = null;
	this.init = function(model) {      
		this.currentModel = model;
	}
	
	this.update = function() {
		this.compileTemplate('#orderListWaiterTemplate', '#orderListWaiter');
		$('.fa-pencil-square-o').on('click', teideController.edit);
		$('.buttonDone').on('click', teideController.cleanOrder);
	}
	this.compileTemplate = function(tmpl, container) {
		let source = $(tmpl).html();
		let template = Handlebars.compile(source);
		this.context.receivedOrders = this.currentModel.receivedOrders;
		let html = template(this.context);
		$(container).empty();
		$(container).append(html);
	}
}
//отрисовка Chief
function ChiefView() {
	this.context = {};
	this.currentModel = null;
	this.init = function(model) {      
		this.currentModel = model;
	}
	
	this.update = function() {
		this.compileTemplate('#containerChiefTemplate', '#containerChief');
		$('.takeOrder').on('click', teideController.changeAll);
		$('.inProgress').on('click', teideController.changeAll);
		$('.orderComplited').on('click', teideController.changeAllReverse);
	}
	this.compileTemplate = function(tmpl, container) {
		let source = $(tmpl).html();
		let template = Handlebars.compile(source);
		this.context.receivedOrders = this.currentModel.receivedOrders;
		let html = template(this.context);
		$(container).empty();
		$(container).append(html);
	}
}

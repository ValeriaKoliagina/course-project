//создать класс, который будет наследовать через prototype
																					
function MenuModel() {
	this.globalMenuView = null;

	this.init = function(view) {      
		this.globalMenuView = view;
	}
	this.updateViews = function() {
		this.globalMenuView.update(); 
	}

	this.categories = []; 
		/* [{
			title:
			imgUrl:
			hash:
			nextHash:
			prevHash:
			meals [{name: 
					price:
					weight:},{},{}]
		}]*/
	this.accessToken; 
	this.instanceUrl;
	this.tokenType;

	this.receiveCategories = function() {
		if (this.categories.length === 0) {
			return new Promise((resolve, reject) => {
				$.ajax(this.instanceUrl + '/services/apexrest/Meal/', {
					method: 'get', 
					headers: {
						'Authorization': this.tokenType + ' ' + this.accessToken,
						'Content-Type': 'application/json'
					},
					context: this,
					crossDomain: true,
					beforeSend: function() {
						$('.gif').removeClass('d-none'); 
					},
					success: function(result) { 
						$('.gif').addClass('d-none'); 
						let categories = [];
						$.each((result), function(index, value) { //передали индекс и текущий элемент
							let category = {};
							category.meals = [];
							category.title = value.mealGroupName;
							category.hash = value.mealGroupHash;
							if (index !== result.length - 1) { 
								category.nextHash = result[index + 1].mealGroupHash;
							} else {
								category.nextHash = result[0].mealGroupHash;
							}
							if (index !== 0) { 
								category.prevHash = result[index - 1].mealGroupHash;
							} else {
								category.prevHash = result[result.length - 1].mealGroupHash;
							}
							category.imgUrl = value.mealGroupUrl;
							$.each((value.meals), function(index, value) {
								let meal = {};
								meal.name = value.Meal_Name__c;
								meal.price = value.Price__c;
								meal.weight = value.Meal_Weight__c;
								category.meals.push(meal);
							});
							categories.push(category);
						});
						this.categories = categories;
						this.updateViews();
						resolve(categories);
					} 
				});
			});
		} else {
			return new Promise((resolve, reject) => { //чтобы не загружать данные повторно, которые уже получены
				resolve(this.categories);
			});
		}
	}
}
//waiter
function WaiterModel() {
	this.waiterMenuView = null;
	this.orderMenuView = null;
	this.receivedOrderView = null;
	
	this.init = function(view1, view2, view3) {      
		this.waiterMenuView = view1;
		this.orderMenuView = view2;
		this.receivedOrderView = view3;
	}
	this.updateViews = function() {
		this.waiterMenuView.update(); 
		this.orderMenuView.update();
		this.receivedOrderView.update();
	}

	this.categories = []; 
		/* [{
			title:
			imgUrl:
			hash:
			nextHash:
			prevHash:
			meals [{name: 
					price:
					weight:
					id},{},{}]
		}]*/
	this.accessToken;
	this.instanceUrl;
	this.tokenType;

	this.receiveCategories = function() {
		if (this.categories.length === 0) {
			return new Promise((resolve, reject) => {
				$.ajax(this.instanceUrl + '/services/apexrest/Meal/', {
					method: 'get', 
					headers: {
						'Authorization': this.tokenType + ' ' + this.accessToken,
						'Content-Type': 'application/json'
					},
					context: this,
					crossDomain: true,
					beforeSend: function() {
						$('.gif').removeClass('d-none'); 
					},
					success: function(result) {
						$('.gif').addClass('d-none'); 
						let categories = [];
						$.each((result), function(index, value) { //передали индекс и текущий элемент
							let category = {};
							category.meals = [];
							category.title = value.mealGroupName;
							category.hash = value.mealGroupHash;
							if (index !== result.length - 1) { 
								category.nextHash = result[index + 1].mealGroupHash;
							} else {
								category.nextHash = result[0].mealGroupHash;
							}
							if (index !== 0) { 
								category.prevHash = result[index - 1].mealGroupHash;
							} else {
								category.prevHash = result[result.length - 1].mealGroupHash;
							}
							category.imgUrl = value.mealGroupUrl;
							$.each((value.meals), function(index, value) {
								let meal = {};
								meal.name = value.Meal_Name__c;
								meal.price = value.Price__c;
								meal.weight = value.Meal_Weight__c;
								meal.id = value.Id;
								category.meals.push(meal);
							});
							categories.push(category);
						});
						this.categories = categories;
						resolve(categories);
					} 
				});
			});
		} else {
			return new Promise((resolve, reject) => { //чтобы не загружать данные повторно, которые уже получены
				resolve(this.categories);
			});
		}
	}
	
	this.newOrder = {
		table: '1',
		timeShift: 0,
		orderItems: {}
	};
		/* {
			table:
			timeShift:
			userId: - id официанта
			message
			orderItems {"werwer4335345 - mealId" : {mealName:
					mealId: 
					quantity:
			}, "euyuryuuru": {}, {}}
		}*/
		
		//получить заказы
	this.receivedOrders;
	this.recieveOrders = function() {
		return new Promise((resolve, reject) => {
			let ajaxHandlerScript=this.instanceUrl + '/services/apexrest/Order/' + teideController.user.Id;	
			$.ajax(ajaxHandlerScript, { 
				method:'get', 
				context: this,
				headers: {
					'Authorization': this.tokenType + ' ' + this.accessToken,
					'Content-Type': 'application/json'
				},
				contentType: 'application/json',
				crossDomain: true,
				beforeSend: function() {
					$('.gif').removeClass('d-none'); 
				},
				success: function(result) {
					$('.gif').addClass('d-none'); 
					this.receivedOrders = result;
					resolve(result);
				},
				error: function(error) {
					$('.gif').addClass('d-none');
					reject(error);
				}
			});
		});
	}
	//для Time - чтобы спиннер не было видно
	this.recieveOrdersTime = function() {
		return new Promise((resolve, reject) => {
			let ajaxHandlerScript=this.instanceUrl + '/services/apexrest/Order/' + teideController.user.Id;	
			$.ajax(ajaxHandlerScript, { 
				method:'get', 
				context: this,
				headers: {
					'Authorization': this.tokenType + ' ' + this.accessToken,
					'Content-Type': 'application/json'
				},
				contentType: 'application/json',
				crossDomain: true,
				success: function(result) {
					this.receivedOrders = result;
					resolve(result);
				},
				error: function(error) {
					reject(error);
				}
			});
		});
	}
}

//chief
function ChiefModel() {
	this.chiefMenuView = null;
	
	this.init = function(view) {      
		this.chiefMenuView = view;
	}
	this.updateViews = function() {
		this.chiefMenuView.update(); 
	}

	this.accessToken;
	this.instanceUrl;
	this.tokenType;

	//получить заказы
	this.receivedOrders;
	this.recieveOrders = function() {
		return new Promise((resolve, reject) => {
			let ajaxHandlerScript=this.instanceUrl + '/services/apexrest/Order';	
			$.ajax(ajaxHandlerScript, { 
				method:'get', 
				context: this,
				headers: {
					'Authorization': this.tokenType + ' ' + this.accessToken,
					'Content-Type': 'application/json'
				},
				contentType: 'application/json',
				crossDomain: true,
				beforeSend: function() {
					$('.gif').removeClass('d-none'); 
				},
				success: function(result) {
					$('.gif').addClass('d-none'); 
					this.receivedOrders = result;
					resolve(result);
				},
				error: function(error) {
					$('.gif').addClass('d-none');
					reject(error);
				}
			});
		});
	}
	

}



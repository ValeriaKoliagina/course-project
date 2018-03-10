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
			meals [{name: 
					price:},{},{}]
		}]*/
	this.accessToken; //вопрос - как лучше хранить в контроллере(ссфлка на контроллер) или тут передать или вызывать функцию с параметрами и туда передавать каждый раз? Аааааааааааааааааааааааааааааа!!!
	this.instanceUrl;
	this.tokenType;

	this.receiveCategories = function() {
		return new Promise((resolve, reject) => {
			$.ajax(this.instanceUrl + '/services/apexrest/Meal/', {
				method: 'get', 
				headers: {
					'Authorization': this.tokenType + ' ' + this.accessToken,
					'Content-Type': 'application/json'
				},
				context: this,
				success: function(result) { //можно ли тут записать через стрелочную функцию 
					let categories = [];
					$.each((result), function(index, value) {
						let category = {};
						category.meals = [];
						category.title = value.mealGroupName;
						category.hash = value.mealGroupHash;
						category.imgUrl = value.mealGroupUrl;
						$.each((value.meals), function(index, value) {
							let meal = {};
							meal.name = value.Meal_Name__c;
							meal.price = value.Price__c;
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
	}
}

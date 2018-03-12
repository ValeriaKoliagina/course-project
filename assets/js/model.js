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
	this.accessToken; //вопрос - как лучше хранить в контроллере(ссфлка на контроллер) или тут передать или вызывать функцию с параметрами и туда передавать каждый раз? Аааааааааааааааааааааааааааааа!!!
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
					success: function(result) { //можно ли тут записать через стрелочную функцию 
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

'use strict'

function TeideController() {
	this.accessToken;
	this.instanceUrl;
	this.tokenType;
	this.getToken = function() {
		return new Promise((resolve, reject) => {
			let ajaxHandlerScript='https://sfpxy.herokuapp.com/services/oauth2/token';	
			$.ajax(ajaxHandlerScript, { 
				method:'post', 
				dataType:'json', 
				data: {
					grant_type: 'password',
					client_id: '3MVG9d8..z.hDcPKxoBHrwVfavnMPe8sXCXOUHaqjCgfY2_0zZZWEkAvh8sGvYevncdGi2MBIWdD7hD9upPxv',
					client_secret: '5082174339454021489',
					username: 'dmitry.kolyagin@ts.com',
					password: 'dmitry123'
				},
				crossDomain: true,
				beforeSend: function() {
					$('.gif').removeClass('d-none'); 
				},
				success: function(result) {
					$('.gif').addClass('d-none');
					resolve(result);
				},
				error: function(error) {
					$('.gif').addClass('d-none');
					reject(error);
				}
			});
        });
	}
	this.createModel = function(each, model) {
		this[each] = model;
		this[each].accessToken = this.accessToken;
		this[each].instanceUrl = 'https://sfpxy.herokuapp.com';
		this[each].tokenType = this.tokenType;
	}
	
																						//signin
	this.user;
	this.buttonSignin = $('#buttonSignin');
	this.buttonOut = $('.button-out');
	this.checkboxRememberMe = $('input[type="checkbox"]');
	this.sayHi = function() {
		/* $('#signin span').removeClass('d-none');  */ //зачем удалять класс
		$('.button-out').removeClass('d-none');
		$('.button-enter').addClass('d-none');
		$('.button-reg').addClass('d-none');
		$('.hi-user').html('Добро пожаловать, ' + this.user.First_Name__c);
		this.applyRole();   //есть уже в success
	}
	this.sayBye = function() {
		$('#signin span').addClass('d-none');   
		$('.button-out').addClass('d-none');
		$('.button-enter').removeClass('d-none');
		$('.button-reg').removeClass('d-none');
		$('.hi-user').empty();
		localStorage.removeItem('user');
		localStorage.removeItem('futureOrder');
		this.user = {};
		$('.waiterOrders').addClass('d-none');
		$('.chiefOrders').addClass('d-none');
		$('form[name=formOrder]')[0].reset();
	}
	this.applyRole = function() {
		if (this.user.Role__c === 'Waiter') {
			$('.waiterOrders').removeClass('d-none');
			$('.chiefOrders').addClass('d-none');
		} else if (this.user.Role__c === 'Chief') {
			$('.chiefOrders').removeClass('d-none');
			$('.waiterOrders').addClass('d-none');
		} 
	}
	if (localStorage.getItem('user')) { 
		this.user = JSON.parse(localStorage.getItem('user'));
		this.sayHi();
	}
	this.checkUser = function(e) {
		e.preventDefault(); //чтобы не перезагружалась страница - добавить во все формы (одностраничное приложение)
		return new Promise((resolve, reject) => {
			let ajaxHandlerScript=this.instanceUrl + '/services/apexrest/User/'+ $('#inputEmail').val() + '/' + $('#inputPassword').val();	
			$.ajax(ajaxHandlerScript, { 
				method:'get', 
				headers: { //чтобы сказать кто мы такие
					'Authorization': this.tokenType + ' ' + this.accessToken,
					'Content-Type': 'application/json'
				},
				beforeSend: function(xhr) {
					$('#signin span').addClass('d-none');
					if ((!$('#signin form').valid())) {return;}
				},
				context: this,
				crossDomain: true,
				success: function(result) {
					if (result.length === 0) {
						$('#signin span').removeClass('d-none');
					} else {
						this.user = result[0]; //result - массив объектов, объект - user
						if ($(this.checkboxRememberMe).is(':checked')) {
							localStorage.setItem('user', JSON.stringify(this.user)); //localStorage
						}
						if (this.user.Role__c === 'Waiter') {
							window.location.hash = 'Waiter';
						} else if (this.user.Role__c === 'Chief') {
							window.location.hash = 'Chief';
						} else {
							window.location.hash = 'Main';
						}
						this.sayHi();
																		//чтобы работало без перезагрузки
							futureOrder.name = this.user['First_Name__c'];
							futureOrder.email = this.user['Email__c'];
							futureOrder.phone = this.user['Mobile__c'];
							this.takeDataForOrder();
							
						this.applyRole();
					}
					$('#signin form')[0].reset();
					resolve(result);
				},
				error: function(error) {
					reject(error);
				}
			});
		});
	}
	this.takeDataForOrder = function() {	// "Завязка на signin" - надо для брони столика
		$('#booking input, #booking textarea').each(function(index, value) {
			$(value).val(futureOrder[$(value).attr('id')]);
		});	
	}
	$(this.buttonSignin).on('click', this.checkUser.bind(this)); //this был button, передаем контекст контроллер
	$(this.buttonOut).on('click', this.sayBye.bind(this));
	
	//signup
	this.buttonSignup = $('#buttonSignup'); 
	this.regUser = function(e) {
		e.preventDefault(); 
		return new Promise((resolve, reject) => {
			let ajaxHandlerScript=this.instanceUrl + '/services/apexrest/User/';	
			$.ajax(ajaxHandlerScript, { 
				method:'post', 
				dataType:'json', 
				context: this,
				headers: {
					'Authorization': this.tokenType + ' ' + this.accessToken,
					'Content-Type': 'application/json'
				},
				crossDomain: true,
				contentType: 'application/json',
				data: JSON.stringify({
					'name': $('#clientName').val(),
					'email': $('#clientEmail').val(),
					'mobile': $('#clientPhone').val(),
					'password': $('#clientPassword').val()
				}),
				success: function(result) {
					$('#welldone').removeClass('d-none');
					$('.form-signup').addClass('d-none');
					$('.form-signup')[0].reset();
					resolve(result);
				},
				error: function(error) {
					$('.emailError').removeClass('d-none');
					reject(error);
				},
				beforeSend: function(xhr) {
					$('#allFieldsRequired, .emailError').addClass('d-none');
					if ($('#clientPassword').val() !== $('#confirmPassword').val() || (!$('#signup form').valid())) {
						xhr.abort(); //отмена ajax-запроса
						return;
					}
					
					$.each($('#signup form input'),  function(index, currentElement) {
						if (!$(currentElement).val()) {
							xhr.abort();
							$('#allFieldsRequired').removeClass('d-none');
						} 
					});
				}
			});
		});
	}
	$(this.buttonSignup).on('click', this.regUser.bind(this));                 
	$('#confirmPassword').on('keyup', function() {
		if (($('#clientPassword').val() !== $('#confirmPassword').val()) && $('#confirmPassword').val().length) {
			$('#wrongPasswords').text('Пароли не совпадают');
		} else {
			$('#wrongPasswords').empty();
		}
	});
	
	//tableReservation
		// localStorage
	let futureOrder = {}; //data-attribute не добавлялся в разметку, так как id - не длинный
	if (localStorage.getItem('futureOrder') && localStorage.getItem('futureOrder') !== 'undefined') {
		futureOrder = JSON.parse(localStorage.getItem('futureOrder'));	
	}
	
 	$('#booking input, #booking textarea').each(function(index, value) {
		$(value).on('keyup', function() {
			futureOrder[$(value).attr('id')] = $(value).val();
			localStorage.setItem('futureOrder', JSON.stringify(futureOrder));
		});
		$(value).on('change', function() {
			futureOrder[$(value).attr('id')] = $(value).val();
			localStorage.setItem('futureOrder', JSON.stringify(futureOrder));
		});

		if (localStorage.getItem('futureOrder') && localStorage.getItem('futureOrder') !== 'undefined') { 
			$(value).val(futureOrder[$(value).attr('id')]);
		}	
	});

	//завязка на регистрации
	if (localStorage.getItem('user')) { 
		this.user = JSON.parse(localStorage.getItem('user'));
		futureOrder.name = this.user['First_Name__c'];
		futureOrder.email = this.user['Email__c'];
		futureOrder.phone = this.user['Mobile__c'];
		this.takeDataForOrder();
	} 

	// validation
	$('#booking form, #signin form, #signup form').each(function(index, value) {
		$(value).validate({ 		
			rules: {
				name: {
					required: true
				},
				date: {					
					required: true
				},
				email: 'email',
				number: {
					required: true,
					max: 65,
					min: 1
				},
				phone: {
					required: true,
					digits: true,
					minlength: 7,
					maxlength: 12
				},
				tel: {
					digits: true,
					minlength: 7,
					maxlength: 12
				},
				time: {
					required: true
				}
			},
			messages: {
				name: {
					required: 'Представьтесь, пожалуйста'
				},
				date: {     					
					required: 'Выберите дату визита'
				},
				email: 'Необходим формат адреса email: hi@gmail.com',
				number: {
					required: 'Укажите количество гостей',
					max: 'Наш ресторан вмещает только 65 гостей',
					min: 'Количество гостей не может быть меньше 1'
				},
				phone: {
					required: 'Укажите телефон',
					digits: 'Укажите только цифры',
					minlength: 'Слишком короткий номер',
					maxlength: 'Слишком длинный номер'
				},
				tel: {
					digits: 'Укажите только цифры',
					minlength: 'Слишком короткий номер',
					maxlength: 'Слишком длинный номер'
				},
				time: {
					required: 'Выберите время визита'
				}
			},
			onsubmit: true
		});
	});
		
	//отправка формы Reservation
	
	this.buttonReservation = $('#buttonReservation'); 
	this.reserveTable = function(e) {
		e.preventDefault(); 
		return new Promise((resolve, reject) => {
			let ajaxHandlerScript=this.instanceUrl + '/services/apexrest/Reserve/';	
			$.ajax(ajaxHandlerScript, { 
				method:'post', 
				dataType:'json', 
				context: this,
				headers: {
					'Authorization': this.tokenType + ' ' + this.accessToken,
					'Content-Type': 'application/json'
				},
				contentType: 'application/json',
				crossDomain: true,
				data: JSON.stringify({
					'name': $('#name').val(),
					'guests': $('#number').val(),
					'visitDate': $('#datepicker').val(),
					'visitTime': $('#time').val(),
					'email': $('#email').val(),
					'phone': $('#phone').val(),
					'description': $('#message').val()
				}),
				success: function(result) {
					$('#tableOK').removeClass('d-none');
					$('#booking form')[0].reset();
					localStorage.removeItem('futureOrder');
					resolve(result);
				},
				error: function(error) {
					reject(error);
				},
				beforeSend: function(xhr) {
					if (!$('#booking form').valid()) {
						xhr.abort(); //отмена ajax-запроса
						return;
					}
				}
			});
		});
	}
	$(this.buttonReservation).on('click', this.reserveTable.bind(this));
	
	
																																	//waiter
	this.chooseMeal = function() {
		let mealId = $(this).attr('data-mealId');
		if (teideController.waiterModel.newOrder.orderItems[mealId]) {
			teideController.waiterModel.newOrder.orderItems[mealId].quantity++;
		} else {		//если пустой
			var item = {
				mealName: $(this).text(),
				mealId: $(this).attr('data-mealId'),
				quantity: 1
			};
			teideController.waiterModel.newOrder.orderItems[mealId] = item;
		}
		teideController.waiterModel.updateViews();
	}
						
	this.deleteItem = function() {	//close button
		delete teideController.waiterModel.newOrder.orderItems[$(this).attr('data-mealId')]; //повторяем чтобы получать актуальный Id - так как неизвестно когда будет вызов
		teideController.waiterModel.updateViews();
	}
	this.countItems = function() {		//quantity change	
		teideController.waiterModel.newOrder.orderItems[$(this).attr('data-mealId')].quantity = $(this).val();
	}
	this.changeOrderTime = function() {	//shift change
		teideController.waiterModel.newOrder.timeShift = $(this).val();
	}
	this.saveMessage = function() { //save message from client
		teideController.waiterModel.newOrder.message = $(this).val();
	}
	this.saveTable = function() { //save table
		teideController.waiterModel.newOrder.table = $(this).val();
	}

	
	   // оформить заказ - отправка на сервер от официанта
	this.makeOrder = function(e) {
		e.preventDefault(); 
		return new Promise((resolve, reject) => {
			let ajaxHandlerScript=this.instanceUrl + '/services/apexrest/Order/';	
			this.waiterModel.newOrder.userId = this.user.Id; 
			$.ajax(ajaxHandlerScript, { 
				method:'post', 
				dataType:'json', 
				context: this,
				headers: {
					'Authorization': this.tokenType + ' ' + this.accessToken,
					'Content-Type': 'application/json'
				},
				contentType: 'application/json',
				data: JSON.stringify({
					'newOrder': this.waiterModel.newOrder
				}),
				crossDomain: true,
				beforeSend: function() {
					$('.gif').removeClass('d-none'); 
				},
				success: function(result) {
					$('.gif').addClass('d-none'); 
					this.waiterModel.newOrder = {
						table: '1',
						timeShift: 0,
						orderItems: {}
					};
					window.location.hash = 'Waiter';  
					resolve(result);
				},
				error: function(error) {
					$('.gif').addClass('d-none');
					reject(error);
				},
			});
		});
	}
	
	//редактировать заказ официантом
	this.edit = function() {
		teideController.waiterModel.newOrder = teideController.waiterModel.receivedOrders[$(this).attr('data-orderIndex')];
		window.location.hash = 'NewOrder';  
		teideController.waiterModel.orderMenuView.update();
	}
																												//заказ передан клиенту - скрыть заказ 
	this.cleanOrder = function() {
		let parentCard = $(this).parents('.card');
		return new Promise((resolve, reject) => {    //отправояем инфо на сервер, что есть изменения
			let ajaxHandlerScript=teideController.instanceUrl + '/services/apexrest/OrderStatus';	
			$.ajax(ajaxHandlerScript, { 
				method:'post', 
				headers: {
					'Authorization': teideController.tokenType + ' ' + teideController.accessToken,
					'Content-Type': 'application/json'
				},
				contentType: 'application/json',
				data: JSON.stringify({
					'newStatus': {
						'id': $(parentCard).find('.buttonDone').attr('data-orderId'),
						'status': 'Done'
						}
				}),
				crossDomain: true,
				beforeSend: function() {
					$('.gif').removeClass('d-none'); 
				},
				success: function(result) {
					$('.gif').addClass('d-none'); 
					$(parentCard).addClass('d-none');
					resolve(result);
				},
				error: function(error) {
					$('.gif').addClass('d-none');
					reject(error);
				}
			}); 
		});
		teideController.waiterModel.updateViews();
	}
	//обновлять данные для официанта автоматически
	//обновлять через определенное время для повара
	this.refreshDataWaiter = function() {
		this.waiterModel.recieveOrdersTime();
		this.waiterModel.updateViews();
	}
	
	//chief
	this.changeAll = function() {
		let parentCard = $(this).parents('.chiefCard');
		$(parentCard).addClass('inProgressOrder'); //изменяем фон
		$(parentCard).removeClass('completedOrder');
		$(parentCard).prependTo($(parentCard).parents('.card-deck-chief'));		//двигаем в начало
		
		$(parentCard).find('.takeOrder').addClass('d-none');   //неактивные кнопки
		$(parentCard).find('.inProgress').prop('disabled', true);
		$(parentCard).find('.orderComplited').prop('disabled', false); //активна кнопка "Готово"
		
		return new Promise((resolve, reject) => {    //отправояем инфо на сервер, что есть изменения
			let ajaxHandlerScript=teideController.instanceUrl + '/services/apexrest/OrderStatus';	
			$.ajax(ajaxHandlerScript, { 
				method:'post', 
				headers: {
					'Authorization': teideController.tokenType + ' ' + teideController.accessToken,
					'Content-Type': 'application/json'
				},
				contentType: 'application/json',
				data: JSON.stringify({
					'newStatus': {
						'id': $(parentCard).find('.takeOrder').attr('data-orderId'),
						'status': 'In Progress'
						}
				}),
				crossDomain: true,
				beforeSend: function() {
					$('.gif').removeClass('d-none'); 
				},
				success: function(result) {
					$('.gif').addClass('d-none'); 
					resolve(result);
				},
				error: function(error) {
					$('.gif').addClass('d-none');
					reject(error);
				}
			}); 
		});
		teideController.chiefModel.updateViews();
	}
	
	this.changeAllReverse = function() {    //кнопка "готово"
		let parentCard = $(this).parents('.chiefCard');
		$(parentCard).addClass('completedOrder'); //изменяем фон
		$(parentCard).removeClass('inProgressOrder');
		$(parentCard).appendTo($(parentCard).parents('.card-deck-chief'));		//двигаем в конец
		
		$(parentCard).find('.takeOrder').addClass('d-none');
		$(parentCard).find('.inProgress').prop('disabled', false);
		$(parentCard).find('.orderComplited').prop('disabled', true); //активна кнопка "Готово"
		
		return new Promise((resolve, reject) => {    //отправояем инфо на сервер, что есть изменения
			let ajaxHandlerScript=teideController.instanceUrl + '/services/apexrest/OrderStatus';	
			$.ajax(ajaxHandlerScript, { 
				method:'post', 
				headers: {
					'Authorization': teideController.tokenType + ' ' + teideController.accessToken,
					'Content-Type': 'application/json'
				},
				contentType: 'application/json',
				data: JSON.stringify({
					'newStatus': {
						'id': $(parentCard).find('.orderComplited').attr('data-orderId'),
						'status': 'Completed'
						}
				}),
				crossDomain: true,
				beforeSend: function() {
					$('.gif').removeClass('d-none'); 
				},
				success: function(result) {
					$('.gif').addClass('d-none'); 
					resolve(result);
				},
				error: function(error) {
					$('.gif').addClass('d-none');
					reject(error);
				}
			}); 
		});
		teideController.chiefModel.updateViews();
	}
	
	//обновлять через определенное время для повара
	this.refreshDataChief = function() {
		this.chiefModel.recieveOrders();
		this.chiefModel.updateViews();
	}
} 

	
		
/* 		fetch(ajaxHandlerScript,{method: 'POST', body: JSON.stringify({
			grant_type: 'password',
			client_id: '3MVG9d8..z.hDcPKxoBHrwVfavnMPe8sXCXOUHaqjCgfY2_0zZZWEkAvh8sGvYevncdGi2MBIWdD7hD9upPxv',
			client_secret: '5082174339454021489',
			username: 'dmitry.kolyagin@ts.com',
			password: 'ddd16481648'}),
			mode: 'cors',
			headers: {'Content-Type': 'application/json'}
		})
        .then( response => response.json())
		.then( response => {console.log(response); } )
        .catch( error => { console.error(error); } ); */



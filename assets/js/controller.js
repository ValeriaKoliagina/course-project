'use strict'

function TeideController() {
	this.accessToken;
	this.instanceUrl;
	this.tokenType;
	this.getToken = function() {
		return new Promise((resolve, reject) => {
			let ajaxHandlerScript='https://login.salesforce.com/services/oauth2/token';	
			$.ajax(ajaxHandlerScript, { 
				method:'post', 
				dataType:'json', 
				data: {
					grant_type: 'password',
					client_id: '3MVG9d8..z.hDcPKxoBHrwVfavnMPe8sXCXOUHaqjCgfY2_0zZZWEkAvh8sGvYevncdGi2MBIWdD7hD9upPxv',
					client_secret: '5082174339454021489',
					username: 'dmitry.kolyagin@ts.com',
					password: 'ddd16481648'
				},
				success: function(result) {
					resolve(result);
				},
				error: function(error) {
					reject(error);
				}
			});
        });
	}
	this.createModel = function(each, model) {
		this[each] = model;
		this[each].accessToken = this.accessToken;
		this[each].instanceUrl = this.instanceUrl;
		this[each].tokenType = this.tokenType;
	}
	
	//signin
	this.user;
	this.buttonSignin = $('#buttonSignin');
	this.buttonOut = $('.button-out');
	this.checkboxRememberMe = $('input[type="checkbox"]');
	this.sayHi = function() {
		$('#signin span').removeClass('d-none');   //оставить в контроллере? (или через модель? - но она вроже не нужна - нету данных как таковых)
		$('.button-out').removeClass('d-none');
		$('.button-enter').addClass('d-none');
		$('.button-reg').addClass('d-none');
		$('.hi-user').html('Добро пожаловать, ' + this.user.First_Name__c);
	}
	this.sayBye = function() {
		$('#signin span').addClass('d-none');   
		$('.button-out').addClass('d-none');
		$('.button-enter').removeClass('d-none');
		$('.button-reg').removeClass('d-none');
		$('.hi-user').empty();
		localStorage.removeItem('user');
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
				},
				context: this,
				success: function(result) {
					console.log(result);
					if (result.length === 0) {
						$('#signin span').removeClass('d-none');
					} else {
						this.user = result[0];
						if ($(this.checkboxRememberMe).is(':checked')) {
							localStorage.setItem('user', JSON.stringify(this.user)); //localStorage
						}
						window.location.hash = 'Main';
						this.sayHi();
					}
					resolve(result);
				},
				error: function(error) {
					reject(error);
				}
			});
		});
	}
	$(this.buttonSignin).on('click', this.checkUser.bind(this)); //this был button, передаем контекст контроллер
	$(this.buttonOut).on('click', this.sayBye.bind(this));
	
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



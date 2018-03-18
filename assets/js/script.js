"use strict";
//MVC
let teideController;
let gMenuView;
let waiterView;
let orderWaiterView;
let receivedOrderWaiterView;
let chiefView;

window.onload = function() {
	teideController = new TeideController();
	gMenuView = new GlobalMenuView();
	waiterView = new WaiterView();
	orderWaiterView = new OrderWaiterView();
	receivedOrderWaiterView = new ReceivedOrdersWaiterView();
	chiefView = new ChiefView();
		
	teideController.getToken()
		.then(result => {
			teideController.accessToken = result.access_token;
			teideController.instanceUrl = result.instance_url;
			teideController.tokenType = result.token_type;
			teideController.createModel('menuModel', new MenuModel());	
			teideController.createModel('waiterModel', new WaiterModel());
			teideController.createModel('chiefModel', new ChiefModel());
			teideController.menuModel.init(gMenuView);
			teideController.waiterModel.init(waiterView, orderWaiterView, receivedOrderWaiterView);
			teideController.chiefModel.init(chiefView);
			gMenuView.init(teideController.menuModel);
			waiterView.init(teideController.waiterModel);
			orderWaiterView.init(teideController.waiterModel);
			receivedOrderWaiterView.init(teideController.waiterModel);
			chiefView.init(teideController.chiefModel);
			switchToStateFromURLHash();
		})
		.catch(error => console.error(error));
}


// Переключение страниц		  
window.onhashchange=switchToStateFromURLHash;
let SPAState={};

function switchToStateFromURLHash() {
	let URLHash=window.location.hash;
	let stateStr=URLHash.substr(1);
	if ( stateStr!="" ) { 
		let parts=stateStr.split("_")
		SPAState={ pagename: parts[0] }; // первая часть закладки - номер страницы
	}
	else
	  SPAState={pagename:'Main'}; // иначе показываем главную страницу 

	$('section').hide();
	$('header').show('drop', {direction: 'up'}, 500);
	switch ( SPAState.pagename ) {
		case 'Main':
			$('#slider').show('drop', null, 500);
			break;
		case 'Menu':
			teideController.menuModel.receiveCategories().then(function() {
					$('#menuCategories').show('drop', null, 500)
			});
			break;
		case 'Starter':
			teideController.menuModel.receiveCategories().then(function() {
					$('#categoryMeals').show();
					$('#Starter').show('drop', null, 500);
			});
			break;
		case 'Soup':
			teideController.menuModel.receiveCategories().then(function() {
					$('#categoryMeals').show();
					$('#Soup').show('drop', null, 500);
			});
			break;
		case 'Fish':
			teideController.menuModel.receiveCategories().then(function() {
					$('#categoryMeals').show();
					$('#Fish').show('drop', null, 500);
			});
			break;
		case 'Meat':
			teideController.menuModel.receiveCategories().then(function() {
					$('#categoryMeals').show();
					$('#Meat').show('drop', null, 500);
			});
			break;
		case 'Sidedish':
			teideController.menuModel.receiveCategories().then(function() {
					$('#categoryMeals').show();
					$('#Sidedish').show('drop', null, 500);
			});
			break;
		case 'Dessert':
			teideController.menuModel.receiveCategories().then(function() {
					$('#categoryMeals').show();
					$('#Dessert').show('drop', null, 500);
			});
			break;
		case 'TableReservation':
			teideController.menuModel.receiveCategories().then(function() {
				$('#booking').show('drop', null, 500);
				$('#name').focus();
			});
			break;
		case 'Contacts':
			$('#contacts').show('drop', null, 500);
			break;
		case 'Signin':
			$('#signin').show('drop', null, 500);
			break;
		case 'Signup':
			$('#signup').show('drop', null, 500);
			$('#welldone').addClass('d-none');
			$('.form-signup').removeClass('d-none');
			break;
		case 'Chief':
			teideController.chiefModel.recieveOrders().then(function() {
				$('#containerChief').show('drop', null, 500);
				teideController.chiefModel.updateViews();
			});
			break;
		case 'Waiter':
			teideController.waiterModel.recieveOrders().then(function() {
				$('#containerOrderWaiter').show('drop', null, 500);
				teideController.waiterModel.updateViews();
			});
			break;
		case 'NewOrder':
			teideController.waiterModel.receiveCategories().then(function() {
				$('#newOrder').show('drop', null, 500);
				teideController.waiterModel.updateViews();
			});
			break;
/* 		case 'Schedule':
			$('#schedule').show('drop', null, 500);
			break;
		case 'Table':
			$('#accordionAdministrator').show('drop', null, 500);
			break; */
	}
	$('footer').show('drop', {direction: 'down'}, 500);
	if (SPAState.pagename === 'Signup') {
		addListeners();
	}
}

function switchToState(newState) {
var stateStr=newState.pagename;
location.hash=stateStr;
}

// Не сохранены данные
var textChanged=false;

function addListeners() {
	var txtElems=document.querySelectorAll('#signup form input');
	for (let i = 0; i < txtElems.length; i++) {
		txtElems[i].onchange=txtChanged;
		txtElems[i].onkeypress=txtChanged;
		txtElems[i].onpaste=txtChanged;
		txtElems[i].oncut=txtChanged;
	}
}
addListeners();

function txtChanged(e) {
	textChanged=true; // текст изменён
}
 
window.onbeforeunload=befUnload;

function befUnload(e) {
	// если текст изменён, попросим браузер задать вопрос пользователю
	if ( textChanged && location.hash === 'Signup')
		e.returnValue='Данные не сохранены';
};

//datepicker
$('#datepicker').datepicker({
  showAnim: "slideDown"
});

//timepicker 
$('#time').datetimepicker({
	datepicker:false,
	format:'H:i',
	defaultTime:'19:00',
	allowTimes:[
		'10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', 
		'16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
		'22:00', '22:30', '23:00', '23:30', '00:00', '00:30', '01:00'
	]
});

//свернуть toggle в navbar
$('.navbar-nav li a').on('click', function(){
    $('.navbar-collapse').collapse('hide');
});

//handlebars helper - if (a ===  b)
Handlebars.registerHelper('if_eq', function(a, b, opts) {
    if (a == b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});


//проверка сложности пароля
/* $('#clientPassword').keyup(function(e) {
     var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
     var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
     var enoughRegex = new RegExp("(?=.{6,}).*", "g");
     if (false == enoughRegex.test($(this).val())) {
             $('#passstrength').html('Короткий пароль');
     } else if (strongRegex.test($(this).val())) {
             $('#passstrength').className = 'ok';
             $('#passstrength').html('Отличный пароль');
     } else if (mediumRegex.test($(this).val())) {
             $('#passstrength').className = 'alert';
             $('#passstrength').html('Может посложнее?');
     } else {
             $('#passstrength').className = 'error';
             $('#passstrength').html('Легкий пароль');
     }
     return true;
}); */




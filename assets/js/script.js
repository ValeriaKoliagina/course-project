"use strict";
//controller
let teideController;
let gMenuView;

window.onload = function() {
	teideController = new TeideController();
	teideController.getToken()
		.then(result => {
			teideController.accessToken = result.access_token;
			teideController.instanceUrl = result.instance_url;
			teideController.tokenType = result.token_type;
			teideController.createModel('menuModel', new MenuModel());	
			teideController.menuModel.init(gMenuView);
			gMenuView.init(teideController.menuModel);
		})
		.catch(error => console.error(error));
		
	gMenuView = new GlobalMenuView();
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
			$('#starter').show('drop', null, 500);
			break;
		case 'Soup':
			$('#soup').show('drop', null, 500);
			break;
		case 'Fish':
			$('#fish').show('drop', null, 500);
			break;
		case 'Meat':
			$('#meat').show('drop', null, 500);
			break;
		case 'Sidedish':
			$('#sidedish').show('drop', null, 500);
			break;
		case 'Dessert':
			$('#dessert').show('drop', null, 500);
			break;
		case 'TableReservation':
			$('#booking').show('drop', null, 500);
			break;
		case 'Contacts':
			$('#contacts').show('drop', null, 500);
			break;
		case 'Signin':
			$('#signin').show('drop', null, 500);
			break;
		case 'Signup':
			$('#signup').show('drop', null, 500);
			break;
		case 'Chief':
			$('#mainContentChief').show('drop', null, 500);
			break;
		case 'Waiter':
			$('#containerOrderWaiter').show('drop', null, 500);
			break;
		case 'NewOrder':
			$('#newOrder').show('drop', null, 500);
			break;
		case 'Schedule':
			$('#schedule').show('drop', null, 500);
			break;
		case 'Table':
			$('#accordionAdministrator').show('drop', null, 500);
			break;
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

switchToStateFromURLHash();

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
	if ( textChanged )
		e.returnValue='Данные не сохранены';
};

//datepicker
$( '#datepicker' ).datepicker({
  showAnim: "slideDown"
});

//проверка сложности пароля
$('#clientPassword').keyup(function(e) {
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
});




'use strict'

function TeideController() {
	this.accessToken;
	this.instanceUrl;
	this.tokenType;
	this.getToken = function() {
		return new Promise((resolve, reject) => {
			let ajaxHandlerScript='https://login.salesforce.com/services/oauth2/token';	
			$.ajax(ajaxHandlerScript, { 
				type:'POST', 
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
        })
	}
	this.getToken()
		.then(result => {
			this.accessToken = result.access_token;
			this.instanceUrl = result.instance_url;
			this.tokenType = result.token_type;
			this.createModel('menuModel', new MenuModel());
			
		})
		.catch(error => console.error(error))
		
		
	this.createModel = function(each, model) {
		this[each] = model;
		this[each].accessToken = this.accessToken;
		this[each].instanceUrl = this.instanceUrl;
		this[each].tokenType = this.tokenType;
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



$(document).ready(function() {
	document.getElementById("Submit").addEventListener("click", function() {

		$.ajax({
			type: 'get',
			url: '/displayUser',   
			data: {hello : "hello"},
			xhrFields: {
				withCredentials: false
			},  
			headers: {
				"data" : JSON.stringify(data)
			}, 
			success: function (data) {
				console.log('Success');
			},  
			error: function () {
				console.log('We are sorry but our servers are having an issue right now');
			}
		});
	});
});
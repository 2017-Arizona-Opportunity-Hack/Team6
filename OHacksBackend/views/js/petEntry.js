$(document).ready(function() {
	document.getElementById("Submit").addEventListener("click", function() {
        var name = document.getElementById("name").value;
		var time = document.getElementById("time").value;
		var location = document.getElementById("location").value;
		var pets = document.getElementById("pets").value;
		var size = document.getElementById("size").value;

		console.log(time, location, pets, size);

		var data = {"name" : name, "time_needed_by" : time, "location" : location, "breed" : pets, "size" : size, "has_owner": false};

		$.ajax({
			type: 'post',
			url: '/addNeededDog',   
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
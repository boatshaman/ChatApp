$(document).ready(function(){

	$('form').on('submit', function(e){
		event.preventDefault();
		var form = $(this);
		$.ajax($('form').attr('action'), {
			type: 'POST',
			contentType: 'application/json',
			dataType: 'json',
			data: $('form').serialize(),
			success: function(result){
				form.remove();
				var msg = $("<p></p>");
				msg.append("Congratulations " + result.username + "! You have successfully joined the coolest chat around town ;)");
				$('#space').html(msg).fadeIn();
			},
			contentType: 'application/json'
		});
	});

});

$(document).ready(function(){
	var uName;
	var ppl = [];
	var i = 0;
	$('form').on('submit', function(e){
		event.preventDefault();
		var form = $(this);
		$.ajax($('form').attr('action'), {
			type: 'POST',
			contentType: 'application/json',
			dataType: 'json',
			data: $('form').serialize(),
			success: function(result){
				result.username = uName;
				form.remove();
				var msg = $("<div class = 'main'><p></p></div>");
				var fwens = $("<div class = 'peerBar'></div>");
				msg.append("Congratulations " + result.username + "! You have successfully joined the coolest chat around town ;)");
				$.each(result.peers, function(index, p) {
					ppl[i] = p;
					i = i + 1;
					fwens.append("<a class = 'peer'> " + ppl + "</a>")
				})
				$('#space').html(msg).fadeIn();
				$('#space').html(fwens).fadeIn();
			},
			contentType: 'application/json'
		});
	});
	$('.peer').click(function(e) {
		e.preventDefault();
		var fren = $(this);
		$.ajax({
			type: 'POST',
			contentType: 'application/json',
			dataType: 'json',
			data: ('join=' + this.text() + '&' + uName),
			success: function(result){
				var msg = $("<div class = 'main'><p></p></div>");
				$.each(result.members, function(index2, p2){
					msg.append("Congratulations you have successfully joined a chat with " + p2);
				})
				$('.main').html(msg).fadeIn();
			},
			contentType: 'application/json'

		});
	});


});

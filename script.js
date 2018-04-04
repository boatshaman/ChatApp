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
				form.remove();
				var msg = $("<div></div>").addClass("main");
				var fwens = $("<div></div>").addClass("peerBar");
				msg.append("<p>Congratulations " + result.username + "! You have successfully joined the coolest chat around town :) </p>");
				$.each(result.peers, function(index, p) {
					fwens.append("<div  class = 'peer'><a> " + p + "</a></div>")
				})
				$('#space').append(msg);
				$('#space').append(fwens);


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
				var msgg = $("<div class = 'main'><p></p></div>");
				$.each(result.members, function(index2, p2){
					msgg.append("Congratulations you have successfully joined a chat with " + p2);
				})
				$('.main').replaceWith(msgg);
			},
			contentType: 'application/json'

		});
	});


});

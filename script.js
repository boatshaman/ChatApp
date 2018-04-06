var username;
var log_on = false;

$.ajaxSetup({ cache: false });

$(document).ready(function(){
	var ppl = [];
	var i = 0;
	$('form[name="signUp"]').on('submit', SignUp);
	//$('form[name="Message"]').on('submit', sendMessage);
	// $('.peer').click(function(e) {
	// 	console.log('!!!')
	// 	e.preventDefault();
	// 	var fren = $(this);
	// 	$.ajax({
	// 		type: 'POST',
	// 		contentType: 'application/json',
	// 		dataType: 'json',
	// 		data: ('join=' + this.text() + '&' + uName),
	// 		success: function(result){
	// 			var msgg = $("<div class = 'main'><p></p></div>");
	// 			$.each(result.members, function(index2, p2){
	// 				msgg.append("Congratulations you have successfully joined a chat with " + p2);
	// 			})
	// 			$('.main').replaceWith(msgg);
	// 		},
	// 		contentType: 'application/json'
	//
	// 	});
	// });


});

function SignUp(){
	event.preventDefault();
	var form = $(this);
	$.ajax($('form[name="signUp"]').attr('action'), {
		type: 'POST',
		contentType: 'application/json',
		dataType: 'json',
		data: $('form[name="signUp"]').serialize(),
		success: function(result){
			username = result.username;
			form.remove();
			var msg = $("<div></div>").addClass("main");
			var fwens = $("<div></div>").addClass("peerBar");
			msg.append("<p>Congratulations " + result.username + "! You have successfully joined the coolest chat around town :) </p>");
			$.each(result.peers, function(index, p) {
				fwens.append("<div  class = 'peer' onclick='Join(\""+p+"\")'><a> " + p + "</a></div>")
			})
			$('#space').append(msg);
			$('#space').append(fwens);
			log_on = true;

		},
		contentType: 'application/json'
	});

}

function sendMessage(){

	event.preventDefault();
	var form = $(this);
	$.ajax($('form[name="Message"]').attr('action'), {
		type: 'POST',
		contentType: 'application/json',
		dataType: 'json',
		data: ('msg='+$('#msg').val()+'&name='+username),

	});
	$('#msg').val('')

}

function Join(peer){

		event.preventDefault();
		$.ajax({
			type: 'POST',
			contentType: 'application/json',
			dataType: 'json',
			data: ('join=' + peer + '&name=' + username),
			success: function(result){

				//var msgg = $("<div class = 'main'><p></p></div>");
				$.each(result.members, function(index2, p2){
					//msgg.append("Congratulations you have successfully joined a chat with " + p2);
					$('.main').append("Congratulations you have successfully joined a chat with " + p2);
				})
				//$('.main').replaceWith(msgg);
				$('.footer').css("display", "inline");
			},
			contentType: 'application/json'

		});
	}



(function worker() {

  $.ajax({
		type: 'GET',
    url: '/update/?'+username,
    success: function(result) {
      if(result.flags=='idle'){updateIdle(result);}
			else if(result.flags=='chatting'){updateChatting(result);}
    },
    complete: function() {
      // Schedule the next request when the current one's complete
      setTimeout(worker, 3000);
    }
  });
})();

function updateIdle(result){
	$('.peerBar').empty();
	$.each(result.users, function(index, p) {
		$('.peerBar').append("<div  class = 'peer' onclick='Join(\""+p+"\")'><a> " + p + "</a></div>");
	})
}

function updateChatting(result){
	$('.footer').css("display", "inline");


	$('.peerBar').empty();
	$.each(result.users, function(index, p) {
		$('.peerBar').append("<div  class = 'peer' onclick='Join(\""+p+"\")'><a> " + p + "</a></div>");
	})


	$.each(result.messages, function(index, p){
		$('.main').append('<p class="chat">'+p+'</p>');
	})


}

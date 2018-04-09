var username;
var log_on = false;

$.ajaxSetup({ cache: false });

$(document).ready(function(){
	var ppl = [];
	var i = 0;
	// $('input[name="u-name"]').focus(function(){
	// 	$('form[name="signUp"]').addClass("overlay");
	// 	$('.input-holder').css("background-color", "white");
	// 	$('.input-holder').css("opacity", "white");
	//
	// });
	// $('input[name="u-name"]').blur(function(){
	// 	$('form[name="signUp"]').removeClass("overlay");
	// 	$('.input-holder').css("background-color", "black");
	//
	// });

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

function searchToggle(obj, evt){
    var container = $(obj).closest('.search-wrapper');
        if(!container.hasClass('active')){
            container.addClass('active');
            evt.preventDefault();
        }
        else if(container.hasClass('active') && $(obj).closest('.input-holder').length == 0){
            container.removeClass('active');
            // clear input
             //$('form[name="signUp"]').trigger("submit");
        }
}
function SignUp(){
	event.preventDefault();
	var form = $(this);
	$.ajax($('form[name="signUp"]').attr('action'), {
		type: 'POST',
		contentType: 'application/json',
		dataType: 'json',
		data: $('form[name="signUp"]').serialize(),
		success: function(result){
			$('.search-wrapper').fadeOut();
			$('.input-holder').fadeOut();
			$('.u-name').fadeOut();
			$('.search-icon').fadeOut();
			username = result.username;
			//form.remove();
			var msg = $("<div></div>").addClass("main");
			var pop = $("<div></div>").addClass("popup");
			var fwens = $("<div></div>").addClass("peerBar");
			var textForm = $('<form action = "/" method = "POST" name = "Message" class="Message" id="Message" onsubmit="sendMessage()"></form>')
			var cushion = $('<div class=></div>').addClass('footer');
			var textbox = $('<div class=></div>').addClass('cushion');
			var table = $("<table></table>").addClass("chatTable");
			var tableDIV = $("<div></div>").addClass("tableDIV");
			textbox.append('<input type="text" form="Message" name="msg" id = "msg" class="msg" autocomplete="off">');
			textbox.append('<input type="submit" form="Message" class="send_msg" value="Send">');
			cushion.append(textbox);
			pop.append("<p class='join'>Congratulations " + result.username + "! You have successfully joined the coolest chat around town :) </p>");
			msg.append(pop);
			$.each(result.peers, function(index, p) {
				fwens.append("<div  class = 'peer' onclick='Join(\""+p+"\")'><a> " + p + "</a></div>")
			})
			// $('#space:before').css("animation", "fade-slide-up 2s .5s cubic-bezier(0, .5, 0, 1) forwards");
			$('#space').css("justify-content", "flex-start");
			$('#space').css("align-items", "flex-start");
			$('#space').append(msg);
			$('#space').append(fwens);
			$('#space').append(textForm);
			$('#space').append(cushion);
			$(".main").append(tableDIV);
			$('.tableDIV').append(table);
			$('space:after').css("animation", "ffade-slide-down 2s .5s cubic-bezier(0, .5, 0, 1) forwards");
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
				var msg = $("<div></div>").addClass("main");
				var pop = $("<div></div>").addClass("popup");
				//pop.append("<p class='join'>Congratulations you have successfully joined a chat with " + p2 + "</p>");
				msg.append(pop);
				$.each(result.members, function(index2, p2){
					//msgg.append("Congratulations you have successfully joined a chat with " + p2);
					$('.main').append(msg);
				})
				//$('.main').replaceWith(msgg);

			},
			contentType: 'application/json'

		});
	}



	(function worker() {

	  $.ajax({
			type: 'GET',
	    url: '/update/?'+username,
	    success: function(result) {
	      if(result.flags=='online'){updateOnline(result);}

	    },
	    complete: function() {
	      // Schedule the next request when the current one's complete
	      setTimeout(worker, 2000);
	    }
	  });
	})();



	function updateOnline(result){

		$('.peerBar').empty();
		$.each(result.users, function(index, p) {
			$('.peerBar').append("<div  class = 'peer' onclick='Join(\""+p+"\")'><a> " + p + "</a></div>");
		})


		$.each(result.messages, function(index, p){

			$('.chatTable').append(p);

		})


	}

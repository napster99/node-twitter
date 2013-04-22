$(function(){


	function showWhich($cur){
		
		$('.nav').find('li.active').removeClass('active');
		$cur.addClass('active');

	}

	switch(window.location.pathname){
		case '/':
			showWhich($('li[name=index]'));
			break;
		case '/login':
			showWhich($('li[name=login]'));
			break;
		case '/reg':
			showWhich($('li[name=reg]'));
			break;
		default:
			//do nothing
	}
	
	$('.alert').fadeIn(1000,function(){
		var that = this;
		setTimeout(function(){
			$(that).fadeOut(1000);
		},2000);	
	});

});
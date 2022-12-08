$(document).ready(function(){
	$(".start_game").click(function(){
		let name_user = $(".name").val();
		let block_menu = $("#menu");
		let block_game = $("#game");
		if (name_user == "") 
		{
			alert("Заполните имя!");
		}
		else{
			block_menu.css("display","none");
			block_game.css("display","block");
			Game();
		}		
		console.log(name_user);
		console.log(block_menu);
		console.log(block_game);
	});
	$(".settings").click(function(){
		let settings_wingow = $(".settings_window");
		settings_wingow.fadeIn();
	});
	$(".settings_close").click(function(){
		let settings_wingow = $(".settings_window");
		settings_wingow.fadeOut();
	});

	$(".builds li").click(function(){
		select_image_x = $(this).attr("x"); 
		select_image_y = $(this).attr("y");
		typeB = $(this).attr("type");
		$(".builds li img").css("background","none");
		$(this).find("img").css("background","red");
	});
	$(".die_screen .continue").click(function(){
		location.reload();
	});
});


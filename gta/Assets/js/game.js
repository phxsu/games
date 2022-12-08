let canvas = document.getElementById("game_zone");
let context = canvas.getContext("2d");
let redactorMenu = document.getElementsByClassName("builds")[0];
let die_screen = document.getElementsByClassName("die_screen")[0];

let width_screen = window.innerWidth;
let height_screen = window.innerHeight;

canvas.width = width_screen;
canvas.height = height_screen;

let select_image_x;
let select_image_y;
let typeB;
let game_mode = 1;
//1 - обычный
//2 - режим редактирвоания

//Изображения
let cell_img = new Image();
cell_img.src = "Assets/img/cell.png";
let player_img = new Image();
player_img.src = "Assets/img/chel.png";
let sprite_city = new Image();
sprite_city.src = "Assets/img/city_sprite.png";
//

let cell = {
w: 20,
h: 20
};


let player = {
	w:cell.w*2.5,
	h:cell.h*3,
	x:width_screen/2 ,
	y:height_screen/2 ,
	speed:3,
	img_w:935/4,
	img_h:1133/4
};

let player_condition_x = 0;
let player_condition_y = 0;
let city = [];

const count_cell_width = Math.ceil(width_screen/cell.w);
const count_cell_height = Math.ceil(height_screen/cell.h);

const array_map = [];

for(let i = 0; i <= count_cell_width; i++){
	for(let j = 0; j <= count_cell_height; j++){
		array_map.push({
			x: i*cell.w,
			y: j*cell.h
		});
	}
}


canvas.addEventListener("mouseup", function(e){
	const rect = canvas.getBoundingClientRect();
	let x = Math.floor((e.clientX-rect.left)/cell.w)*cell.w;
	let y = Math.floor((e.clientY-rect.top)/cell.h)*cell.h;
	console.log("x: " + x + " y: " + y);
	let index_cell = city.filter(item => item.x == x && item.y == y);
	console.log(index_cell);
	if (game_mode == 2) {
		if (select_image_x != "" && select_image_x != "" && index_cell.length == 0) {
			city.push({
				x:x,
				y:y,
				w:cell.w,
				h:cell.h,
				x_sprite:select_image_x,
				y_sprite:select_image_y,
				w_sprite: 16,
				h_sprite: 16,
				type: typeB
			});
		}
		else{
	        let index = city.findIndex(item => item.x == x && item.y == y);        
	            city.splice(index, 1);       
	    }
	}
});

canvas.addEventListener("mousemove", function(e){
	if (game_mode == 1) {
		MoveMousePalyer(e.clientX, e.clientY);
	}
	
});
function Game(){
	context.clearRect(0,0,width_screen, height_screen);
	for(let i = 0; i< array_map.length; i++){
		context.strokeRect(
			array_map[i].x,
			array_map[i].y,
			cell.w,
			cell.h
		);
	}	
	for(let i = 0; i < city.length; i++){
		context.drawImage(
			sprite_city,
			city[i].x_sprite,
			city[i].y_sprite,
			city[i].w_sprite,
			city[i].h_sprite,
			city[i].x,
			city[i].y,
			city[i].w,
			city[i].h
		);
	}

	context.drawImage(
		player_img,
		player_condition_x,
		player_condition_y,
		player.img_w,
		player.img_h,
		player.x,
		player.y,
		player.w,
		player.h
	);
	document.addEventListener("keydown", movePlayer);
	requestAnimationFrame(Game);
}


function movePlayer(pressKey){
	let index_intersection;
	console.log(pressKey.keyCode);
	//87-w 83-s 65-a 68-d
	switch(pressKey.keyCode){
		case 87:
			player.y -= player.speed;
			player_condition_y = (1133/4);
			index_intersection = city.filter(item => 
				item.x + item.w > player.x &&
				item.y < player.y + player.h &&
				item.y + item.h > player.y &&
				item.x < player.x + player.w);
			die();
		break;
		case 83:
			player.y += player.speed;
			player_condition_y = 0;
			index_intersection = city.filter(item => 
				item.x + item.w > player.x &&
				item.y < player.y + player.h &&
				item.y + item.h > player.y &&
				item.x < player.x + player.w);
			die();
		break;
		case 65:
			player.x -= player.speed;
			player_condition_y = (1133/4) * 2;
			index_intersection = city.filter(item => 
				item.x + item.w > player.x &&
				item.y < player.y + player.h &&
				item.y + item.h > player.y &&
				item.x < player.x + player.w);	
				die();	
		break;
		case 68:
			player.x += player.speed;
			player_condition_y = (1133/4) * 3;
			index_intersection = city.filter(item => 
				item.x + item.w > player.x &&
				item.y < player.y + player.h &&
				item.y + item.h > player.y &&
				item.x < player.x + player.w);
			die();
		break;
		case 81://Q		
		if (game_mode == 2) {
			if (redactorMenu.getAttribute("status") == "active") {
			redactorMenu.style = "display: none";
			redactorMenu.setAttribute("status", "nonactive");
			}
			else{
				redactorMenu.style = "display: grid";
				redactorMenu.setAttribute("status", "active");
			}		
		}			
		break;
		case 82://R
		if (game_mode == 2) {
			game_mode = 1;
			select_image_x = "";
			select_image_y = "";
			alert("режим игры изменен на обычный");
			redactorMenu.style = "display: none";
			redactorMenu.setAttribute("status", "nonactive");
			break;
		}
		if (game_mode == 1) {
			game_mode = 2;
			alert("режим игры изменен на редактирование");
			break;
		}
		break;
	}
}
let count_times = 1;
function die(){
	let index_intersection = city.filter(item => 
				item.x + item.w > player.x &&
				item.y < player.y + player.h &&
				item.y + item.h > player.y &&
				item.x < player.x + player.w
				&& item.type == "1");
	let timer_die;
	if (index_intersection != "" && count_times == 1) {
		count_times = 0;
		timer_die = setInterval(function(){
			index_intersection = city.filter(item => 
				item.x + item.w > player.x &&
				item.y < player.y + player.h &&
				item.y + item.h > player.y &&
				item.x < player.x + player.w
				&& item.type == "1");
			if (index_intersection != "") {
				
				player.x = -100;
				player.y = -100;
				die_screen.style = "display: block";
			}
			else{
				clearInterval(timer_die);
				count_times = 1;
			}
		},5000);
	}	
}
let x_diagonal;
let y_diagonal;
let step = 100;
let timer_to_walk;
function MoveMousePalyer(condition_x, condition_y){
	clearInterval(timer_to_walk);
	if (condition_x > player.x && condition_y > player.y) {
		x_diagonal = (condition_x - player.x)/step;
		y_diagonal = (condition_y - player.y)/step;
		timer_to_walk = setInterval(function(){
			if (condition_x < player.x && condition_y < player.y) {
				clearInterval(timer_to_walk);
				die();
			}
			player.x += x_diagonal;
			player.y += y_diagonal;
		},0.3);
	}
	if (condition_x > player.x && condition_y < player.y) {
		x_diagonal = (condition_x - player.x)/step;
		y_diagonal = (player.y - condition_y)/step;
		timer_to_walk = setInterval(function(){
			if (condition_x < player.x && condition_y > player.y) {
				clearInterval(timer_to_walk);
				die();
			}
			player.x += x_diagonal;
			player.y -= y_diagonal;
		},0.3);
	}
	if (condition_x < player.x && condition_y > player.y) {
		x_diagonal = (player.x - condition_x)/step;
		y_diagonal = (condition_y - player.y)/step;
		timer_to_walk = setInterval(function(){
			if (condition_x > player.x && condition_y < player.y) {
				clearInterval(timer_to_walk);
				die();
			}
			player.x -= x_diagonal;
			player.y += y_diagonal;
		},0.3);
	}
	if (condition_x < player.x && condition_y < player.y) {
		x_diagonal = (player.x - condition_x)/step;
		y_diagonal = (player.y - condition_y)/step;
		timer_to_walk = setInterval(function(){
			if (condition_x > player.x && condition_y > player.y) {
				clearInterval(timer_to_walk);
				die();
			}
			player.x -= x_diagonal;
			player.y -= y_diagonal;
		},0.3);
	}
}



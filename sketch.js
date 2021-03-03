
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;
var collectables;
var canyons;
var flagpole;
var lives;

var game_score

function setup()
{
	createCanvas(1024, 576);

    
    lives = 4;
    textSize(20);
    
    startGame();
}
function startGame()
{
    floorPos_y = height * 3/4;
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    // These arrays are used to determin the possition of the object on the screen
    clouds = [
        {pos_x:100, pos_y:120},
        {pos_x:500, pos_y:100},
        {pos_x:1000, pos_y:110},
        {pos_x:1300, pos_y:120},
        {pos_x:1600, pos_y:90},
        {pos_x:1900, pos_y:120},
        {pos_x:-200, pos_y:100},
        {pos_x:-600, pos_y:90},
        {pos_x:-1100, pos_y:120},
        {pos_x:-1300, pos_y:110},
        {pos_x:-1700, pos_y:120},
        {pos_x:-2000, pos_y:90},
        {pos_x:-2300, pos_y:90}
    ];
    
    mountains = [
        {pos_x:300, height:400},
        {pos_x:500, height:200},
        {pos_x:800, height:200},
        {pos_x:1000, height:300},
        {pos_x:1300, height:400},
        {pos_x:1500, height:200},
        {pos_x:1800, height:200},
        {pos_x:2000, height:300},
        {pos_x:-300, height:400},
        {pos_x:-700, height:200},
        {pos_x:-800, height:200},
        {pos_x:-1300, height:300},
        {pos_x:-1500, height:400},
        {pos_x:-1700, height:200},
        {pos_x:-2200, height:200},
        {pos_x:-2500, height:300}
    ];
    
    trees_x = [
        150,
        900,
        1150,
        1600,
        2000,
        -500,
        -1100,
        -1450,
        -1900,
        -2400
    ];
    
    collectables = [
        {x_pos:100, y_pos:floorPos_y, size:50, isFound:false},
        {x_pos:1000, y_pos:floorPos_y, size:40, isFound:false},
        {x_pos:1850, y_pos:floorPos_y, size:45, isFound:false},
        {x_pos:-600, y_pos:floorPos_y, size:35, isFound:false},
        {x_pos:-1950, y_pos:floorPos_y, size:30, isFound:false},
        {x_pos:-2600, y_pos:floorPos_y, size:25, isFound:false}
    ];
    
    canyons = [
        {x_pos:200, width:120},
        {x_pos:700, width:160},
        {x_pos:1200, width:180},
        {x_pos:1700, width:120},
        {x_pos:-400, width:170},
        {x_pos:-1000, width:160},
        {x_pos:-1800, width:140},
        {x_pos:-2300, width:160}
    ];
    
    
    flagpole = [
        {x_pos:3200, isReached:false, height:300}
    ];
    
    game_score = 0;
    
    lives -= 1;
}


function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    //This bit of the code allows the secenary to move making it look like the character is moving on screen
    push();
    translate(scrollPos,0);
    drawClouds();
    drawMountains();
    drawTrees();
    
    for(var i = 0; i < collectables.length; i++)
    {
        if(!collectables[i].isFound)
        {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }
    
    for(var i = 0; i < canyons.length; i++)
    {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }
    
    if(!checkFlagpole.isReached)
    {
        checkFlagpole(flagpole);
    }
    drawFlagpole(flagpole);
    pop();
    
	// Draw game character.
	drawGameChar();
    
    text("score: " + game_score, 20, 40);
    text("lives: " + lives, 20, 60);
    
    if(lives < 0)
    {
        text("game over - press space to continue" ,width/2 - 100, height/2);
        return;
    }
    else if(flagpole.isReached)
    {
        text("level complete - press space to continue" ,width/2 - 100, height/2);
        return;
    }
    if(gameChar_y > height)
    {
        if(lives > 0 )startGame();
    }
    
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    if(gameChar_y < floorPos_y)
    {
        gameChar_y += 2;
        isFalling = true;
    }
    else
    {
        isFalling = false;
    }
    
    if(isPlummeting)
    {
        gameChar_y += 5;
    }
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){
    
    if(flagpole.isReached && key == ' ')
    {
        nextLevel();
    }
    else if(lives == 0 && key == ' ')
    {
        returnToStart();
    }
    
	console.log("press" + keyCode);
	console.log("press" + key);
    
    if(key == 'A' || keyCode == 65)
    {
        isLeft = true;
    }
    
    if(key == 'D' || keyCode == 68)
    {
        isRight = true;
    }
    if(key == 'W' || keyCode == '87' || key == ' ')
    {
        if(!isFalling)
        {
            gameChar_y -= 100;
        }
    }
}

function keyReleased()
{

	console.log("release" + keyCode);
	console.log("release" + key);
    
    if(key == 'A' || keyCode == 65)
    {
        isLeft = false;
    }
    
    if(key == 'D' || keyCode == 68)
    {
        isRight = false;
    }

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    if(isLeft && isFalling)
    {
        strokeWeight(0);
        fill(50);
        ellipse(gameChar_x - 4, gameChar_y - 3,10,8);
        fill(252, 98, 3);
        rect(gameChar_x - 5, gameChar_y - 65,20,60);
        fill(0);
        rect(gameChar_x - 5, gameChar_y - 20,20,1);
        fill(0);
        rect(gameChar_x - 5, gameChar_y - 40,20,1);
        fill(128, 82, 23);
        ellipse(gameChar_x - 5, gameChar_y - 30,10,8);
        fill(0);
        ellipse(gameChar_x + 8, gameChar_y - 3,10,8);   
    }
    else if(isRight && isFalling)
    {
        strokeWeight(0);
        fill(50);
        ellipse(gameChar_x+4, gameChar_y-3,10,8);
        fill(252, 98, 3);
        rect(gameChar_x-15, gameChar_y-65,20,60);
        fill(0);
        rect(gameChar_x-15, gameChar_y-20,20,1);
        fill(0);
        rect(gameChar_x-15, gameChar_y-40,20,1);
        fill(128, 82, 23);
        ellipse(gameChar_x+5, gameChar_y-30,10,8);
        fill(0);
        ellipse(gameChar_x-8, gameChar_y-3,10,8);
    }
    else if(isLeft)
    {
        strokeWeight(0);
        fill(50);
        ellipse(gameChar_x - 4, gameChar_y - 3,10,8);
        fill(252, 98, 3);
        rect(gameChar_x - 5, gameChar_y - 65,20,60);
        fill(0);
        rect(gameChar_x - 5, gameChar_y - 20,20,1);
        fill(0);
        rect(gameChar_x - 5, gameChar_y - 40,20,1);
        fill(128, 82, 23);
        ellipse(gameChar_x - 5, gameChar_y - 30,10,8);
        fill(0);
        ellipse(gameChar_x + 8, gameChar_y - 3,10,8); 
    }
    else if(isRight)
    {
        strokeWeight(0);
        fill(50);
        ellipse(gameChar_x+4, gameChar_y-3,10,8);
        fill(252, 98, 3);
        rect(gameChar_x-15, gameChar_y-65,20,60);
        fill(0);
        rect(gameChar_x-15, gameChar_y-20,20,1);
        fill(0);
        rect(gameChar_x-15, gameChar_y-40,20,1);
        fill(128, 82, 23);
        ellipse(gameChar_x+5, gameChar_y-30,10,8);
        fill(0);
        ellipse(gameChar_x-8, gameChar_y-3,10,8);
    }
    else if(isFalling || isPlummeting)
    {
        strokeWeight(0);
        fill(252, 98, 3);
        rect(gameChar_x - 15, gameChar_y - 65,30,60);
        fill(237, 199, 149);
        rect(gameChar_x - 10, gameChar_y - 60,20,20);
        fill(0);
        rect(gameChar_x, gameChar_y - 40,1,20);
        fill(0);
        rect(gameChar_x - 15, gameChar_y - 20,30,1);
        fill(0);
        rect(gameChar_x - 15, gameChar_y - 40,30,1);
        fill(255);
        ellipse(gameChar_x - 6, gameChar_y - 51,6);
        fill(255);
        ellipse(gameChar_x + 6, gameChar_y - 51,6);
        fill(0);
        ellipse(gameChar_x - 5, gameChar_y - 50,2);
        fill(0);
        ellipse(gameChar_x + 5, gameChar_y - 50,2);
        fill(128, 82, 23);
        ellipse(gameChar_x + 18, gameChar_y - 30,10,8);
        fill(128, 82, 23);
        ellipse(gameChar_x - 18, gameChar_y - 30,10,8);
        fill(0);
        ellipse(gameChar_x + 8, gameChar_y - 3,10,8);
        fill(0);
        ellipse(gameChar_x - 8, gameChar_y - 3,10,8);
    }
    else
    {
        strokeWeight(0);
        fill(252, 98, 3);
        rect(gameChar_x - 15, gameChar_y - 65,30,60);
        fill(237, 199, 149);
        rect(gameChar_x - 10, gameChar_y - 60,20,20);
        fill(0);
        rect(gameChar_x, gameChar_y - 40,1,20);
        fill(0);
        rect(gameChar_x - 15, gameChar_y - 20,30,1);
        fill(0);
        rect(gameChar_x - 15, gameChar_y - 40,30,1);
        fill(255);
        ellipse(gameChar_x - 6, gameChar_y - 51,6);
        fill(255);
        ellipse(gameChar_x + 6, gameChar_y - 51,6);
        fill(0);
        ellipse(gameChar_x - 5, gameChar_y - 50,2);
        fill(0);
        ellipse(gameChar_x + 5, gameChar_y - 50,2);
        fill(128, 82, 23);
        ellipse(gameChar_x + 18, gameChar_y - 30,10,8);
        fill(128, 82, 23);
        ellipse(gameChar_x - 18, gameChar_y - 30,10,8);
        fill(0);
        ellipse(gameChar_x + 8, gameChar_y - 3,10,8);
        fill(0);
        ellipse(gameChar_x - 8, gameChar_y - 3,10,8);
    }
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for(var i = 0; i < clouds.length; i++)
    {
        fill(255, 255, 255);
        ellipse(clouds[i].pos_x,clouds[i].pos_y,90, 60); 
        ellipse(clouds[i].pos_x+50,clouds[i].pos_y,90, 60);
        ellipse(clouds[i].pos_x+20,clouds[i].pos_y-30,90, 60);
    }
}
// Function to draw mountains objects.
function drawMountains()
{
    for(var i = 0; i < mountains.length; i++)
    {
        strokeWeight(1);
        fill(100);
        triangle(mountains[i].pos_x - mountains[i].height/2, floorPos_y, mountains[i].pos_x, floorPos_y - mountains[i].height, mountains[i].pos_x + mountains[i].height/2, floorPos_y);
    }
}
// Function to draw trees objects.
function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
    {
        strokeWeight(0);
        fill(61, 193, 54);
        ellipse(trees_x[i], floorPos_y - 230 , 300, 250);
        fill(85, 71, 33);
        rect(trees_x[i] -5 , floorPos_y - 230 , 15, 235,10);    
        fill(85, 71, 33);
        rect(trees_x[i] -5 , floorPos_y - 200 , 100, 10);
        fill(85, 71, 33);
        rect(trees_x[i] -5 , floorPos_y - 180 , -90, 10);   
        fill(85, 71, 33);
        rect(trees_x[i] -50 , floorPos_y - 180 , -5, -20);
    }
}
// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    fill(25);
    strokeWeight(0);
    rect(t_canyon.x_pos, floorPos_y, t_canyon.width, height - floorPos_y);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if(gameChar_world_x > t_canyon.x_pos && gameChar_world_x < t_canyon.x_pos + t_canyon.width && gameChar_y >= floorPos_y)
    {
        console.log('fall');
        isPlummeting = true;
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{ 
    strokeWeight(8);
    stroke(180);
    line(t_collectable.x_pos, t_collectable.y_pos-5, t_collectable.x_pos, t_collectable.y_pos-80);
    stroke(90);
    line(t_collectable.x_pos-10, t_collectable.y_pos-80, t_collectable.x_pos+10, t_collectable.y_pos-80);
    stroke(139);
    line(t_collectable.x_pos, t_collectable.y_pos-85, t_collectable.x_pos, t_collectable.y_pos-100);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < t_collectable.size)
    {
        t_collectable.isFound = true;
        console.log('yay');
        game_score += 1;
    }
}

function drawFlagpole(t_flagpole)
{
    strokeWeight(10);
    stroke(180);
    line(t_flagpole.x_pos, floorPos_y, t_flagpole.x_pos, floorPos_y - t_flagpole.height);
    
    if(t_flagpole.isReached)
    {
        fill(255,0,255);
        rect(t_flagpole.x_pos, floorPos_y - t_flagpole.height, 60,40);
    }
}

function checkFlagpole(t_flagpole)
{
    if(dist(gameChar_world_x, 0, t_flagpole.x_pos, 0) < 20)
     {
        t_flagpole.isReached = true;
     }
}
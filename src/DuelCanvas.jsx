import React, { useRef, useEffect, useState, useCallback } from "react";

const SPELL_RADIUS = 5;
const HERO_RADIUS = 20;
const HERO_1=0;
const HERO_2=1;
const START_X_1=50;
const START_X_2=750;
const START_Y = 100;
const SPELL_COLOR_1="orange";
const SPELL_COLOR_2="yellow";
const LEFT=-1;
const RIGHT=1;
const CIRCLE=Math.PI*2;
const SCORE_X_1=50;
const SCORE_X_2=650;
const SCORE_Y=50;
const SCORE_FONT="20px Arial";
const SCORE_COLOR="black";
const UPDATE_INTERVAL=1000 / 60;

const drawCircle=(ctx,x,y,radius,color)=>{
    ctx.beginPath();
    // draw circle with centre at (x,y)
    ctx.arc(x, y,radius, 0, CIRCLE);
    ctx.fillStyle =color;
    ctx.fill();
    ctx.closePath();
}


const DuelCanvas = ({ canvasWidth,canvasHeight,hero1Color,hero2Color,hero1Speed, hero2Speed, hero1ShootFreq, hero2ShootFreq }) => {
  const CANVAS_X_CENTER = canvasWidth / 2;
  const CANVAS_Y_CENTER=canvasHeight /2;
  class Hero {
    constructor(x, y, dy, radius, color) {
      this.x = x;
      this.y = y;
      this.dy = dy;
      this.radius = radius;
      this.color = color;
    }
  
    move(speed, canvasHeight) {
      this.y += this.dy * speed;
      if (this.y < this.radius) { // bouncing from top
        this.bounce();
        this.y = this.radius; // set position to top
      } else if (this.y > canvasHeight - this.radius) { // bouncing from bottom
        this.bounce();
        this.y = canvasHeight - this.radius; // set position to bottom
      }
    }
  
    draw(ctx) {
      drawCircle(ctx,this.x, this.y, this.radius, this.color);
    }
  
    shoot(spellRadius, spellColor) {
      let spellX = this.x;
      if (spellX < CANVAS_X_CENTER) { // left hero shooting
        spellX += this.radius; // shoot from right side
      } else { // right hero shooting
        spellX -= this.radius; // shoot from left side
      }
      let spellY = this.y + this.dy * 3; // so it looks like hero is shooting from correct place
      return new Spell(spellX, spellY, spellColor, spellRadius);
    }
  
    bounce() {
      this.dy = -this.dy;
    }
  }
  class Spell {
    constructor(x, y, color, radius) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.radius = radius;
      this.dx = this.x < CANVAS_X_CENTER ? RIGHT: LEFT; // if left hero, spell moves right, if right hero, spell moves left
    }
  
    move() {
      this.x += this.dx;
    }
  
    draw(ctx) {
      drawCircle(ctx,this.x, this.y, this.radius, this.color);
    }
  }
  
  
  class Game {
    constructor() {
      this.hero1 = new Hero(START_X_1, START_Y, 1, HERO_RADIUS, hero1Color);
      this.hero2 = new Hero(START_X_2, START_Y, 1, HERO_RADIUS, hero2Color);
      this.spells = [];
      this.score1 = 0;
      this.score2 = 0;
      this.spellColors = [ SPELL_COLOR_1,SPELL_COLOR_2 ];
    }
  
    updateHero(hero, speed, mousePositionX, mousePositionY) {
      hero.move(speed, canvasHeight);
       
      const dx = mousePositionX - hero.x;
      const dy = mousePositionY - hero.y;
      const distanceSq = dx * dx + dy * dy; 
      if (distanceSq < hero.radius * hero.radius) {
          if ((hero.dy > 0 && mousePositionY > hero.y) || (hero.dy < 0 && mousePositionY < hero.y) ) {
              hero.bounce();
          } 
      }
    }
  
    updateSpells(ctx) {
      const updatedSpells = [];
      for (const spell of this.spells) {
        spell.move();
        if (spell.x < 0 || spell.x > canvasWidth) {
          continue;
        }
        spell.draw(ctx);
        if (this.isColliding(spell.x,spell.y, this.hero1)) {
          this.score2++;
        } else if (this.isColliding(spell.x, spell.y, this.hero2)) {
          this.score1++;
        } else {
          updatedSpells.push(spell);
        }
      }
      this.spells = updatedSpells;
    }
  
    isColliding(x,y, hero) {
      return Math.abs(x - hero.x) < hero.radius && Math.abs(y - hero.y) < hero.radius;
    }
  
    shootSpell(hero) {
      const color = this.spellColors[hero === this.hero1 ? HERO_1: HERO_2];
      this.spells.push(hero.shoot(SPELL_RADIUS, color));
    }
  
    setHeroSpellColor(hero, color) {
      this.spellColors[hero === this.hero1 ? HERO_1 : HERO_2] = color;
    }
  }
  
  const canvasRef = useRef(null);
  const [game] = useState(new Game());
  const [menuPositionX, setMenuPositionX] = useState(0);
  const [menuPositionY, setMenuPositionY] = useState(0);
  const [selectedHero, setSelectedHero] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [mousePositionX, setMousePositionX] = useState(0);
  const [mousePositionY, setMousePositionY] = useState(0);
  const [lastMouseMoveTime, setLastMouseMoveTime] = useState(0);
  const colors =["blue", "red", "green", "purple", "orange"];

  const updateGame = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw heroes
    game.updateHero(game.hero1, hero1Speed, mousePositionX, mousePositionY);
    game.updateHero(game.hero2, hero2Speed, mousePositionX, mousePositionY);
    game.hero1.draw(ctx);
    game.hero2.draw(ctx);

    // Update and draw spells
    game.updateSpells(ctx);

    // Draw score
    ctx.font = SCORE_FONT;
    ctx.fillStyle = SCORE_COLOR;
    ctx.fillText("Hero 1: "+ game.score1, SCORE_X_1, SCORE_Y);
    ctx.fillText("Hero 2: " + game.score2, SCORE_X_2, SCORE_Y);
  }, [game, hero1Speed, hero2Speed, mousePositionX, mousePositionY]);

  useEffect(() => {
    const hero1ShootInterval = setInterval(() => {
      game.shootSpell(game.hero1);
      console.log("spell");
    }, 2000 / hero1ShootFreq);
    const hero2ShootInterval = setInterval(() => {
      game.shootSpell(game.hero2);
    }, 2000 / hero2ShootFreq);
    return () => {
      clearInterval(hero1ShootInterval);
      clearInterval(hero2ShootInterval);
    };
  }, [hero1ShootFreq, hero2ShootFreq, game]);

  useEffect(() => {
    const gameLoopInterval = setInterval(updateGame, UPDATE_INTERVAL);
    return () => {
      clearInterval(gameLoopInterval);
    };
  }, [updateGame, game]);
const showMenu=(x,y)=>{
  setMenuPositionX( x );
  setMenuPositionY( y );
  setMenuVisible(true);
}
  const handleCanvasClick = (e) => {
    const x = mousePositionX;
    const y = mousePositionY;
    let positionY=y;
    if (y<CANVAS_Y_CENTER){
      positionY+=100;
    }
    else{
      positionY-=100;
    }
    if (game.isColliding(x, y, game.hero1)) {
      setSelectedHero(HERO_1);
      showMenu(x + 50,positionY)
    } else if (game.isColliding( x, y, game.hero2)) {
      setSelectedHero(HERO_2);
      showMenu( x - 180,positionY );
    } else if(menuVisible) {
      setMenuVisible(false);
    }
  };

  const handleMouseMove = (e) => {
    const currentTime = Date.now();
    if (currentTime - lastMouseMoveTime >= 50) { 
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePositionX(x);
      setMousePositionY(y);
      setLastMouseMoveTime(currentTime);
    }
  };

  const handleColorChange = (color) => {
    if (selectedHero === HERO_1) {
      game.setHeroSpellColor(game.hero1, color);
    } else {
      game.setHeroSpellColor(game.hero2, color);
    }
    setMenuVisible(false); // Close the menu after changing color
  };
  const menuStyle={
    position: "absolute",
    left: menuPositionX+"px",
    top: menuPositionY+"px",
    backgroundColor: "white",
    padding: "2px 5px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  };
  const menuItemStyle={
      padding: "8px 10px",
      borderRadius: "4px",
      textAlign: "center",
      color: "#333",  
  }
  const menuItems=
    <ol style={{ margin: 0, padding: 0, listStyleType: "none" }}>
    {colors.map(color => (
      <li
        key={color}
        onClick={() => handleColorChange(color)}
        style={menuItemStyle}
        
      >
        {color}
      </li>
    ))}
  </ol>
  
  return (
    <div>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ border: "2px solid black" }}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
      />
      {menuVisible && (
  <div
    style={menuStyle}
  >
    {menuItems}
   
  </div>
)}

    </div>
  );
};

export default DuelCanvas;

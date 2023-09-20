class Box {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = 8;
        this.fade = 255; //Initialise opacity
        this.fadeStartY = 250; //Set the y position after which fade begins
        // this.w = w;
        // this.h = h;
        let options = {
            friction: 0.1,
            restitution: 0.6,
            mass: 0.2,
        }
        this.body = Bodies.circle(this.x, this.y, this.r, options);
        
        Composite.add(world, this.body);
    }
  
    fadeOut(){
      if(this.body.position.y > this.fadeStartY){
      this.fade -=10;
      }
    }

    show() {
        let pos = this.body.position;
        let angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle+PI/4);
        rectMode(CENTER);
        strokeWeight(1);
        stroke(0, this.fade);
        fill(0, this.fade);
        //rect(0, 0, this.w, this.h);
        ellipse(0, 0, this.r*1.5, this.r*2.0);
        pop();
    }
}
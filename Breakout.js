/*
 * File: Breakout.js
 * -----------------
 * This program implements the Breakout game.
 */
"use strict";

/* Constants */
const GWINDOW_WIDTH = 360;           /* Width of the graphics window      */
const GWINDOW_HEIGHT = 600;          /* Height of the graphics window     */
const N_ROWS = 10;                   /* Number of brick rows              */
const N_COLS = 10;                   /* Number of brick columns           */
const BRICK_ASPECT_RATIO = 4 / 1;    /* Width to height ratio of a brick  */
const BRICK_TO_BALL_RATIO = 3 / 2;   /* Ratio of brick width to ball size */
const BRICK_TO_PADDLE_RATIO = 2 / 3; /* Ratio of brick to paddle width    */
const BRICK_SEP = 2;                 /* Separation between bricks         */
const TOP_FRACTION = 0.1;            /* Fraction of window above bricks   */
const BOTTOM_FRACTION = 0.05;        /* Fraction of window below paddle   */
const N_BALLS = 3;                   /* Number of balls in a game         */
const TIME_STEP = 10;                /* Time step in milliseconds         */
const INITIAL_Y_VELOCITY = 3.0;      /* Starting y velocity downward      */
const MIN_X_VELOCITY = 1.0;          /* Minimum random x velocity         */
const MAX_X_VELOCITY = 3.0;          /* Maximum random x velocity         */

/* Derived constants */
const BRICK_WIDTH = (GWINDOW_WIDTH - (N_COLS + 1) * BRICK_SEP) / N_COLS;
const BRICK_HEIGHT = BRICK_WIDTH / BRICK_ASPECT_RATIO;
const PADDLE_WIDTH = BRICK_WIDTH / BRICK_TO_PADDLE_RATIO;
const PADDLE_HEIGHT = BRICK_HEIGHT / BRICK_TO_PADDLE_RATIO;
const PADDLE_Y = (1 - BOTTOM_FRACTION) * GWINDOW_HEIGHT - PADDLE_HEIGHT;
const BALL_SIZE = BRICK_WIDTH / BRICK_TO_BALL_RATIO;

/* Main program */

function Breakout() {
  // You fill this in along with any helper and callback functions.
  let gw = GWindow(GWINDOW_WIDTH, GWINDOW_HEIGHT);
  let brick = null;
  let i = null;
  let j = null;
  let brickCount = N_ROWS * N_COLS;
  setUpBricks();
  let paddle = null;
  createPaddle();
  let ball = createBall();
  let vy = INITIAL_Y_VELOCITY;
  let vx = randomReal(MIN_X_VELOCITY, MAX_X_VELOCITY);
  if (randomChance()) vx = -vx;
  let ballMoves = false;
  let ballNum = 0;
  let mouseClick = function(e) {
    ballMoves = true;
  }
  gw.addEventListener("click", mouseClick);


  function step() {
    if (ballMoves) { //move ball
      ball.move(vx, vy);
      if (ball.getX() <= 0 || ball.getX() >= (GWINDOW_WIDTH - BALL_SIZE)) {
      vx = -1 * vx;
      }

      if (ball.getY() + BALL_SIZE >= GWINDOW_HEIGHT || ball.getY() <= 0) {
        vy = -1 * vy;
      }

      let object = getCollidingObject();

      if (object !== null) {
        if (object === paddle && vy > 0) {
          vy = -1 * vy;
        }
        else if (object !== paddle) {
          // console.log(object);
          vy = -1 * vy;
          gw.remove(object);
          brickCount = brickCount - 1;
          console.log(brickCount);
        }
      }
      if (ball.getY() + BALL_SIZE >= GWINDOW_HEIGHT) { //stop game
        clearInterval(timer);
        gw.remove(ball);
        ballMoves = false;
        ballNum++;

        if (ballNum === 3) {
          let loseMessage = GLabel("You Lose :(", GWINDOW_WIDTH / 4, GWINDOW_HEIGHT / 2);
          loseMessage.setFont("36px Helvetica");
          loseMessage.setColor("Pink");
          gw.add(loseMessage);
          return loseMessage;
        }

        ball = createBall();
        vy = -1 * vy;
        timer = setInterval(step, TIME_STEP);
      } 


      if (brickCount === 0) { //win game
        clearInterval(timer);
        let winMessage = GLabel("You Win!!!", GWINDOW_WIDTH / 4, GWINDOW_HEIGHT / 2);
        winMessage.setFont("36px Helvetica");
        winMessage.setColor("Pink");
        gw.add(winMessage);
        return winMessage;
      }
    }    
  }

  let timer = setInterval(step, TIME_STEP);

  function setUpBricks() { //milestone 1
    let numBricks = 0;
    for (i = 0; i < N_ROWS; i++) {
      for (j = 0; j < N_COLS; j++) {
        brick = GRect((((GWINDOW_WIDTH - (N_COLS * BRICK_WIDTH) - (BRICK_SEP * (N_COLS - 1))) / 2) + (BRICK_SEP * j) + (BRICK_WIDTH * j)), (TOP_FRACTION * GWINDOW_HEIGHT) + (BRICK_HEIGHT * i) + (BRICK_SEP * i), BRICK_WIDTH, BRICK_HEIGHT)
        
        brick.setColor("White");

        if (i === 0 || i === 1) {
        brick.setFillColor("Red");
        }

        else if (i === 2 || i === 3) {
          brick.setFillColor("Orange");
        }

        else if (i === 4 || i === 5) {
          brick.setFillColor("Green");
        }

        else if (i === 6 || i === 7) {
          brick.setFillColor("Cyan");
        }

        else if (i === 8 || i === 9) {
          brick.setFillColor("Blue");
        }

        brick.setFilled(true);
        gw.add(brick);
        numBricks++;
      }
    }
  }


  function createPaddle() { //milestone 2
    paddle = GRect((GWINDOW_WIDTH - PADDLE_WIDTH) / 2, PADDLE_Y, PADDLE_WIDTH, PADDLE_HEIGHT);
    paddle.setFilled(true);
    gw.add(paddle);

    let mousemove = function(e) {
      let paddleX = e.getX();
      if (paddleX >= GWINDOW_WIDTH - PADDLE_WIDTH) {
        paddleX = GWINDOW_WIDTH - PADDLE_WIDTH;
      }
      paddle.setLocation(paddleX, PADDLE_Y);
    }
    
    gw.addEventListener("mousemove", mousemove);
    return paddle;
  }


  function createBall() { //milestone 3
      let ball = GOval(((GWINDOW_WIDTH - BALL_SIZE) / 2), (GWINDOW_HEIGHT - BALL_SIZE) / 2, BALL_SIZE, BALL_SIZE);
      ball.setFilled(true);
      gw.add(ball);
      return ball;
  }
  


    function getCollidingObject() {
      let collider = gw.getElementAt(ball.getX(), ball.getY());
      if (collider !== null) {
        return collider;
      }
      collider = gw.getElementAt(ball.getX() + (BALL_SIZE), ball.getY());
      if (collider !== null) {
        return collider;
      }
      collider = gw.getElementAt(ball.getX(), ball.getY() + (BALL_SIZE));
      if (collider !== null) {
        return collider;
      }
      collider = gw.getElementAt(ball.getX() + (BALL_SIZE), ball.getY() + (BALL_SIZE));
      if (collider !== null) {
        return collider;
      }
      else return null;
  }
}
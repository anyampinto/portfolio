/*
 * File: SamplerQuilt.js
 * ---------------------
 * This program uses the object-oriented graphics model to draw
 * a Sampler Quilt to the screen. :)
 */

"use strict";

/* Constants */
const PATCH_DIMENSION = 75;
const NUM_ROWS = 7;
const NUM_COLUMNS = 7;
const BORDER_COLOR = "Black";
const BULLSEYE_BOLD_COLOR = "Red";
const BULLSEYE_MILD_COLOR = "White";
const LOG_COLOR = "Tan";
const LOVE_FRAME_COLOR = "Pink";
const LOVE_MAT_COLOR = "White";

/* Derived Constants */
const WINDOW_WIDTH = NUM_COLUMNS * PATCH_DIMENSION;
const WINDOW_HEIGHT = NUM_ROWS * PATCH_DIMENSION;

/*
 * Function: DrawSamplerQuilt
 * --------------------------
 * Draws a sampler quilt as outlined in the assignment handout.
 */

function DrawSamplerQuilt() {
   let gw = GWindow(WINDOW_WIDTH, WINDOW_HEIGHT);
   drawQuilt(gw);
}

/*
 * Function: drawQuilt
 * --------------------------
 * Inserts all of the sampler quilt into the supplied graphics window.
 */
function drawQuilt(gw) {
   for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLUMNS; col++) {
         let patch = createPlaceholderPatch();
         gw.add(patch, col * PATCH_DIMENSION, row * PATCH_DIMENSION);

         if ((col + row) % 4 === 0) {
            let bullseye = drawBullseye();
            gw.add(bullseye, col * PATCH_DIMENSION, row * PATCH_DIMENSION);
         }

         else if ((col + row) % 4 === 1) {
            let logCabin = drawLogCabin();
            gw.add(logCabin, col * PATCH_DIMENSION, row * PATCH_DIMENSION);
         }

         else if ((col + row) % 4 === 2) {
            let flowerPatch = drawFlowerPatch();
            gw.add(flowerPatch, col * PATCH_DIMENSION, row * PATCH_DIMENSION);
         }

         if ((col + row) % 4 === 3) {
            let photoPatch = drawImagePatch();
            gw.add(photoPatch, col * PATCH_DIMENSION, row * PATCH_DIMENSION);
         }
         // let bullseye = drawBullseye();
         // gw.add(bullseye, col * PATCH_DIMENSION, row * PATCH_DIMENSION);
         // let flowerPatch = drawFlowerPatch();
         // gw.add(flowerPatch, col * PATCH_DIMENSION, row * PATCH_DIMENSION);
         // let logCabin = drawLogCabin();
         // gw.add(logCabin, col * PATCH_DIMENSION, row * PATCH_DIMENSION);
         // let photoPatch = drawImagePatch();
         // gw.add(photoPatch, col * PATCH_DIMENSION, row * PATCH_DIMENSION);
      }
   }
}

/**s
 * Function: createPlaceholderPatch
 * --------------------------------
 * This function is only here to draw a simple rectangle of the correct
 * size to occupy the space where a more elaborate patch belongs.  You will
 * want to remove it after you've implemented everything.
 */
function createPlaceholderPatch() {
   return GRect(PATCH_DIMENSION, PATCH_DIMENSION);
}

function drawBullseye() {
   let circles = GCompound();
   for (let i = 1; i <= 7; i++) {
      let circle = (GOval(5 * i, 5 * i, PATCH_DIMENSION - 10 * i, PATCH_DIMENSION - 10 * i));
      if (i % 2 !== 0) {
         circle.setFillColor(BULLSEYE_BOLD_COLOR);
         circle.setFilled(true);
      }
      else {
         circle.setFillColor(BULLSEYE_MILD_COLOR);
         circle.setFilled(true);

      }
      circles.add (circle);

   }
   return circles;

}

function drawFlowerPatch() {
   let flower = GCompound();

   let petal1 = (GOval(PATCH_DIMENSION / 15, PATCH_DIMENSION / 15, (PATCH_DIMENSION / 5) * 2, (PATCH_DIMENSION / 5) * 2));
   petal1.setFillColor(randomColor());
   petal1.setFilled(true);
   flower.add (petal1);
   let petal2 = (GOval(PATCH_DIMENSION / 15, PATCH_DIMENSION - 35, (PATCH_DIMENSION / 5) * 2, (PATCH_DIMENSION / 5) * 2));
   petal2.setFillColor(randomColor());
   petal2.setFilled(true);
   flower.add (petal2);
   let petal3 = (GOval(PATCH_DIMENSION - 35, PATCH_DIMENSION / 15, (PATCH_DIMENSION / 5) * 2, (PATCH_DIMENSION / 5) * 2));
   petal3.setFillColor(randomColor());
   petal3.setFilled(true);
   flower.add (petal3);
   let petal4 = (GOval(PATCH_DIMENSION - 35, PATCH_DIMENSION - 35, (PATCH_DIMENSION / 5) * 2, (PATCH_DIMENSION / 5) * 2));
   petal4.setFillColor(randomColor());
   petal4.setFilled(true);
   flower.add (petal4);
   let petal5 = (GOval((PATCH_DIMENSION / 2) - (PATCH_DIMENSION / 5), (PATCH_DIMENSION / 2) - (PATCH_DIMENSION / 5), (PATCH_DIMENSION / 5) * 2, (PATCH_DIMENSION / 5) * 2));
   petal5.setFillColor(randomColor());
   petal5.setFilled(true);
   flower.add (petal5);
   return flower;

}

function drawLogCabin() {
   let logs = GCompound();
   // logs.add (GRect(0, 0, PATCH_DIMENSION - (PATCH_DIMENSION / 9), PATCH_DIMENSION / 9));
   // logs.add (GRect(PATCH_DIMENSION / 9, PATCH_DIMENSION - (PATCH_DIMENSION / 9), PATCH_DIMENSION - (PATCH_DIMENSION / 9), PATCH_DIMENSION / 9));
   // logs.add (GRect(0, PATCH_DIMENSION / 9, PATCH_DIMENSION / 9, PATCH_DIMENSION - (PATCH_DIMENSION / 9)));
   // logs.add (GRect(PATCH_DIMENSION - (PATCH_DIMENSION / 9), 0, PATCH_DIMENSION / 9, PATCH_DIMENSION - (PATCH_DIMENSION / 9)));

   for (let i = 0; i <= 3; i++) {
      let log = (GRect(0 + ((PATCH_DIMENSION / 9) * i), 0 + ((PATCH_DIMENSION / 9) * (1 + i)), PATCH_DIMENSION / 9, PATCH_DIMENSION - ((PATCH_DIMENSION / 9) * (2 * i + 1)))); //left
      log.setFillColor(LOG_COLOR);
      log.setFilled(true);
      logs.add (log);
   }

   for (let i = 0; i <= 3; i++) {
      let log = (GRect(0 + ((PATCH_DIMENSION / 9) * i), 0 + ((PATCH_DIMENSION / 9) * i), PATCH_DIMENSION - ((PATCH_DIMENSION / 9) * (2 * i + 1)), PATCH_DIMENSION / 9)); //top
      log.setFillColor(LOG_COLOR);
      log.setFilled(true);
      logs.add (log);
   }

   for (let i = 0; i <= 3; i++) {
      let log = (GRect(PATCH_DIMENSION - ((PATCH_DIMENSION / 9) * (i + 1)), 0 + ((PATCH_DIMENSION / 9) * i), PATCH_DIMENSION / 9, PATCH_DIMENSION - ((PATCH_DIMENSION / 9) * (2 * i + 1)))); //right
      log.setFillColor(LOG_COLOR);
      log.setFilled(true);
      logs.add (log);
   }

   for (let i = 0; i <= 3; i++) {
      let log = (GRect(0 + ((PATCH_DIMENSION / 9) * (i + 1)), PATCH_DIMENSION - ((PATCH_DIMENSION / 9) * (i + 1)), PATCH_DIMENSION - ((PATCH_DIMENSION / 9) * (2 * i + 1)), PATCH_DIMENSION / 9)); //bottom
      log.setFillColor(LOG_COLOR);
      log.setFilled(true);
      logs.add (log);
   }

   return logs;

}


function drawImagePatch() {
   let imagePatch = GCompound();

   let sectionLeaders = ["https://cs106ax.stanford.edu/img/ashlee.png", "https://cs106ax.stanford.edu/img/artur.png", "https://cs106ax.stanford.edu/img/colin.png", "https://cs106ax.stanford.edu/img/kaia.png", "https://cs106ax.stanford.edu/img/yubin.png"];

   let random = sectionLeaders[randomInteger(0, 4)];
   let image = GImage(random);
   imagePatch.add (image)

   for (let i = 0; i <= 1; i++) {
      let frame = (GRect(0 + ((PATCH_DIMENSION / 9) * i), 0 + ((PATCH_DIMENSION / 9) * (1 + i)), PATCH_DIMENSION / 9, PATCH_DIMENSION - ((PATCH_DIMENSION / 9) * (2 * i + 1)))); //left
      if (i === 0) {
         frame.setFillColor(LOVE_FRAME_COLOR);
      }
      else frame.setFillColor(LOVE_MAT_COLOR);
      frame.setFilled(true);
      imagePatch.add (frame);
   }

   for (let i = 0; i <= 1; i++) {
      let frame = (GRect(0 + ((PATCH_DIMENSION / 9) * i), 0 + ((PATCH_DIMENSION / 9) * i), PATCH_DIMENSION - ((PATCH_DIMENSION / 9) * (2 * i + 1)), PATCH_DIMENSION / 9)); //top
       if (i === 0) {
         frame.setFillColor(LOVE_FRAME_COLOR);
      }
      else frame.setFillColor(LOVE_MAT_COLOR);
      frame.setFilled(true);
      imagePatch.add (frame);
   }

   for (let i = 0; i <= 1; i++) {
      let frame = (GRect(PATCH_DIMENSION - ((PATCH_DIMENSION / 9) * (i + 1)), 0 + ((PATCH_DIMENSION / 9) * i), PATCH_DIMENSION / 9, PATCH_DIMENSION - ((PATCH_DIMENSION / 9) * (2 * i + 1)))); //right
       if (i === 0) {
         frame.setFillColor(LOVE_FRAME_COLOR);
      }
      else frame.setFillColor(LOVE_MAT_COLOR);
      frame.setFilled(true);
      imagePatch.add (frame);
   }

   for (let i = 0; i <= 1; i++) {
      let frame = (GRect(0 + ((PATCH_DIMENSION / 9) * (i + 1)), PATCH_DIMENSION - ((PATCH_DIMENSION / 9) * (i + 1)), PATCH_DIMENSION - ((PATCH_DIMENSION / 9) * (2 * i + 1)), PATCH_DIMENSION / 9)); //bottom
       if (i === 0) {
         frame.setFillColor(LOVE_FRAME_COLOR);
      }
      else frame.setFillColor(LOVE_MAT_COLOR);
      frame.setFilled(true);
      imagePatch.add (frame);
   }

   return imagePatch;
}

/*
 * File: SternBrocotSequences.js
 * -----------------------------
 * Exports a function that generates Stern-Brocot sequences for
 * arbitrary real numbers between 0 and 1.
 */

"use strict";

function TestSternBrocotSequences() {
   console.log("sbs(0.5) -> " + sbs(0.5));
   console.log("sbs(0.125) -> " + sbs(0.125));
   console.log("sbs(0.65) -> " + sbs(0.65));
   console.log("sbs(Math.E - 2) -> " + sbs(Math.E - 2));
   console.log("sbs(Math.PI - 3) -> " + sbs(Math.PI - 3));
   console.log("sbs(Math.PI - 3, 100) -> " + sbs(Math.PI - 3, 100));
   console.log("");
   console.log("Now use the console to test the function for arbitrary positive numbers.");
   evaluateExpressions();
}

/*
 * Function: sbs
 * -------------
 * Accepts the provided number and an optional max length and returns
 * the Stern-Brocot sequence best representing it.  We assume the supplied
 * number is between 0 and 1, and that max, if supplied, is a reasonably small
 * (in the hundreds).
 */

const DEFAULT_MAX_LENGTH = 500;
function sbs(num, max) {
   if (max === undefined) max = DEFAULT_MAX_LENGTH; // second argument is missing? use 500 as a default
   // replace the following line with your implementation, writing helper functions as necessary
   let smallNum = 0;
   let smallDen = 1;
   let bigNum = 1;
   let bigDen = 1;
   let midNum = smallNum + bigNum;
   let midDen = smallDen + bigDen;
   let lCount = 0;
   let rCount = 0;
   let letterSeq = ""
   let i = 0;

   while (midNum/midDen !== num && i < max) {
      if (num < midNum/midDen) { //go left
         lCount++;
         bigNum = midNum;
         bigDen = midDen;
         midNum = bigNum + smallNum;
         midDen = bigDen + smallDen;

         if (rCount === 1) {
            letterSeq += "R" + " ";
            rCount = 0;
         }
         
         else if (rCount > 1) {
            letterSeq += "R" + rCount + " ";
            rCount = 0;
         }
      }
      else { //go right
         rCount++;
         smallNum = midNum;
         smallDen = midDen;
         midNum = bigNum + smallNum;
         midDen = bigDen + smallDen;

         if (lCount === 1) {
            letterSeq += "L" + " ";
            lCount = 0;
         }

         else if (lCount > 1) {
            letterSeq += "L" + lCount + " ";
            lCount = 0;
         }
      }
      i++;
   }

   if (lCount !== 0) {
      letterSeq += "L" + lCount;
   }

   else if (rCount !== 0) {
      letterSeq += "R" + rCount;
   }

   return letterSeq;
}

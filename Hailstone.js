/*
 * File: Hailstone.js
 * ------------------
 * This program displays the Hailstone sequence for a number.
 */
"use strict";

function TestHailstone() {
  console.log("Use this expression evaluator to ensure your hailstone implementation works.");
	evaluateExpressions();
}
	
/*
/*
 * Function: hailstone
 * -------------------
 * Accepts the supplied number and prints the sequence of numbers that lead the original
 * number down to 1 (along with information about how the intermediate numbers were computed).
 */


function hailstone(n) {
	console.log("This is a placeholder for the Hailstone sequence launched from the number " + n + ".");
	let number = n;
	let i = 0;
	while (n !== 1) {
		if (n % 2 === 0) {
			number = n / 2;
			console.log(n + " is even, so I take half: " + number);
			n = number;
			i++;
	}
		else {
			number = ( n * 3 ) + 1
			console.log(n + " is odd, so I make 3n+1: " + number);
			n = number;
			i++;
	}
}
console.log("The process took " + i + " steps to reach 1.");
}

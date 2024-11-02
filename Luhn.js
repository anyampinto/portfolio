/**
 * File: Luhn.js
 * -------------
 * This program exports the isValid predicate method, which returns true
 * if and only if the number supplied as an argument could be a valid credit
 * card number according to Luhn's algorithm.
 */

"use strict";
const NUMBERS = [ 4460246643298726, 4460246643298627, 4460246643298727 ];

/* Main program */
function TestLuhnAlgorithm() {
	for (let i = 0; i < NUMBERS.length; i++) {
		console.log("Account number " + NUMBERS[i] + " -> " + (isValid(NUMBERS[i]) ? "valid" : "invalid"));
	}
}

/**
 * Function: isValid
 * -----------------
 * Returns true if and only if the supplied number
 * meets the requirements imposed by Luhn's algorithm.
 */
function isValid(number) {
	
	let luhnSum = 0;

	while (number > 9) {
		luhnSum += (number % 10);
		number = Math.floor(number / 10);
		if (((number % 10) * 2) > 9) {
			luhnSum += (((number % 10) * 2) - 9);
		}
		else {
			luhnSum += ((number % 10) * 2);
		}
		number = Math.floor(number / 10);
	}
	luhnSum += number;

	if (luhnSum % 10 === 0) {
		return true;
	}
	else return false;
}


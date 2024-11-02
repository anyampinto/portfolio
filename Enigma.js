/*
 * File: Enigma.js
 * ---------------
 * This program implements a graphical simulation of the Enigma machine.
 */

"use strict";

/* Main program */

function Enigma() {
	let enigmaImage = GImage("EnigmaTopView.png");
	enigmaImage.addEventListener("load", function() {
		let gw = GWindow(enigmaImage.getWidth(), enigmaImage.getHeight());
		gw.add(enigmaImage);
		runEnigmaSimulation(gw);
   });
}
function runEnigmaSimulation(gw) {
   let enigma = {lamps:[], rotors:[]};
   let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
   for (let i = 0; i < 26; i++) { //creates both the keyboard and the lamp keys.
   	createKey(alphabet[i], KEY_LOCATIONS[i].x, KEY_LOCATIONS[i].y);
   	createLamp(alphabet[i], LAMP_LOCATIONS[i].x, LAMP_LOCATIONS[i].y);
   }
   //creates all three rotors, set to A (default).
   let slowRotor = createRotor("A", ROTOR_LOCATIONS[0].x, ROTOR_LOCATIONS[0].y, 0);
   let mediumRotor = createRotor("A", ROTOR_LOCATIONS[1].x, ROTOR_LOCATIONS[1].y, 1);
   let fastRotor = createRotor("A", ROTOR_LOCATIONS[2].x, ROTOR_LOCATIONS[2].y, 2);
   // create each individual key
   function createKey(letter, x, y) {
   	let key = GCompound();
   	let outsideKey = GOval(x - KEY_RADIUS, y - KEY_RADIUS, 2 * KEY_RADIUS, 2 * KEY_RADIUS);
   	outsideKey.setColor(KEY_BORDER_COLOR);
   	outsideKey.setFilled(true);
   	key.add(outsideKey);
   	let insideKey = GOval(x + KEY_BORDER - KEY_RADIUS, y + KEY_BORDER - KEY_RADIUS, 2 * (KEY_RADIUS - KEY_BORDER), 2 * (KEY_RADIUS - KEY_BORDER));
   	insideKey.setColor(KEY_BGCOLOR);
   	insideKey.setFilled(true);
   	key.add(insideKey);
   	let letterKey = GLabel(letter);
   	letterKey.setFont(KEY_FONT);
   	letterKey.setColor(KEY_UP_COLOR);
   	letterKey.setTextAlign("center");
   	letterKey.setBaseline("middle");
   	key.add(letterKey, x, y);
   	gw.add(key);
   	let letterIndex = alphabet.indexOf(letter);
   	//mousedownAction makes the keyboard and corresponding lamp key light up. it also advances the rotor(s)
   	//to find the corresponding lamp key, it runs the encryption using the applyPermutation function 7 times.
   	key.mousedownAction = function(enigma) {
			letterKey.setColor(KEY_DOWN_COLOR);
			advanceRotor(fastRotor);
			if (fastRotor.rotorCarry === true) {
				advanceRotor(mediumRotor);
			if (mediumRotor.rotorCarry === true) {
				advanceRotor(slowRotor);
				}
			}
			let answer = applyPermutation(alphabet.indexOf(letter), ROTOR_PERMUTATIONS[2], enigma.rotors[2].offset);
			answer = applyPermutation(answer, ROTOR_PERMUTATIONS[1], enigma.rotors[1].offset);
			answer = applyPermutation(answer, ROTOR_PERMUTATIONS[0], enigma.rotors[0].offset);
			answer = applyPermutation(answer, REFLECTOR_PERMUTATION, 0);
			answer = applyPermutation(answer, invertKey(ROTOR_PERMUTATIONS[0]), enigma.rotors[0].offset);
			answer = applyPermutation(answer, invertKey(ROTOR_PERMUTATIONS[1]), enigma.rotors[1].offset);
			answer = applyPermutation(answer, invertKey(ROTOR_PERMUTATIONS[2]), enigma.rotors[2].offset);
			enigma.lamps[answer].setColor(LAMP_ON_COLOR);
   	}
   	//mouseupAction ensures that the keys and lamp keys stop lighting up when the mouse is lifted, allowing the encryption to continue to the next letter by resetting the keys.
   	key.mouseupAction = function(enigma) {
	    	letterKey.setColor(KEY_UP_COLOR);
	    	let answer = applyPermutation(alphabet.indexOf(letter), ROTOR_PERMUTATIONS[2], enigma.rotors[2].offset)
			answer = applyPermutation(answer, ROTOR_PERMUTATIONS[1], enigma.rotors[1].offset);
			answer = applyPermutation(answer, ROTOR_PERMUTATIONS[0], enigma.rotors[0].offset);
			answer = applyPermutation(answer, REFLECTOR_PERMUTATION, 0);
			answer = applyPermutation(answer, invertKey(ROTOR_PERMUTATIONS[0]), enigma.rotors[0].offset);
			answer = applyPermutation(answer, invertKey(ROTOR_PERMUTATIONS[1]), enigma.rotors[1].offset);
			answer = applyPermutation(answer, invertKey(ROTOR_PERMUTATIONS[2]), enigma.rotors[2].offset);
			enigma.lamps[answer].setColor(LAMP_OFF_COLOR);
   	}
   }
   //mousedown detects which object within enigma the mouse is touching to control.
   let mousedownAction = function(e) {
    let obj = gw.getElementAt(e.getX(), e.getY());
    if (obj !== null && obj.mousedownAction !== undefined) {
    obj.mousedownAction(enigma);
    }
   };
   gw.addEventListener("mousedown", mousedownAction);
	//mouseup "resets" the keyboard to ensure that the keys don't stay lit up.
	let mouseupAction = function(e) {
    let obj = gw.getElementAt(e.getX(), e.getY());
    if (obj !== null && obj.mouseupAction !== undefined) {
    obj.mouseupAction(enigma);
    }
   };
   gw.addEventListener("mouseup", mouseupAction);
	//creates each individual lamp key.
	function createLamp(letter, x, y) {
		let lampKey = GCompound();
   	let lampBackground = GOval(x - LAMP_RADIUS, y - LAMP_RADIUS, 2 * LAMP_RADIUS, 2 * LAMP_RADIUS);
   	lampBackground.setColor(LAMP_BGCOLOR);
   	lampBackground.setFilled(true);
   	lampKey.add(lampBackground);
   	let lampLetter = GLabel(letter, x, y);
   	lampLetter.setFont(LAMP_FONT);
   	lampLetter.setColor(LAMP_OFF_COLOR);
   	lampLetter.setTextAlign("center");
   	lampLetter.setBaseline("middle");
   	lampKey.add(lampLetter);
   	gw.add(lampKey);
   	enigma.lamps.push(lampLetter);
	}
	//creates each individual rotor, setting offset to 0, rotorCarry to false, and calling the appropriate permutation so that all the functionality can begin at the default.
	function createRotor(letter, x, y, i) {
		let rotor = GCompound();
		let rotorBackground = GRect(x - ROTOR_WIDTH / 2, y - ROTOR_HEIGHT / 2, ROTOR_WIDTH, ROTOR_HEIGHT);
		rotorBackground.setColor(ROTOR_BGCOLOR);
		rotorBackground.setFilled(true);
		rotor.add(rotorBackground);
		let rotorLetter = GLabel(letter, x, y);
		rotorLetter.setFont(ROTOR_FONT);
		rotorLetter.setTextAlign("center");
		rotorLetter.setBaseline("middle");
		rotor.add(rotorLetter);
		rotor.rotorLetter = rotorLetter;
		let permutation = ROTOR_PERMUTATIONS[i];
		gw.add(rotor);
		let offset = 0;
		rotor.offset = offset;
		rotor.rotorCarry = false;
		enigma.rotors.push(rotor);
		return rotor;
	}
	//allows the user to advance the rotors by clicking each one.
	let clickAction = function(e) {
	 let obj = gw.getElementAt(e.getX(), e.getY());
	 if (obj === slowRotor) {
	 	advanceRotor(slowRotor);
	 }
	 else if (obj === mediumRotor) {
	 	advanceRotor(mediumRotor);
	 }
	 else if (obj === fastRotor) {
	 	advanceRotor(fastRotor);
	 }
	}
	gw.addEventListener("click", clickAction);
	//advances the rotor until Z, then resets it to A and carries over to advance the next rotor.
	function advanceRotor(rotor) {
		rotor.offset++;
		if (rotor.offset >= 26) {
		rotor.rotorCarry = true;
		rotor.offset = 0;
	}
		else {
			rotor.rotorCarry = false;
		}
		rotor.rotorLetter.setLabel(alphabet[rotor.offset]);
		return rotor.rotorCarry;
	}
	//permutation function first applies the necessary offset, then finds the corresponding letter from the permutation string, finds the corresponding index in the alphabet string, and then accounts for the offset in the opposite direction before returning the new decrypted letter.
	//In case the letter is an index over 26, it ensures that it resets the alphabet to begin at 0 again (for example, 27 would be index 0 = "A").
	function applyPermutation(index, permutation, offset) {
		index += offset;
		permutation[index];
		let index2 = alphabet.indexOf(permutation[index]);
		let answer = index2 - offset;
		if (answer < 0) {
			answer += 26;
		}
		return answer;
	}
	//ensures that after the reflector, the "connections" work in the opposite direction; i.e. if A connected to C before, C would connect to A now. we append all these new chracters to a string to be used as a new permutation.
	function invertKey(permutation) {
		let inverseString = "";
		for (let i = 0; i < 26; i++) {
			let desiredIndex = permutation.indexOf(alphabet[i]);
			let newLetter = alphabet[desiredIndex];
			inverseString += newLetter;
		}
		return inverseString;
	}

}


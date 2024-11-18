# File: GenerateRandomSentences.py
# --------------------------------
# This file exports a program that reads in a grammar file and
# then prints three randomly generated sentences

from filechooser import chooseInputFile
from random import choice

def readGrammar(filename): #returns 'grammar,' a dictionary of expansions for each non-terminal value
   grammar = {}
   with open(filename) as f:
      while True:
         line = f.readline().strip() #opens file line by line
         if line == "": break #stops the reading at the end of file
         numlines = int(f.readline().strip()) #figures out how many lines of text have to be added per option
         expansions = []
         for i in range(numlines):
            expansions += [f.readline().strip()] #adds all lines to array expansions
         grammar[line] = expansions #adds each set of expansions to the grammar dictionary
         skip = f.readline() #ensures that line skips are accounted for
      return grammar

def generateRandomSentence(grammar): #generates random expansions for each non-terminal until there are no more non-terminal values, generating a random sentence
   sentence = "<start>"
   while True: #continues until there are no non-terminals left
      if "<" in sentence:
         index1 = sentence.index("<")
         index2 = sentence.index(">") + 1
         title = sentence[index1:index2]
         random = choice(grammar[title]) #selects a random option from each non-terminal <title> like "<adverb>"
         sentence = sentence[:index1] + random + sentence[index2:] #replaces the non-terminal with a terminal so that the sentence reads correctly and completely
      else: break #breaks when all non-terminals have been removed (so no "<")
   return sentence

def GenerateRandomSentences():
   filename = chooseInputFile("grammars")
   grammar = readGrammar(filename)
   for i in range(3): #runs the random sentence generator thrice, generating three random sentences
      print(generateRandomSentence(grammar))

if __name__ == "__main__":
   GenerateRandomSentences()

# File: Reassemble.py
# -------------------
# This file exports a program that reads in a large number
# of text fragments from a file you choose, and then reconstructs
# the original text so it can be printed out.
from tabnanny import check

from filechooser import chooseInputFile

def extractFragments(filename): #reads text file and separates each fragment into elements of the array fragments
   with open(filename) as f:
      text = f.read() #does not open it line-by-line because some fragments have line breaks
      fragments = []
      index1 = 1
      index2 = 0 #just initializing it without a value
      for char in text:
         if char == "{":
            index2 = text.index("}")
            fragments += [text[index1:index2]] #adds each fragment to the array fragments, not including the {} in each element
            text = text[index2 + 1:].strip() #removes each fragment, that has been added to the array already, from the text file to prevent repeated appending
      return fragments

def checkOverlap(firstString, secondString): #checks the overlap between any two strings and returns both the string and the index of the overlap
   overlap = ""
   shorterStringLength = min(len(firstString), len(secondString)) #ensures that we only iterate the for loop within the range of the length of the shorter string, to prevent an out-of-index error
   for i in range(shorterStringLength, 0, -1): #iterates backwards, checking longer overlaps first so that the loop runs only until it finds the longest overlap between any two strings
      if firstString[-i:] == secondString[:i]: #uses positive and negative indices to check for overlap between strings by checking whether the substrings at given indices match. this assumes that one string (firstString) is in front of the other (secondString)
         overlap = secondString[:i] #sets overlap as a string
         return overlap, i
   return "", 0

def compareOverlap(fragments):
   maxOverlap = 0
   longestMerge = ""
   beginning = ""
   end = ""
   for i in range(len(fragments)): #sequentially compares each element of fragments to the rest
      for j in range(i + 1, len(fragments)): #ensures that each element is only compared with subsequent elements, to prevent repeated comparisons and lower runtime
         if len(fragments[i]) < maxOverlap or len(fragments[j]) < maxOverlap: #ensures that a given iteration of the loop does not run if the maxOverlap is longer than either of the strings being compared, because a smaller string could NEVER create a longer overlap.
            j += 1 #this "skip" of the current iteration of the loop is less programmatically expensive, reducing runtime.
         elif fragments[i] in fragments[j]: #if shorter string is in longer string, returns longer string as the merged string
            overlap = fragments[i]
            merged = fragments[j]
         elif fragments[j] in fragments[i]: #switched case of the previous (short string in long string)
            overlap = fragments[j]
            merged = fragments[i]
         else:
            overlap1, index1 = checkOverlap(fragments[i], fragments[j]) #compares two strings, setting the first as firstString and the second as secondString
            overlap2, index2 = checkOverlap(fragments[j], fragments[i]) #compares the same two strings the opposite way, setting the second as firstString and the first as secondString
            if len(overlap1) > len(overlap2): #creates the merged string and overlap string based on whichever direction (str1 vs. str2 OR str2 vs. str1) creates the longest overlap
               index = index1
               overlap = overlap1
               merged = fragments[i][:-index] + overlap + fragments[j][index:]
            else:
               index = index2
               overlap = overlap2
               merged = fragments[j][:-index] + overlap + fragments[i][index:]

         if len(overlap) > maxOverlap: #changes the maxOverlap value whenever the length of a given overlap in the loop is longer than the current maxOverlap value, setting a new maximum
            maxOverlap = len(str(overlap))
            longestMerge = merged
            beginning = fragments[i] #sets beginning for the firstString that was compared so that we can remove it from the fragments array once it has been used
            end = fragments[j] #sets end for the secondString that was compared so that we can remove it from the fragments array once it has been used
   if maxOverlap == 0: #if there is no overlap, concatenates the strings arbitrarily, as per assignment directions
      beginning = fragments[0]
      end = fragments[1]
      longestMerge = beginning + end
   return longestMerge, beginning, end

def reconstruct(fragments):
   while True:
      longestMerge, beginning, end = compareOverlap(fragments)
      fragments.pop(fragments.index(beginning)) #removes string, that has already been compared as firstString, from array fragments
      fragments.pop(fragments.index(end)) #removes string, that has already been compared as secondString, from array fragments
      fragments.append(longestMerge) #adds merged string into the array so it can eventually be compared with others to check for overlaps
      if len(fragments) == 1: #when the only thing left in the fragments array is the last finished reassembled/merged string, we break out of the while True loop
         break
   return fragments[0]

def Reassemble():
   filename = chooseInputFile("reassemble-files")
   if filename == "":
      print("User canceled file selection. Quitting!")
      return
   fragments = extractFragments(filename)
   if fragments == None:
      print("File didn't respect reassemble file format. Quitting!")
      return
   reconstruction = reconstruct(fragments)
   print(reconstruction)

if __name__ == "__main__":
   Reassemble()

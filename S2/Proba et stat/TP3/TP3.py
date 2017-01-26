import string
import numpy
from operator import itemgetter

from numpy.random import random

dictionary = list (string.ascii_lowercase)
p = [0.0817, 0.0149, 0.0278, 0.0425, 0.127, 0.0223, 0.0202, 0.0609, 0.0697, 0.0015, 0.0077, 0.0403, 0.0241, 0.0675,
     0.0751, 0.0193, 0.001, 0.0599, 0.0633, 0.0906, 0.0276, 0.0098, 0.0236, 0.0015, 0.0197, 0.0005]
hummingG = numpy.array([(1,0,0,0),(0,1,0,0),(0,0,1,0),(0,0,0,1),(1,1,1,0),(0,1,1,1),(1,0,1,1)])

def generateseq(p, n):
    seq = ""
    tableseq = numpy.random.multinomial (1, p, n)
    for letter in tableseq:
        seq += dictionary[letter.tolist ().index (1)]
    return seq


def inverse(char):
    """
        Inverse un booléen
    """
    if char is '0':
        return '1'
    return '0'


def canal(msg, proba):
    """
        Renvoie le message une fois passé par le canal bruité.
    """
    random.seed (42)
    new_msg = ""

    for char in msg:
        if random.random () > proba:
            new_msg = new_msg + char
        else:
            new_msg += inverse (char)
    return new_msg


def countfreq(s):
    freq = [0] * len (dictionary)
    for c in s:
        freq[dictionary.index (c)] += 1
    return freq


def huffmantable(l):
    if len (l) == 1:
        return dict (l[0][0])
    else:
        temp = list ()
        least1 = min (l, key=itemgetter (1))
        l.remove (least1)
        least2 = min (l, key=itemgetter (1))
        l.remove (least2)
        for symbcode in least1[0]:
            temp.append ((symbcode[0], "0" + symbcode[1]))
        for symbcode in least2[0]:
            temp.append ((symbcode[0], "1" + symbcode[1]))
        l.append ((temp, least1[1] + least2[1]))
        return huffmantable (l)


def makecodefromstring(s):
    freq = countfreq (s)
    nuplets = list ()
    for c in dictionary:
        nuplets.append (([(c, "")], (freq[dictionary.index (c)])))
    return huffmantable (nuplets)


def encoding(s, codetable):
    result = ""
    buffer = ""
    for c in s:
        search = codetable.get (buffer + c)
        if search == None:
            buffer += c
        else:
            buffer = ""
            result += search
    return result


def matrixmod(s):
    x = list(s)
    y = map(int, list(s))
    z = list(map(int, list(s)))
    x = numpy.array (z)[numpy.newaxis]
    y = x.T
    s = numpy.dot (hummingG, y)

    return s


def codehumming(s):
    t = 0
    tocode=""
    coded=""
    for c in s:
        if t<4:
            t+=1
            tocode+=c
        else:
            t=0
            coded+=matrixmod(tocode)
            tocode = ""


def main():
    seq = generateseq (p, 100)
    print ("string:", seq)
    codedict = makecodefromstring (seq)
    decodedict = {v: k for k, v in codedict.items ()}
    print ("coding dict:", codedict)
    print ("decoding dict:", decodedict)
    coded = encoding (seq, codedict)
    decoded = encoding (coded, decodedict)
    print ("coded string:", coded)
    print ("decoded string:", decoded)
    print ("len before coding (bit):", len (seq) * 8)
    print ("len after coding (bit):", len (coded))
    print ("comrpession rate:", (len (seq) * 8 - len (coded)) * 100 / (len (seq) * 8), "%")
    codehumming(coded)


main ()

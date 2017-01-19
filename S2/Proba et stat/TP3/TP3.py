import numpy
from operator import itemgetter

dictionary = ["a", "b", "c", "d"]


def generateseq(p, n):
    seq = ""
    tableseq = numpy.random.multinomial(1, p, n)
    for letter in tableseq:
        seq += dictionary[letter.tolist().index(1)]
    return seq


def countfreq(s):
    freq = [0] * len(dictionary)
    for c in s:
        freq[dictionary.index(c)] += 1
    return freq


def huffmantable(l):
    if len(l) == 1:
        return dict(l[0][0])
    else:
        temp = list()
        least1 = min(l, key=itemgetter(1))
        l.remove(least1)
        least2 = min(l, key=itemgetter(1))
        l.remove(least2)
        for symbcode in least1[0]:
            temp.append((symbcode[0], "0" + symbcode[1]))
        for symbcode in least2[0]:
            temp.append((symbcode[0], "1" + symbcode[1]))
        l.append((temp, least1[1] + least2[1]))
        return huffmantable(l)


def makecodefromstring(s):
    freq = countfreq(s)
    nuplets = list()
    for c in dictionary:
        nuplets.append(([(c, "")], (freq[dictionary.index(c)])))
    return huffmantable(nuplets)


def main():
    p = [0.5, 0.25, 0.125, 0.125]
    seq = generateseq(p, 100)
    freq = countfreq(seq)
    nuplets = list()
    for c in dictionary:
        nuplets.append(([(c, "")], (freq[dictionary.index(c)])))
    print(nuplets)
    codetable = huffmantable(nuplets)
    print(codetable)


main()

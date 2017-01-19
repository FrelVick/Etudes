import numpy
from operator import itemgetter

dictionary = ["a", "b", "c", "d"]


def generateseq(p, n):
    seq = ""
    tableseq = numpy.random.multinomial (1, p, n)
    for letter in tableseq:
        seq += dictionary[letter.tolist ().index (1)]
    return seq


def countfreq(s):
    freq = [0] * len(dictionary)
    for c in s:
        freq[dictionary.index (c)] += 1
    return freq


def huffmantable(l):
    if len(l) == 1:
        return l[-1][1]
    else:
        temp = []
        least1 = min(l,key=itemgetter(1))
        l.remove(least1)
        least2 = min(l, key=itemgetter(1))
        l.remove(least2)
        for symbcode in least1:
            temp.extend((symbcode[0], symbcode[1] + "0"))
        for symbcode in least2:
            temp.extend ((symbcode[0], symbcode[1] + "1"))
        l.append((temp,least1[1]+least2[1]))
        print(l)


def main():
    p = [0.5, 0.25, 0.125, 0.125]
    seq = generateseq (p, 4)
    freq = countfreq (seq)
    nuplets = list()
    for c in dictionary:
        nuplets.append((((c,"")),(freq[dictionary.index(c)])))
    codetable = huffmantable(nuplets)
    print(nuplets)


main ()

import string
import numpy
from operator import itemgetter
import itertools

# from numpy.random import random

dictionary = list(string.ascii_lowercase)
p = [0.0817, 0.0149, 0.0278, 0.0425, 0.127, 0.0223, 0.0202, 0.0609, 0.0697, 0.0015, 0.0077, 0.0403, 0.0241, 0.0675,
     0.0751, 0.0193, 0.001, 0.0599, 0.0633, 0.0906, 0.0276, 0.0098, 0.0236, 0.0015, 0.0197, 0.0005]
hummingG = numpy.array(
    [(1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 1, 0), (0, 0, 0, 1), (1, 1, 1, 0), (0, 1, 1, 1), (1, 0, 1, 1)])
hummingD = numpy.array([(1, 1, 1, 0, 1, 0, 0), (0, 1, 1, 1, 0, 1, 0), (1, 1, 0, 1, 0, 0, 1)])


def generateseq(proba_table, n):
    """

    :param proba_table:
    :param n:
    :return:
    """
    seq = ""
    tableseq = numpy.random.multinomial(1, proba_table, n)
    for letter in tableseq:
        seq += dictionary[letter.tolist().index(1)]
    return seq


def inverse(char):
    """
    Inverse un boolean
    :param char:
    :return:
    """
    if char is '0':
        return '1'
    return '0'


def canal(msg, proba):
    """
    Send message to noise channel
    :param msg:
    :param proba:
    :return:
    """
    numpy.random.seed(42)
    new_msg = ""

    for char in msg:
        if numpy.random.random() > proba:
            new_msg = new_msg + char
        else:
            new_msg += inverse(char)
    return new_msg


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


def encoding(s, codetable):
    result = ""
    buffer = ""
    for c in s:
        search = codetable.get(buffer + c)
        if search is None:
            buffer += c
        else:
            buffer = ""
            result += search
    return result


def matrixmod(s):
    """
    add pair bits to string of 3 bits
    :param s:input string
    :return: string with pair bits
    """
    z = ''.join(
        str(c % 2) for v in numpy.dot(hummingG, numpy.array(list(map(int, list(s))))[numpy.newaxis].T).T.tolist() for c
        in v)

    return z


def hummingerrorfixing(s):
    """
    find and fix humming error
    :param s: input string
    :return: string without errors
    """
    z = ''.join(
        str(c % 2) for v in numpy.dot(hummingD, numpy.array(list(map(int, list(s))))[numpy.newaxis].T).T.tolist() for c
        in v)
    z = z
    return z


def codehumming(s):
    t = 0
    tocode = ""
    coded = ""
    for c in s:
        if t < 3:
            t += 1
            tocode += c
        else:
            t = 0
            coded += matrixmod(tocode + c)
            tocode = ""
    return coded


def grouper(iterable, n, fillvalue=None):
    "Collect data into fixed-length chunks or blocks"
    # grouper('ABCDEFG', 3, 'x') --> ABC DEF Gxx"
    args = [iter(iterable)] * n
    return itertools.zip_longest(*args, fillvalue=fillvalue)


def unhummingseq(s):
    if codehumming(s[:4]) == s[:4] + s[4:]:
        return s[:4]
    else:
        return hummingerrorfixing(s)[:4]


def unhummingmessage(s):
    unhummed = ""
    for c in grouper(s[7:-7], 7):
        unhummed += unhummingseq(''.join(c))
    unhummed += ""
    return unhummed


def main():
    seq = generateseq(p, 10)
    print("string:", seq)
    codedict = makecodefromstring(seq)
    decodedict = {v: k for k, v in codedict.items()}
    print("coding dict:", codedict)
    print("decoding dict:", decodedict)
    coded = encoding(seq, codedict)
    decoded = encoding(coded, decodedict)
    print("coded string:", coded)
    print("decoded string:", decoded)
    print("len before coding (bit):", len(seq) * 8)
    print("len after coding (bit):", len(coded))
    print("comrpession rate:", (len(seq) * 8 - len(coded)) * 100 / (len(seq) * 8), "%")
    hummed = codehumming(coded)
    print("Hummed string:", hummed)
    noised = canal(hummed, 0.1)
    print("noised string:", noised)
    unhummed = unhummingmessage(noised)
    print("unhummed string:", unhummed)


main()

import string
import numpy
from operator import itemgetter
import itertools

# from numpy.random import random

# dictionary = list()
alphabet = list(string.ascii_lowercase)
p = [0.0817, 0.0149, 0.0278, 0.0425, 0.127, 0.0223, 0.0202, 0.0609, 0.0697, 0.0015, 0.0077, 0.0403, 0.0241, 0.0675,
     0.0751, 0.0193, 0.001, 0.0599, 0.0633, 0.0906, 0.0276, 0.0098, 0.0236, 0.0015, 0.0197, 0.0005]
hummingG = numpy.array(
    [(1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 1, 0), (0, 0, 0, 1), (1, 1, 1, 0), (0, 1, 1, 1), (1, 0, 1, 1)])
hummingD = numpy.array([(1, 1, 1, 0, 1, 0, 0), (0, 1, 1, 1, 0, 1, 0), (1, 0, 1, 1, 0, 0, 1)])
errorfix = {'000': 5, '001': 6, '010': 5, '011': 3, '100': 4, '101': 0, '110': 1, '111': 2}


def generateseq(proba_table, n):
    """

    :param proba_table:
    :param n:
    :return:
    """
    seq = ""
    tableseq = numpy.random.multinomial(1, proba_table, n)
    for letter in tableseq:
        seq += alphabet[letter.tolist().index(1)]
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


def countfreq(s, dictionary):
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


def makecodefromstring(s, dictionary):
    freq = countfreq(s, dictionary)
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
    if z != "000":
        tochange = errorfix[z]
        s = s[:tochange] + inverse(s[tochange]) + s[tochange + 1:]
    return s


def codehumming(s):
    t = 0
    tocode = ""
    coded = matrixmod(format(len(s) % 4, "04b"))
    for c in s:
        if t < 3:
            t += 1
            tocode += c
        else:
            t = 0
            coded += matrixmod(tocode + c)
            tocode = ""
    if tocode != "":
        coded += matrixmod(tocode + '0' * (4 - (len(tocode))))
    return coded


def grouper(iterable, n, fillvalue=None):
    """"
    Collect data into fixed-length chunks or blocks
    """
    # grouper('ABCDEFG', 3, 'x') --> ABC DEF Gxx"
    args = [iter(iterable)] * n
    return itertools.zip_longest(*args, fillvalue=fillvalue)


def unhummingseq(s):
    '''if codehumming(s[:4]) == s[:4] + s[4:]:
        return s[:4]
    else:'''
    return hummingerrorfixing(s)[:4]


def unhummingmessage(s):
    unhummed = ""
    last = int(unhummingseq(s[:7]), 2)
    for c in grouper(s[7:], 7):
        unhummed += unhummingseq(''.join(c))
    unhummed += ""
    if last != 0:
        unhummed = unhummed[:(-4 + last)]
    return unhummed


def counterrors(s1, s2):
    errors = 0
    for i in range(len(s1)):
        if s1[i] != s2[i]: errors += 1
    return errors / len(s1)


def main():
    seq = generateseq(p, 17)  # change here input length
    print("string:", seq)
    dictionary = list("".join(set(seq)))
    codedict = makecodefromstring(seq, dictionary)
    decodedict = {v: k for k, v in codedict.items()}
    print("coding dict:", codedict)
    print("decoding dict:", decodedict)
    coded = encoding(seq, codedict)
    decoded = encoding(coded, decodedict)
    print("coded string:", coded)
    print("coded formated string:   ", " ".join(coded[i:i + 4] for i in range(0, len(coded), 4)))
    print("decoded string:", decoded)
    print("len before coding (bit):", len(seq) * 8)
    print("len after coding (bit):", len(coded))
    print("compression rate:", (len(seq) * 8 - len(coded)) * 100 / (len(seq) * 8), "%")
    hummed = codehumming(coded)

    print("Hummed string:", " ".join(hummed[i:i + 7] for i in range(0, len(hummed), 7)))
    noised = canal(hummed, 0.05)
    print("noised string:", " ".join(noised[i:i + 7] for i in range(0, len(noised), 7)))

    unhummed = unhummingmessage(noised)
    print("unhummed string:", " ".join(unhummed[i:i + 4] for i in range(0, len(unhummed), 4)))
    print("coded string:   ", " ".join(coded[i:i + 4] for i in range(0, len(coded), 4)))

    errortaxe = counterrors(coded, unhummed)
    print("Error taxe before humming:", counterrors(hummed, noised) * 100, "%")
    print("Error taxe after humming:", errortaxe * 100, "%")
    decoded = encoding(unhummed, decodedict)
    print("unhummed uncoded string:", decoded)


main()

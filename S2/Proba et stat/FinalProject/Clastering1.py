import numpy as np


# def print_matrix(m):
#	print(m)


def random_distribution(nbr_item, nbr_cluster):
    random_matrix = np.random.random_sample((nbr_item, nbr_cluster))
    # print(random_matrix, "\n")
    normalise = random_matrix / random_matrix.sum(axis=1).reshape(nbr_item, 1)
    # print(random_matrix, "\n")
    return (normalise)


### input ###
## similarity matrix : s(i1,i2)
similarity_matrix = np.loadtxt("ds1_bis.d")
# print("s(i,j)\n", similarity_matrix, "\n")
items = len(similarity_matrix)
clusters = 3
tradeoff = 0.1
epsilon = 0.1

### initialisation ###
## p(m)(C|i)
p_clusters_for_items = random_distribution(items, clusters)
## pour test
# p_clusters_for_items = np.matrix([[0,1], [1,0], [0,1], [1,0], [0,1]])
# print("p(m)(C|i)\n", p_clusters_for_items, "\n")


### iteration ###
## p(i)
p_items = 1 / items

while True:
    ## p(C)
    p_clusters = p_clusters_for_items.sum(axis=0) * p_items
    # print("p(C)\n", p_clusters, "\n")
    ## p(i|C)
    p_items_in_clusters = p_clusters_for_items * p_items / p_clusters
    # print("p(i|C)\n", p_items_in_clusters, "\n")

    ## equation 6 : s(C;i)
    items_similarity_to_clusters = np.dot(similarity_matrix, p_items_in_clusters)
    # print("s(C;i)\n", items_similarity_to_clusters, "\n")

    ## equation 1 : s(c) = p(i|C) * s(C;i)
    product = np.multiply(p_items_in_clusters, items_similarity_to_clusters)
    # print("product\n", product, "\n")
    similarity_in_clusters = np.sum(product, axis=0)
    # print("s(C)\n", similarity_in_clusters, "\n")

    ## p(m+1)(C|i)
    ## 1er point
    p_next_clusters_for_items = np.power(p_clusters, (
    (1 / tradeoff) * ((2 * items_similarity_to_clusters) - similarity_in_clusters)))
    # print("avant normaliser p(m+1)(C|i)\n", p_next_clusters_for_items, "\n")
    ## 2eme point
    p_next_clusters_for_items = p_next_clusters_for_items / p_next_clusters_for_items.sum(axis=1).reshape(items, 1)
    print("nouveau p(m+1)(C|i)\n", p_next_clusters_for_items, "\n")

    ## condition break
    diff = np.absolute(p_next_clusters_for_items - p_clusters_for_items)
    # print("|p(m+1)(C|i) - p(m)(C|i)|\n", diff, "\n")
    comparison = np.less_equal(diff, epsilon)
    # print("condition", comparison, "\n")

    ## p(m) <- p(m+1) pour la suite
    p_clusters_for_items = p_next_clusters_for_items

    if comparison.all() == True:
        # print("fini")
        break
    else:
        print("boucle")

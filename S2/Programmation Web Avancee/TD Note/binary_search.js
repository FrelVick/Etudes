function binarySearch(tab, v) {
    //L'intervalle de recherche du tableau.
    var imin = 0;
    var imax = tab.length - 1;

    while (imin <= imax) {
        // On calcule la position du milieu

        var imid = imin + Math.trunc((imax - imin) / 2);
        console.log('imin: ' + imin + ', imax: ' + imax + ', imid : ' + imid);

        if (tab[imid] == v) {

            // on a trouvé la valeur, on renvoie son indice
            return imid;

        } else if (tab[imid] < v) {
            // la valeur du milieu est plus petite que la
            // valeur recherchée, on cherche dans la moitié haute
            imin = imid + 1;

        } else {
            // on cherche dans la moitié basse
            imax = imid - 1;
        }
    }
    // On est sorti de la boucle sans passer par le return, la valeur
    // n'est pas dans le tableau
    return -1;
}

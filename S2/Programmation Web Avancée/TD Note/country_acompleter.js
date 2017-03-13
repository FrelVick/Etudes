var updateResults = function (tab) {
    /* EXO 4, Question 1 */
    /* À COMPLÉTER */
    /* Pour chaque case ci du tableau tab, produire dans le div d'id results de la page
     le fragment HTML:
     <ul>
     <li> c1 </li>
     ...
     <li> cn </li>
     </ul>
     */
    var result = "<ul>", result_elem;
    for (var i = 0; i < tab.length; i++) {

        result += "<li>" + tab[i] + "</li>";
    }
    result += "</ul>";
    result_elem = document.getElementById("results");
    result_elem.innerHTML = result;
};

var getCountry = function (letter) {

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.lri.fr/~kn/php/country.php?q=" + letter /* <--- REMPLACER LA CHAÎNE VIDE PAR L'URL ADÉQUATE */);
    xhr.addEventListener("readystatechange", function () {

        /* À COMPLÉTER */
        /* Si la requête a réussi, décoder son résultat JSON et le passer en
         argument à updateResults */
        if (xhr.readyState == 4) {
            updateResults(JSON.parse(xhr.responseText));

        }

    });
    xhr.send(null);
};


window.addEventListener("load", () = > {

    /* À COMPLÉTER */

    /* Lorsque l'on clique sur le bouton :
     (1) récupérer la valeur de l'attribut 'value' du formulaire de texte
     (2) récupérer la première lettre du texte et la passer en majuscule (méthode .toUpper() de la classe string)
     si le texte ne commence pas par une lettre majuscule ou minuscule, entre a et z, alors la première lettre est 'A'
     (3) appeler la fonction getCountry avec la lettre trouvée.
     */

};
)


/* Représentation des formules */

/** Class commune aux autres types de formules */
var Formula = function () {

    this.children = []; // Fils du nœud courant
    this.priority = 0;  // Priorité du nœud courant
    this.arity = 0;     // Arité du nœud courant
};



//Évalue tous les enfants de la formule courante
//et renvoie un tableau de leur valeurs

Formula.prototype.evalChildren = function () {
    return this.children.map(function(c, i, a) {
	return c.eval();
    });
};

//////////////////////////////////
/** Class Const */



//////////////////////////////////
/** Classe Add (addition) */

//////////////////////////////////
/** Classe Sub (soustraction) */

//////////////////////////////////
/** Classe Mul (multiplication) */

//////////////////////////////////
/** Classe Div (division) */

//////////////////////////////////
/** Classe Mod (modulo) */


//Méthode « statique », directement attachée à l'objet Formula, pas
//individuellement à chaque formule.

Formula.parse = function (input) {

    //tableau d'action pour le lexer
    var actions = [

        { re : /* regexp pour le + */, action : function (s, i, j) { return new Add(); }},
        { re : /* regexp pour le - */, action : function (s, i, j) { return new Sub(); }},
        { re : /* regexp pour le * */, action : function (s, i, j) { return new Mul(); }},
	{ re : /* regexp pour le % */, action : function (s, i, j) { return new Mod(); }},
        { re : /* regexp pour le / */, action : function (s, i, j) { return new Div(); }},
        { re : /* regexp pour les parenthèses */, action : function (s, i, j) { return s; } },
	{ re : /* regexp pour les nombres */ ,
          action : function (s, i, j) { return new Const(+(s)); }
	}
    ];

    //Création d'un nouveau lexer
    var lexer = new Lexer(actions);
    //Obtention d'un tableau de jetons.
    //Un jeton est soit un objet dont le type est une sous-classe de Formula
    //soit la chaîne "(", soit la chaîne ")"

    var tokens = lexer.scan(input);


    //La sortie et la pile, comme dans l'algorithme de Dijkstra
    var output = [];
    var stack = [];

    //Monkey patching : on ajoute une méthode peek sur l'objet stack qui permet
    //de récupérer le sommet sans le dépiler
    stack.peek = function () {
	return this[this.length - 1];
    }

    //Monkey patching : on ajoute une méthode reduce sur l'objet
    //output. Lorsque L'on ajoute un opérateur d'arité n dans la
    //sortie, alors la méthode reduce dépile automatiquement les n
    //formules en sommet de pile et le place comme fils du nœud
    //ajouté.  Lève une exception si la pile ne dispose pas d'assez de
    //valeurs.
    // Dans l'implémentation de l'algorithme de Dijkstra, on appelera output.reduce(o)
    // Pour placer o sur la pile de sortie.

    output.reduce = function (op) {
	var args = [];
	for (var i = 0; i < op.arity; i++) {
	    if (this.length === 0) {
		throw "Syntax error, not enough arguments";
	    } else {
		args.push(this.pop());
	    }
	}
	op.children = args.reverse ();
	this.push(op);
    };

    //Algorithme de Dijkstra, Phase I
    for (var i = 0; i < tokens.length; i++) {
	var token = tokens[i];

	/* À compléter */
    }
    // Phase II
    while(stack.length > 0) {
	/* À compléter */

    };

    if (output.length !== 1) {
	throw "Syntax error, missing operator";
    }
    else
	return output[0];
};

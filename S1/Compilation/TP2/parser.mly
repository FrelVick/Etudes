%{

  open Ast

  (* Vous pouvez insérer ici du code Caml pour définir des fonctions
     ou des variables qui seront utilisées dans les actions sémantiques. *)

%}

(* Définition des lexèmes. *)
%token EOF
%token PLUS MINUS MULT DIV
%token OR AND NOT LT LE GT GE
%token EQ NEQ
%token IF THEN ELSE
%token <int> CINT
%token <bool> CBOOL
%token LPAREN RPAREN
       
(* Règles d'associativité et de priorité. *)

%left PLUS MINUS
%left MULT DIV
%left OR
%left AND
%left NOT

          
   
(* Symbole de départ et type de la valeur produite par l'action sémantique. *)
%start toplevel_expr
%type <Ast.expr> toplevel_expr

%%

(* Règles. *)

toplevel_expr:
(* Expression à la racine : une expression [expr] dont on notera [e] la valeur
   sémantique, suivie du symbole [EOF].
   La valeur sémantique associée est la valeur [e] de l'expression.
*)
| e=expr; EOF { e }
;

expr:
  | ci = expr_int
	   { ci }
  | cb = expr_bool
	   { cb }
  | LPAREN; e = expr; RPAREN
			{ e }
  | EOF { failwith "Unlikely" } ;

expr_bool:
  | cb = CBOOL
	   { Econst (Cbool (cb)) }
  | e1 = expr_bool; AND; e2 = expr_bool
				{ Ebinop (And, e1, e2) }
  | e1 = expr_bool; OR; e2 = expr_bool
			       { Ebinop (Or, e1, e2) }
  | e1 = expr_int; EQ; e2 = expr_int | e1 = expr_bool; EQ; e2 = expr_bool
								  { Ebinop (Eq, e1, e2) }
  | e1 = expr_int; NEQ; e2 = expr_int | e1 = expr_bool; NEQ; e2 = expr_bool
								  { Ebinop (Neq, e1, e2) }
  | e1 = expr_int; LT; e2 = expr_int | e1 = expr_bool; LT; e2 = expr_bool
								  { Ebinop (Lt, e1, e2) }
  | e1 = expr_int; LE; e2 = expr_int | e1 = expr_bool; LE; e2 = expr_bool
								  { Ebinop (Le, e1, e2) }
  | e1 = expr_int; GT; e2 = expr_int | e1 = expr_bool; GT; e2 = expr_bool
								  { Ebinop (Gt, e1, e2) }
  | e1 = expr_int; GE; e2 = expr_int | e1 = expr_bool; GE; e2 = expr_bool
								  { Ebinop (Ge, e1, e2) }
  | IF; e_bin = expr_bool; THEN; e_bool1 = expr_bool; ELSE; e_bool2 = expr_bool
								   { Eif (e_bin, e_bool1, e_bool2) }
  | NOT; eb = expr_bool
	       { Eunop ( Not, eb ) }
  | LPAREN; e=expr_bool; RPAREN
		       { e }
  | EOF { failwith "Unlikely" } ;
		       

expr_int:
  | ci = CINT
	   { Econst (Cint (ci)) }
  | MINUS; e = expr_int
		 { Eunop (Uminus, e) }
  | e1 = expr_int; PLUS; e2 = expr_int
			    { Ebinop (Plus, e1, e2) }
  | e1 = expr_int; MINUS; e2 = expr_int
			    { Ebinop (Minus, e1, e2) }
  | e1 = expr_int; MULT; e2 = expr_int
			    { Ebinop (Mult, e1, e2) }
  | e1 = expr_int; DIV; e2 = expr_int
			    { Ebinop (Div, e1, e2) }
  | IF e_bin = expr_bool THEN e_int1 = expr_int ELSE e_int2 = expr_int
								{ Eif (e_bin, e_int1, e_int2) }
  | LPAREN e=expr_int RPAREN
		      { e }
  | EOF { failwith "Unlikely" } ;
								
								

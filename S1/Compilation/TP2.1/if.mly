%token ATOM COND IF ELSE SEMI EOF
%start <unit> prog
%%

prog:
| seq EOF {}
;

seq:
| expr {}
| seq SEMI expr {}
;

expr:
| ATOM {}
| IF COND seq {}
| IF COND seq ELSE seq {}
;

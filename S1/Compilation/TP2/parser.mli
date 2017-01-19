
(* The type of tokens. *)

type token = 
  | THEN
  | RPAREN
  | PLUS
  | OR
  | NOT
  | NEQ
  | MULT
  | MINUS
  | LT
  | LPAREN
  | LE
  | IF
  | GT
  | GE
  | EQ
  | EOF
  | ELSE
  | DIV
  | CINT of (int)
  | CBOOL of (bool)
  | AND

(* This exception is raised by the monolithic API functions. *)

exception Error

(* The monolithic API. *)

val toplevel_expr: (Lexing.lexbuf -> token) -> Lexing.lexbuf -> (Ast.expr)

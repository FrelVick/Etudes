# 1 "lexer.mll"
 

  open Lexing
  open Parser
  open Ast

  (* Vous pouvez insérer ici du code Caml pour définir des fonctions
     ou des variables qui seront utilisées dans les actions sémantiques. *)
  

# 13 "lexer.ml"
let __ocaml_lex_tables = {
  Lexing.lex_base = 
   "\000\000\230\255\231\255\000\000\002\000\003\000\004\000\000\000\
    \001\000\005\000\001\000\001\000\244\255\245\255\246\255\247\255\
    \248\255\002\000\019\000\000\000\000\000\002\000\255\255\005\000\
    \000\000\006\000\253\255\002\000\239\255\001\000\000\000\012\000\
    \252\255\250\255\243\255\242\255\241\255\240\255\003\000\018\000\
    \238\255\237\255\235\255\233\255\004\000\232\255\037\000\252\255\
    \253\255\004\000\017\000\255\255\254\255";
  Lexing.lex_backtrk = 
   "\255\255\255\255\255\255\025\000\021\000\019\000\025\000\025\000\
    \025\000\025\000\025\000\025\000\255\255\255\255\255\255\255\255\
    \255\255\006\000\004\000\025\000\025\000\001\000\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\002\000\002\000\255\255\255\255";
  Lexing.lex_default = 
   "\001\000\000\000\000\000\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\000\000\000\000\000\000\000\000\
    \000\000\255\255\255\255\255\255\255\255\255\255\000\000\255\255\
    \255\255\255\255\000\000\255\255\000\000\255\255\255\255\255\255\
    \000\000\000\000\000\000\000\000\000\000\000\000\255\255\255\255\
    \000\000\000\000\000\000\000\000\255\255\000\000\048\000\000\000\
    \000\000\255\255\255\255\000\000\000\000";
  Lexing.lex_trans = 
   "\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\021\000\022\000\021\000\000\000\021\000\000\000\021\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \021\000\006\000\021\000\000\000\000\000\000\000\011\000\034\000\
    \017\000\016\000\013\000\015\000\033\000\014\000\052\000\012\000\
    \018\000\018\000\018\000\018\000\018\000\018\000\018\000\018\000\
    \018\000\018\000\051\000\000\000\005\000\009\000\004\000\043\000\
    \042\000\041\000\036\000\018\000\018\000\018\000\018\000\018\000\
    \018\000\018\000\018\000\018\000\018\000\049\000\000\000\050\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\029\000\000\000\000\000\000\000\007\000\019\000\037\000\
    \023\000\008\000\027\000\026\000\038\000\030\000\003\000\044\000\
    \028\000\032\000\024\000\031\000\020\000\025\000\039\000\040\000\
    \045\000\000\000\000\000\000\000\010\000\035\000\000\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \002\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\047\000";
  Lexing.lex_check = 
   "\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\000\000\000\000\021\000\255\255\000\000\255\255\021\000\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \000\000\000\000\021\000\255\255\255\255\255\255\000\000\011\000\
    \000\000\000\000\000\000\000\000\017\000\000\000\049\000\000\000\
    \000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\
    \000\000\000\000\050\000\255\255\000\000\000\000\000\000\004\000\
    \005\000\006\000\009\000\018\000\018\000\018\000\018\000\018\000\
    \018\000\018\000\018\000\018\000\018\000\046\000\255\255\046\000\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\019\000\255\255\255\255\255\255\000\000\000\000\008\000\
    \020\000\000\000\023\000\025\000\007\000\029\000\000\000\003\000\
    \027\000\031\000\020\000\030\000\000\000\024\000\038\000\039\000\
    \044\000\255\255\255\255\255\255\000\000\010\000\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \000\000\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\255\
    \255\255\255\255\255\255\255\255\255\255\046\000";
  Lexing.lex_base_code = 
   "";
  Lexing.lex_backtrk_code = 
   "";
  Lexing.lex_default_code = 
   "";
  Lexing.lex_trans_code = 
   "";
  Lexing.lex_check_code = 
   "";
  Lexing.lex_code = 
   "";
}

let rec token lexbuf =
    __ocaml_lex_token_rec lexbuf 0
and __ocaml_lex_token_rec lexbuf __ocaml_lex_state =
  match Lexing.engine __ocaml_lex_tables __ocaml_lex_state lexbuf with
      | 0 ->
# 21 "lexer.mll"
      ( new_line lexbuf; token lexbuf )
# 136 "lexer.ml"

  | 1 ->
# 22 "lexer.mll"
          ( token lexbuf )
# 141 "lexer.ml"

  | 2 ->
# 23 "lexer.mll"
           ( CBOOL (true) )
# 146 "lexer.ml"

  | 3 ->
# 24 "lexer.mll"
            ( CBOOL (false) )
# 151 "lexer.ml"

  | 4 ->
let
# 25 "lexer.mll"
              i
# 157 "lexer.ml"
= Lexing.sub_lexeme lexbuf lexbuf.Lexing.lex_start_pos lexbuf.Lexing.lex_curr_pos in
# 26 "lexer.mll"
  ( CINT ( int_of_string i ) )
# 161 "lexer.ml"

  | 5 ->
# 27 "lexer.mll"
         ( comment lexbuf; token lexbuf )
# 166 "lexer.ml"

  | 6 ->
# 28 "lexer.mll"
        ( LPAREN )
# 171 "lexer.ml"

  | 7 ->
# 29 "lexer.mll"
        ( RPAREN )
# 176 "lexer.ml"

  | 8 ->
# 30 "lexer.mll"
        ( PLUS )
# 181 "lexer.ml"

  | 9 ->
# 31 "lexer.mll"
        ( MINUS )
# 186 "lexer.ml"

  | 10 ->
# 32 "lexer.mll"
        ( MULT )
# 191 "lexer.ml"

  | 11 ->
# 33 "lexer.mll"
        ( DIV )
# 196 "lexer.ml"

  | 12 ->
# 34 "lexer.mll"
         ( AND )
# 201 "lexer.ml"

  | 13 ->
# 35 "lexer.mll"
         ( OR )
# 206 "lexer.ml"

  | 14 ->
# 36 "lexer.mll"
         ( EQ )
# 211 "lexer.ml"

  | 15 ->
# 37 "lexer.mll"
         ( IF )
# 216 "lexer.ml"

  | 16 ->
# 38 "lexer.mll"
           ( THEN )
# 221 "lexer.ml"

  | 17 ->
# 39 "lexer.mll"
           ( ELSE )
# 226 "lexer.ml"

  | 18 ->
# 40 "lexer.mll"
         ( NEQ )
# 231 "lexer.ml"

  | 19 ->
# 41 "lexer.mll"
        ( LT )
# 236 "lexer.ml"

  | 20 ->
# 42 "lexer.mll"
         ( LE )
# 241 "lexer.ml"

  | 21 ->
# 43 "lexer.mll"
        ( GT )
# 246 "lexer.ml"

  | 22 ->
# 44 "lexer.mll"
         ( GE )
# 251 "lexer.ml"

  | 23 ->
# 45 "lexer.mll"
          ( NOT )
# 256 "lexer.ml"

  | 24 ->
# 47 "lexer.mll"
      ( EOF )
# 261 "lexer.ml"

  | 25 ->
# 49 "lexer.mll"
      ( failwith "Lexical error" )
# 266 "lexer.ml"

  | __ocaml_lex_state -> lexbuf.Lexing.refill_buff lexbuf; 
      __ocaml_lex_token_rec lexbuf __ocaml_lex_state

and comment lexbuf =
    __ocaml_lex_comment_rec lexbuf 46
and __ocaml_lex_comment_rec lexbuf __ocaml_lex_state =
  match Lexing.engine __ocaml_lex_tables __ocaml_lex_state lexbuf with
      | 0 ->
# 52 "lexer.mll"
      ( () )
# 278 "lexer.ml"

  | 1 ->
# 54 "lexer.mll"
      ( comment lexbuf; comment lexbuf )
# 283 "lexer.ml"

  | 2 ->
# 56 "lexer.mll"
      ( comment lexbuf )
# 288 "lexer.ml"

  | 3 ->
# 58 "lexer.mll"
      (failwith "Commentaire non-fermé")
# 293 "lexer.ml"

  | __ocaml_lex_state -> lexbuf.Lexing.refill_buff lexbuf; 
      __ocaml_lex_comment_rec lexbuf __ocaml_lex_state

;;


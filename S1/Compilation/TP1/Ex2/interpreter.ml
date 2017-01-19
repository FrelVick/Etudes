open Ast

let rec interpret_expr (e : Ast.expr) : int =
  match e with
  | Eint i -> i
  | Ebinop (op, e1,e2) ->
     let e1 = interpret_expr e1 in
     let e2 = interpret_expr e2 in
     let opML = match op with
       | Plus -> (+)
       | Minus -> (-)
       | Mult -> ( * )
       | Div -> (/)
     in opML e1 e2
	     (*  | _ -> failwith "Not implemented" *)
		  

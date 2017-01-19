open Ast

let compiler_to_a x i =
  Printf.printf "  li $a%d, %d\n" i x
		
let make_op op i =
  match op with
  | Plus -> Printf.printf "  add $a%d, $a%d, $a%d\n" i (i+1) i
  | Minus ->  Printf.printf "  sub $a%d, $a%d, $a%d\n" i (i+1) i
  | Mult -> Printf.printf "  mul $a%d, $a%d, $a%d\n" i (i+1) i
  | Div -> Printf.printf "  div $a%d, $a%d, $a%d\n" i i (i+1)(* bizarre *)

let make_op_num op i x = 
  match op with
  | Plus -> Printf.printf "  add $a%d, $a%d, %d\n" i i x
  | Minus ->  Printf.printf "  sub $a%d, $a%d, %d\n" i i x
  | Mult -> Printf.printf "  mul $a%d, $a%d, %d\n" i i x
  | Div -> Printf.printf "  div $a%d, $a%d, %d\n" i i x(* bizarre *)  



let rec compile_expr (e : Ast.expr) i =
  match e with
  | Eint o -> compiler_to_a o i
  | Ebinop (op,o1,o2) ->
     begin
     match o1,o2 with
     | Eint i1, Eint i2 -> compiler_to_a i1 i; make_op_num op i i2;
     | Eint o, Ebinop _ ->
	begin
	match op with
	| Plus | Mult -> compile_expr (Ebinop (op,o2,o1)) i
	| _ -> compiler_to_a o i; compile_expr o2 (i+1); make_op op i;
	end
     | Ebinop _, Eint o -> compile_expr o1 i; make_op_num op i o;
     | Ebinop _, Ebinop _ -> compile_expr o1 i; compile_expr o2 (i+1); make_op op i;
     end		
		   
let compile_toplevel_expr (e: Ast.expr) : unit =
  Printf.printf ".text\nmain:\n";
  compile_expr e 0;
  Printf.printf "  li $v0, 1\n  syscall\n  li $v0, 10\n  syscall:\n"

open Ast

let compiler_to_a0 x =
  Printf.printf "  li $a0, %d\n" x

let compiler_to_a1 x =
  Printf.printf "  li $a1, %d\n" x
		
let make_op op =
  match op with
  | Plus -> Printf.printf "  add $a0, $a1, $a0\n"
  | Minus ->  Printf.printf "  sub $a0, $a1, $a0\n"
  | Mult -> Printf.printf "  mul $a0, $a1, $a0\n"
  | Div -> Printf.printf "  div $a0, $a0, $a1\n" (* bizarre *)
		
let compile_push () =
  Printf.printf "  sub $sp, $sp, 4\n  sw  $a0, 0($sp)\n"

let compile_pop () =
  Printf.printf "  lw  $a1, 0($sp)\n  add $sp, $sp, 4\n"

let rec compile_expr (e : Ast.expr) =
  match e with
  | Eint i -> compiler_to_a0 i
  | Ebinop (op,o1,o2) ->
     begin
     match o1,o2 with
     | Eint i1, Eint i2 -> compiler_to_a0 i1; compiler_to_a1 i2;make_op op;
     | Eint i, Ebinop _ -> compiler_to_a0 i; compile_push (); compile_expr o2; compile_pop (); make_op op;
     | Ebinop _, Eint i -> compile_expr o1; compiler_to_a1 i; make_op op;
     | Ebinop _, Ebinop _ -> compile_expr o1; compile_push (); compile_expr o2; compile_pop (); make_op op;
     end
		   
let compile_toplevel_expr (e: Ast.expr) : unit =
  Printf.printf ".text\nmain:\n";
  compile_expr e;
  Printf.printf "  li $v0, 1\n  syscall\n  li $v0, 10\n  syscall:\n"

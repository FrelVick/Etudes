open Ast
       
let compile_push x =
  Printf.printf "  sub $sp, $sp, 4\n  sw  $a%d, 0($sp)\n" x

let compile_pop x =
  Printf.printf "  lw  $a%d, 0($sp)\n  add $sp, $sp, 4\n" x

       
let compiler_to_a x i =
  (if i>3 then compile_push (i mod 4));
  Printf.printf "  li $a%d, %d\n" (i mod 4) x

		
let make_op op i res =
  let j = (i + 1) mod 4 and i = i mod 4 in
  (if res then compile_pop i);
  match op with
  | Plus -> Printf.printf "  add $a%d, $a%d, $a%d\n" i j i
  | Minus ->  Printf.printf "  sub $a%d, $a%d, $a%d\n" i i j
  | Mult -> Printf.printf "  mul $a%d, $a%d, $a%d\n" i j i
  | Div -> Printf.printf "  div $a%d, $a%d, $a%d\n" i i j(* bizarre *)

let make_op_num op i x res =
  let i = i mod 4 in
  (if res then compile_pop i);
  match op with
  | Plus -> Printf.printf "  add $a%d, $a%d, %d\n" i i x
  | Minus ->  Printf.printf "  sub $a%d, $a%d, %d\n" i i x
  | Mult -> Printf.printf "  mul $a%d, $a%d, %d\n" i i x
  | Div -> Printf.printf "  div $a%d, $a%d, %d\n" i i x(* bizarre *)  


			 
let rec require (e : Ast.expr) =
  match e with
  | Eint _ -> 0;
  | Ebinop (op,o1,o2) ->
     begin
     match o1,o2 with
     | Eint i1, Eint i2 -> 1
     | Eint o, Ebinop _ ->
	begin
	match op with
	| Plus | Mult -> require o1
	| _ -> require o2 + 1
	end
     | Ebinop _, Eint o -> require o1
     | Ebinop _, Ebinop _ ->
	begin
	  let req1 = require o1 and req2 = require o2 in
	  match op with
	  | Plus | Mult ->  if req1>=req2 then req2+1 else req1+1;
	  | _ -> req2+1;
	end
     end	
			 
let rec compile_expr (e : Ast.expr) i =
  match e with
  | Eint o -> compiler_to_a o i
  | Ebinop (op,o1,o2) ->
     begin
     match o1,o2 with
     | Eint i1, Eint i2 -> compiler_to_a i1 i; make_op_num op i i2 false;
     | Eint o, Ebinop _ ->
	begin
	match op with
	| Plus | Mult -> compile_expr (Ebinop (op,o2,o1)) i
	| _ -> compiler_to_a o i; compile_expr o2 (i+1); let res = (require o2 > 3) in make_op op i res;
	end
     | Ebinop _, Eint o -> compile_expr o1 i; let res = (require o1 > 3) in make_op_num op i o res;
     | Ebinop _, Ebinop _ ->
	begin
	  let req1 = require o1 and req2 = require o2 in
	  match op with
	  | Plus | Mult when req1<req2 -> compile_expr o2 i; (if req2>3 then compile_push (i mod 4)); compile_expr o1 (i+1); (if req1>3 then compile_pop ((i+1) mod 4)) ;  make_op op i (req2>3);
	  | _ -> compile_expr o1 i; (if req1>3 then compile_push (i mod 4)) ; compile_expr o2 (i+1);(if req2>3 then compile_pop ((i+1) mod 4)) ; make_op op i (req1>3);
	end
     end		
		   
let compile_toplevel_expr (e: Ast.expr) : unit =
  Printf.printf ".text\nmain:\n";
  compile_expr e 0;
  Printf.printf "  li $v0, 1\n  syscall\n  li $v0, 10\n  syscall:\n"

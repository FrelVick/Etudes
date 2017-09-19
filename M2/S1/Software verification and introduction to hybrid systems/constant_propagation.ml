TYPE

  ConstFlattened = flat(snum)
  BoolFlattened  = flat(bool)
  Interval       = ConstFlattened * ConstFlattened
  State          = Var -> Interval


PROBLEM Constant_Propagation

  direction  : forward
  carrier    : State
  init       : (top, bot)
  init_start : [-> top]
  combine    : lub


TRANSFER

// in assignments calculate the new value of the variable and add it to the state
  ASSIGN(variable, expression) = if (@ = bot) then @ else
      @\[variable -> evalAExp(expression, @)] endif

// in procedur calls pass the value of the actual argument to the formal parameter
  CALL(_, param, exp), call_edge = 
      @\[param -> evalAExp(exp, @)]

  CALL(_, _, _), local_edge = bot

  // at the end of procedures reset the formal parameter
  END(_, param) =
      @\[param -> top]

  // test conditions
  IF(expression), true_edge = branch(expression,@,true)

  IF(expression), false_edge = branch(expression,@,false)

  // loop conditions
  WHILE(expression), true_edge = branch(expression,@,true)

  WHILE(expression), false_edge = branch(expression,@,false)


SUPPORT


  evalAExp :: Expression * State -> Interval
  evalAExp(expression, state) =
    case expType(expression) of
      "ARITH_BINARY" => 
        let valLeft  <= evalAExp(expSubLeft(expression),  state),
            valRight <= evalAExp(expSubRight(expression), state) in
              case (valLeft#1, valLeft#2, valRight#1, valRight#2) of
                _,   bot, _,   _   => error("Runtime Error: evalAExp applied to nondefined Expression");
                _,   _,   _,   bot => error("Runtime Error: evalAExp applied to nondefined Expression");
                bot, top, _,   _   => (bot, top);
                _,   _,   bot, top => (bot, top);
                _,   _,   _,   _   => case expOp(expression) of
                                        "+" => addinterval(valLeft,valRight);
                                        "-" => subinterval(valLeft,valRight);
                                        "*" =>
                                        "/" =>
                                      endcase;
              endcase;
                                    
  // TODO rewrite using let resleft <= valLeft ... construction
  addinterval :: Interval * Interval -> Interval
  addinterval(valLeft,valRight) = 
    let resultleft =
          if (valLeft#1 = bot) || (valRight#1 = bot)
            then bot
            else lift(drop(valLeft#1) + drop(valRight#2)) endif,
        resultright = 
          if (valLeft#2 = top) || (valRight#2 = top)
            then top
            else lift(drop(valLeft#2) + drop(valRight#2)) endif in
        (resultleft, resultright)
  
  subinterval :: Interval * Interval -> Interval
  subinterval(valLeft,valRight) = 
    let resultleft =
          if (valLeft#1 = bot) || (valRight#1 = bot)
            then bot
            else lift(drop(valLeft#1) - drop(valRight#2)) endif,
        resultright = 
          if (valLeft#2 = top) || (valRight#2 = top)
            then top
            else lift(drop(valLeft#2) - drop(valRight#2)) endif in
        (resultleft, resultright)

  //TODO multiplication
  multinterval :: Interval * Interval -> Interval
  multinterval(valLeft,valRight) = 
    minimum(valLeft#1*)


  maximum :: ConstFlattened * ConstFlattened * ConstFlattened * ConstFlattened -> ConstFlattened
  maximum(a,b,c,d) = 
  let x1 = a > b,
      x2 = a > c,
      x3 = a > d,
      x4 = b > c,
      x5 = b > d,
      x6 = c > d in
      case (x1,x2,x3,x4,x5,x6) of
        true,true,true,_,_,_    => a;
        false,_,_,true,true,_   => b;
        _, false,_,false,_,true => c;
        _,_,false,_,false,false => d;
      endcase

  minimum :: ConstFlattened * ConstFlattened * ConstFlattened * ConstFlattened -> ConstFlattened
  minimum(a,b,c,d) = 
  let x1 = a < b,
      x2 = a < c,
      x3 = a < d,
      x4 = b < c,
      x5 = b < d,
      x6 = c < d in
      case (x1,x2,x3,x4,x5,x6) of
        true,true,true,_,_,_    => a;
        false,_,_,true,true,_   => b;
        _, false,_,false,_,true => c;
        _,_,false,_,false,false => d;
      endcase

  evalAExp :: Expression * State -> ConstFlattened
  evalAExp(expression, state) =
    case expType(expression) of
      "ARITH_BINARY" => case expOp(expression) of
        "+" => let valLeft  <= evalAExp(expSubLeft(expression),  state),
                   valRight <= evalAExp(expSubRight(expression), state) in
                 lift(valLeft + valRight);
        "-" => let valLeft  <= evalAExp(expSubLeft(expression),  state),
                   valRight <= evalAExp(expSubRight(expression), state) in
                 lift(valLeft - valRight);
        "*" => let valLeft  <= evalAExp(expSubLeft(expression),  state),
                   valRight <= evalAExp(expSubRight(expression), state) in
                 lift(valLeft * valRight);
        "/" => let valLeft  <= evalAExp(expSubLeft(expression),  state),
                   valRight <= evalAExp(expSubRight(expression), state) in
                 if valRight = 0 then
                   top
                 else lift(valLeft / valRight) endif;
        endcase;
      "ARITH_UNARY" =>
	case expOp(expression) of
          "-" => let value <= evalAExp(expSub(expression), state) in
                   lift(-(value));
        endcase;
      "VAR"   => state ( expVar(expression) );
      "CONST" => lift(expVal(expression));
      _       => error("Runtime Error: evalAExp applied to nonarithmetic Expression");
    endcase


  

  evalBExp :: Expression * State -> BoolFlattened
  evalBExp(expression,state) = 
    case expType(expression) of 
      "TRUE" => lift(true);
      "FALSE" => lift(false);
      "BOOL_UNARY" => let value <= evalBExp(expSub(expression), state) in lift(!value);
       "BOOL_BINARY" => case expOp(expression) of
         "<" => let valLeft  <= evalAExp(expSubLeft(expression),  state),
                   valRight <= evalAExp(expSubRight(expression), state) in
                 lift(valLeft < valRight);
         "<=" => let valLeft  <= evalAExp(expSubLeft(expression),  state),
                   valRight <= evalAExp(expSubRight(expression), state) in
                 lift(valLeft <= valRight);
         ">" => let valLeft  <= evalAExp(expSubLeft(expression),  state),
                   valRight <= evalAExp(expSubRight(expression), state) in
                 lift(valLeft > valRight);
         ">=" => let valLeft  <= evalAExp(expSubLeft(expression),  state),
                   valRight <= evalAExp(expSubRight(expression), state) in
                 lift(valLeft >= valRight);
         "=" => let valLeft  <= evalAExp(expSubLeft(expression),  state),
                   valRight <= evalAExp(expSubRight(expression), state) in
                 lift(valLeft = valRight);
         "<>" => let valLeft  <= evalAExp(expSubLeft(expression),  state),
                   valRight <= evalAExp(expSubRight(expression), state) in
                 lift(valLeft != valRight);
         endcase;
       _ => top;
     endcase


  branch :: Expression * State * bool -> State
  branch(expression, state, edge) = let valexp = evalBExp(expression,state) in 
    if valexp = top then state else if drop(valexp) = edge then state else bot endif endif

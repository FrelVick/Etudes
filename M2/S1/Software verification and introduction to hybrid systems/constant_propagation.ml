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
                _,   bot, _,   _   => (top, bot);
                _,   _,   _,   bot => (top, bot);
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
          if (valLeft#1 = bot) || (valRight#2 = top)
            then bot
            else lift(drop(valLeft#1) - drop(valRight#2)) endif,
        resultright = 
          if (valLeft#2 = bot) || (valRight#1 = top)
            then top
            else lift(drop(valLeft#2) - drop(valRight#1)) endif in
        (resultleft, resultright)
  
  
  
  //TODO multiplication
  multinterval :: Interval * Interval -> Interval
  multinterval(valLeft,valRight) = 
    case (valLeft#1,val)  

  maximum :: snum * snum -> snum
  maximum(a,b) =
    if a > b then a else b endif

  minimum :: snum * snum -> snum
  minimum(a,b) = 
    if a < b then a else b endif

  multconstflat :: ConstFlattened * ConstFlattened -> ConstFlattened
  multconstflat(a,b) =
    let lnegative =
      case (a) of
        bot => true;
        
      case (a,b) of
        bot, _ => ;
        top, bot => top;
        <0

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

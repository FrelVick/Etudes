program test4

begin

  if (l < 0)
    k := 1;
  else 
    k := 2;

  if (l < 0)
    m := -2;
  else
    m := 2;

  n := -k + m - 1;
  p := k*m;
  q := k/m;
  r := l/k - q;  
end

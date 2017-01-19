.text
main:
  li $a1, 6
  li $a0, 2
  div $a2, $a1,$a0
  li $v0, 1
  syscall
  li $v0, 10
  syscall:

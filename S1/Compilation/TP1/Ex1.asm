	.text 
main:	j ex14

ex11:	li $a0,4
	add $a0,$a0,6
	j end
	
ex12:	li $a0, 21
	mul $a0,$a0,2
	j end
	
ex13:	li $a0, 7
	div $a0,$a0,2
	add $a0,$a0,4
	j end
	
ex14:	li $a0, 10
	div $a0,$a0,5
	mul $a0,$a0,6
	li $a1, 3
	sub $a0,$a0,$a1
	j end
			
end:	li $v0,1
	syscall
	li $v0,10
	syscall
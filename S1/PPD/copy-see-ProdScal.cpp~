#include <immintrin.h>
#include <iostream>
#include <algorithm>
using namespace std;
int main ()
{
	// Static arrays are stored into the stack thus we need to add an alignment attribute to tell the compiler to correctly	align both arrays.
	float * v0 = (float * )_mm_malloc( 100 * sizeof( float ), 16);
	float * v1 = (float * )_mm_malloc( 100 * sizeof( float ), 16);
	float res[ 4 ] __attribute__((aligned( 16 )));
	float prod;
	
	generate_n( v0, 100, [](){ return std::rand()%10; }); //generate random array
	generate_n( v1, 100, [](){ return std::rand()%10; });
	
	for_each( v0, v0 + 100, []( float x ) { cout << x << ' ' ;}); //output array
	for_each( v1, v1 + 100, []( float x ) { cout << x << ' ' ;});

	auto r0 = _mm_load_ps( &v0[ 0 ] ) * _mm_load_ps( &v1[ 0 ] );

	for( size_t i=4 ; i < 100 ; i+=4 )
	  {
	    r0 += _mm_load_ps( &v0[ i ] ) * _mm_load_ps( &v1[ i ] );
	    //r0 = _mm_add_ps( r0, _mm_load_ps( &tab[ i ] ) ); // sum
	    // r0 += _mm_load_ps( &tab[ i ] );
	  }
	_mm_store_ps( res, r0 );
	prod = res[ 0 ] + res[ 1 ] + res[ 2 ] + res[ 3 ];
	cout << "prod scal=" << prod << endl;

	
	_mm_free( v0 );
	_mm_free( v1 );
	/*
	// Load 4 values from the first array into a SSE register.
	__m128 r0 = _mm_load_ps ( array0 );
	// Store the content of the register into the second array.
	_mm_store_ps ( array1 , r0 ) ;

	for ( auto x: array1 )
	{
		std::cout << x << std::endl;
		}*/
	return 0;
}

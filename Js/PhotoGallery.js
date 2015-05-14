var carrousel = $( ".carrousel" );
$( ".portrait" ).click( function(e){
  var src = $(this).find(".pic").attr( "src" );
  carrousel.find("img").attr( "src", src );
  carrousel.show( 250 );
});

carrousel.find( ".close" ).click( function(e){
  carrousel.find( "img" ).attr( "src", '' );
  carrousel.hide( 250 );
} );
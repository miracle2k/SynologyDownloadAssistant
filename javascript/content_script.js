var qshown = new Array();
var qmsg = new Array();
var showDebug = 0;
var showDashboard = 0;
var hijacked = 0;

var translations = new Array();


function setTranslation( data )
{
	var key = data.key;
	var value = data.value;
	translations[ key ] = value;
}


function hijack( data )
{
	if( data.val == 1 )
	{
		if( hijacked == 1 )
			return;

		$( "a" ).each(function () 
		{
			var found = false;
			var url = $( this ).attr( "href" );
		
			if( url === undefined )
			{
				return true;
			}

			var parts = url.toLowerCase().split( '.' );
			var extension = parts[ parts.length -1 ];

			if( extension == "torrent" && url.toLowerCase().substring( 0 , 4 ) == "http" ) 
			{
				$( this ).addClass( "syno" );
				$( this ).attr( "href" , "javascript:return false;" );
				$( this ).attr( "name" , url );	
				found = true;
			}	
			else if( extension == "torrent" && url.toLowerCase().substring( 0 , 4 ) != "http" )
			{
				var loc = location.href;
				var addr = loc.split( "/" );
				loc = addr[2];
				var proto = addr[0];
				if( url.substring( 0 , 1 ) == "/" )
				{
					url = url.substring( 1 , url.length );
				}

				$( this ).addClass( "syno" );
				$( this ).attr( "href" , "javascript:return false;" );
				$( this ).attr( "name" , proto + "//" + loc + "/" + url );
				found = true;				
			}
			else
			{
				// not standard download link			
				var loc = location.href;
				var addr = loc.split( "/" );
				loc = addr[2];
				var proto = addr[0];
				var query = addr[3];

				// mininova
				if( loc == "www.mininova.org" )
				{
					var link = $( this ).attr( "href" );
					if( link.substring( 0 , 4 ) == "/get" )
					{
						$( this ).addClass( "syno" );
						$( this ).attr( "name" , proto + "//" + loc + $( this ).attr( "href" ) );
						$( this ).attr( "href" , "javascript:return false;" );	
						found = true;	
					}		
				}

				// torrentportal
				else if( loc == "www.torrentportal.com" )
				{
					var link = $( this ).attr( "href" );
					if( link.substring( 0 , 9 ) == "/download" )
					{
						$( this ).addClass( "syno" );
						$( this ).attr( "name" , proto + "//" + loc + $( this ).attr( "href" ) );
						$( this ).attr( "href" , "javascript:return false;" );	
						found = true;	
					}		
				}

				// hightorrent
				else if( loc == "www.hightorrent.to" )
				{
					var link = $( this ).attr( "href" );
					if( link.substring( 0 , 16 ) == "download.php?id=" )
					{
						$( this ).addClass( "syno" );
						$( this ).attr( "name" , proto + "//" + loc + "/" + $( this ).attr( "href" ) );
						$( this ).attr( "href" , "javascript:return false;" );	
						found = true;	
					}		
				}

				// torrentreactor.net
				else if( $( this ).attr( "href" ).indexOf( "torrentreactor.net/download.php?id=" ) > -1 )
				{
					$( this ).addClass( "syno" );
					$( this ).attr( "name" , $( this ).attr( "href" ) );
					$( this ).attr( "href" , "javascript:return false;" );	
					found = true;	
				}

				// torrentreactor.to
				else if( loc == "www.torrentreactor.to" && $( this ).attr( "href" ).indexOf( "torrents/download/" ) > -1 )
				{
					if( $( this ).attr( "href" ).indexOf( "torrentreactor.to" ) > -1 )
					{
						$( this ).addClass( "syno" );
						$( this ).attr( "name" , $( this ).attr( "href" ) );
						$( this ).attr( "href" , "javascript:return false;" );		
					}
					else
					{
						$( this ).addClass( "syno" );
						$( this ).attr( "name" , proto + "//" + loc + $( this ).attr( "href" ) );
						$( this ).attr( "href" , "javascript:return false;" );		
					}
					found = true;
				}
				else
				{
					// var parts = url.toLowerCase().split( '.' );
					// var extension = parts[ parts.length -1 ];
					var jacked = data.types.split( ',' );
					
					if( $.inArray( extension , jacked ) > -1 )
					{
						if( url.toLowerCase().substring( 0 , 4 ) == "http" )
						{
							$( this ).addClass( "syno" );
							$( this ).attr( "name" , $( this ).attr( "href" ) );
							$( this ).attr( "href" , "javascript:return false;" );
						}
						else
						{
							var loc = location.href;
							var addr = loc.split( "/" );

							loc = addr[2];
							var proto = addr[0];
							if( url.substring( 0 , 1 ) == "/" )
							{
								url = url.substring( 1 , url.length );
							}
			
							var ext = "";

							if( addr.length > 2 )
							{
								if( addr[3] == "" )
								{

								}
								else
								{
									for( var g = 3; g < addr.length; g++ )
									{
										ext += addr[g] + "/";
									}
								}
							}

							$( this ).addClass( "syno" );
							$( this ).attr( "href" , "javascript:return false;" );
							$( this ).attr( "name" , proto + "//" + loc + "/" + ext + url );
						} 
					}	
				}			
			}

			if( found == true )
			{
				$( this ).removeAttr( "onclick" );	
				$( this ).attr( "title" , translations[ 'contentscript_downloadwith' ] );	
			}				
	      	});

	
		$( ".syno" ).click( function()
		{
			var url = $( this ).attr( "name" );
			chrome.extension.sendRequest( { 'action' : 'add' , torrent: url } , notify );
			debug( "File download Request : " + url );
		});	

		hijacked = 1;
	}
}


function unjack( data )
{
	if( data.val == 0 )
	{
		if( hijacked == 0 )
			return;

		$( '.syno' ).each( 
			function()
			{	
				var hname = $(this).attr( "name" );
				$( this ).attr( "href" , hname );	
				$( this ).attr( "name" , "" );	
				$( this ).attr( "title" , "" );	
				$( this ).unbind( "click" );	
				$( this ).removeClass( "syno" );			
			} 
		); 
		hijacked = 0;
	}	
}


function setDebug( data )
{
	showDebug = data.val;
	debug( "Debugging mode set to : " + data.val );
}


function setDashboard( data )
{
	if( data.val == 1 )
	{
		setTimeout ( "requestSpeeds()" , 10000 );

		debug( "Attempting to enable dashboard" );
		$( "body" ).append( "<div id='synobox'><table><tr><td valign='middle'><a href=\"javascript:$( '#synobox' ).html( 'test' );\"><img src='" + chrome.extension.getURL( "images/16.png" ) + "'></a></td><td valign='middle' id='synotext'> Synology </td></tr></table></div>" );	
		$( "#synobox" ).makeFloat({x:$(window).width() - 230,y:-5, speed:'fast'});
		$(window).resize( function() 
		{
			$( "#synobox" ).makeFloat({x:$(window).width() - 230,y:-5, speed:'fast'});
		});	
	}
	else
	{
		debug( "Dashboard disabled" );
	}
}


function updateSynobox( data )
{
	$( '#synotext' ).html( "<span>" + data.downspeed + "</span>" );
	debug( "Updated synobox : " + data.downspeed );
}


function debug( msg )
{
	if( showDebug == 1 )
	{
		console.log( msg );
	}
}


function requestStatus()
{
	chrome.extension.sendRequest( { 'action' : 'status' } , queue );
	setTimeout ( "requestStatus()" , 60000 );
	debug( "Requested Status update : " );
}


function requestSpeeds()
{
	chrome.extension.sendRequest( { 'action' : 'speed' } , updateSynobox );
	setTimeout ( "requestSpeeds()" , 10000 );
	debug( "Requested speed update : " );
}


function queue( data )
{
	qmsg = $.merge( qmsg , data );	

	if( qmsg.length > 0 )
	{
		notify( qmsg.shift() );
		if( qmsg.length > 0 )
		{
			var nqueue = function() { queue( qmsg ); };
			setTimeout ( nqueue , 7000 );
			debug( "Queue, Items in queued and queued" );
		}			
	}
}


function notify( data )
{	
	debug( "Notify Called : " + data.msg );

	try
	{
		if( $.inArray( data.msg , qshown ) != -1 )
		{
			return;
		}
	}
	catch( err )
	{
		debug( "Error search array : " + err );
		return;
	}

	if( data.type == "error" )
	{
		var msg = "<center><table><tr><td valign='middle' style='padding-left:20px;padding-right:20px;color:#fff'><img src='";
		msg += chrome.extension.getURL( "images/48.png" ); 
		msg += "' /></td><td valign='middle' style='color:#fff'> " + translations[ 'contentscript_errorsubmit' ] + " </td></tr></table></center>";
		debug( "content_script : notify( data ) : data.type error submitting torrent" );	
		$(window).humanMsg( msg );
	}
	if( data.type == "status" )
	{
		var msg = "<center><table><tr><td valign='middle' style='padding-left:20px;padding-right:20px;color:#fff'><img src='";
		msg += chrome.extension.getURL( "images/48.png" ); 
		msg += "' /></td><td valign='middle' style='color:#fff'>" + data.msg + "</td></tr></table></center>";
		debug( "content_script : notify( data ) : data.type status "  + data.msg );
		$(window).humanMsg( msg );
	}
	else
	{
		var msg = "<center><table><tr><td valign='middle' style='padding-left:20px;padding-right:20px;color:#fff'><img src='";
		msg += chrome.extension.getURL( "images/48.png" );
		msg += "' /></td><td valign='middle' style='color:#fff'> " + translations[ 'contentscript_sucesssubmit' ] + " </td></tr></table></center>";
		debug( "content_script : notify( data ) : data.type else : torrent added sucessfully " );
		$(window).humanMsg( msg );
	}

	try
	{
		qshown.push( data.msg );
	}
	catch( err )
	{
		debug( "Error could not push alert to array : " + err );
	}
}


function contentScriptReceiver( request , sender , callback )
{
	if( request.method == "hijackChange" ) 
	{
		if( request.hijacked == "1" )
		{
			var data = { val: 1 , types: request.types };
			hijack( data );	
			debug( "content_script : contentScriptReceiver( request , sender , callback ) : hikacked : on " );		
		}
		else
		{
			var data = { val: 0 };
			unjack( data );
			debug( "content_script : contentScriptReceiver( request , sender , callback ) : hikacked : off " );	
		}
		callback( { data: "Hijack setting changed" } );
	}
	else if( request.method == "downloadall" )
	{
		if( hijacked == 1 )
		{
			alert( translations[ 'contentscript_unjackfirst' ] );
			return;
		}
		var downloads = new Array();
		var all = request.types.split( ',' );		
		
		$( "a" ).each(function () 
		{
			var type = $( this ).attr( 'href' ).split( '.' );
			type = type[ type.length -1 ];

			for( var t = 0;  t < all.length; t++ )
			{				
				if( all[t] == type )
				{
					var link = $( this ).attr( 'href' );
					if( link.toLowerCase().substring( 0 , 4 ) != "http" )
					{							
						var loc = location.href;
						var url = loc.lastIndexOf( '/' ) + 1;
						url = loc.substring( 0 , url );
						link = url + link;
						debug( "fix url : " + link );
					}
					else
					{
						debug( "url : " + link );
					}
					if( $.inArray( link , downloads ) == -1 )
					{
						downloads.push( link );
					}
					debug( "content_script : contentScriptReceiver( request , sender , callback ) : type detected : " + $( this ).attr( 'href' ) );	
				}				
			}
		});

		debug( "Enabling Download All prompter" );
		$( "#dialog-confirm" ).remove();
		$( "body" ).append( "<div id=\"dialog-confirm\" title=\"" + translations[ 'contentscript_downloadallfiles' ] + "\"><p><span class=\"ui-icon ui-icon-alert\" style=\"float:left; margin:0 7px 20px 0;\"></span>" + translations[ 'contentscript_areyousure' ] + " " + downloads.length +  " " + translations[ 'contentscript_files' ] + "</p></div>" );

		var buttons = {}; 
		buttons[ translations[ 'contentscript_downloadallfiles' ] ] = function() 
		{
			callback( { data: downloads } );
			$( this ).dialog( 'close' );
		}
		buttons[ translations[ 'contentscript_cancel' ] ] = function() 
		{
			$( this ).dialog( 'close' );
		}

		$( "#dialog-confirm" ).dialog({
			resizable: false,
			height:140,
			modal: true,
			buttons: buttons 
		});
	} 
	else if( request.method == "downloadimages" )
	{
		var downloads = new Array();
		var all = request.types.split( ',' );		
		
		$( "img" ).each(function () 
		{
			var type = $( this ).attr( 'src' ).split( '.' );
			type = type[ type.length -1 ];

			for( var t = 0;  t < all.length; t++ )
			{				
				if( all[t] == type )
				{
					var link = $( this ).attr( 'src' );
					if( link.toLowerCase().substring( 0 , 4 ) != "http" )
					{							
						var loc = location.href;
						var url = loc.lastIndexOf( '/' ) + 1;
						url = loc.substring( 0 , url );
						link = url + link;
						debug( "fix image url : " + link );
					}
					else
					{
						debug( "image url : " + link );
					}
					if( $.inArray( link , downloads ) == -1 )
					{
						downloads.push( link );
					}					
					debug( "content_script : contentScriptReceiver( request , sender , callback ) : type detected : " + $( this ).attr( 'src' ) );	
				}				
			}
		});

		debug( "Enabling Download All images prompter" );
		$( "#dialog-confirm" ).remove();
		$( "body" ).append( "<div id=\"dialog-confirm\" title=\"" + translations[ 'contentscript_downloadallimages' ] + "\"><p><span class=\"ui-icon ui-icon-alert\" style=\"float:left; margin:0 7px 20px 0;\"></span>" + translations[ 'contentscript_areyousure' ] + " " + downloads.length +  " " + translations[ 'contentscript_images' ] + "</p></div>" );

		var buttons = {}; 
		buttons[ translations[ 'contentscript_downloadallimages' ] ] = function() 
		{
			callback( { data: downloads } );
			$( this ).dialog( 'close' );
		}
		buttons[ translations[ 'contentscript_cancel' ] ] = function() 
		{
			$( this ).dialog( 'close' );
		}

		$( "#dialog-confirm" ).dialog({
			resizable: false,
			height:140,
			modal: true,
			buttons: buttons 
		});
		
	} 
}


chrome.extension.onRequest.addListener( contentScriptReceiver );


$( document ).ready( function()
{
	chrome.extension.sendRequest( { 'action' : 'translate' , option: 'contentscript_downloadwith' } , setTranslation );
	chrome.extension.sendRequest( { 'action' : 'translate' , option: 'contentscript_errorsubmit' } , setTranslation );
	chrome.extension.sendRequest( { 'action' : 'translate' , option: 'contentscript_sucesssubmit' } , setTranslation );
	chrome.extension.sendRequest( { 'action' : 'translate' , option: 'contentscript_unjackfirst' } , setTranslation );
	chrome.extension.sendRequest( { 'action' : 'translate' , option: 'contentscript_downloadallfiles' } , setTranslation );
	chrome.extension.sendRequest( { 'action' : 'translate' , option: 'contentscript_downloadallimages' } , setTranslation );
	chrome.extension.sendRequest( { 'action' : 'translate' , option: 'contentscript_cancel' } , setTranslation );
	chrome.extension.sendRequest( { 'action' : 'translate' , option: 'contentscript_areyousure' } , setTranslation );
	chrome.extension.sendRequest( { 'action' : 'translate' , option: 'contentscript_files' } , setTranslation );
	chrome.extension.sendRequest( { 'action' : 'translate' , option: 'contentscript_images' } , setTranslation );
	chrome.extension.sendRequest( { 'action' : 'setting' , option: 'dashboard' } , setDashboard );
	chrome.extension.sendRequest( { 'action' : 'setting' , option: 'debug' } , setDebug );	
	chrome.extension.sendRequest( { 'action' : 'setting' , option: 'hijack' } , hijack );	
	chrome.extension.sendRequest( { 'action' : 'setting' , option: 'hijack' } , unjack );	
	setTimeout ( "requestStatus()" , 60000 );	
});




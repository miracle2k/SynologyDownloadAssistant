function getVersion() 
{
    var version = 'NaN';
    var xhr = new XMLHttpRequest();
    xhr.open( 'GET' , chrome.extension.getURL( 'manifest.json' ) , false );
    xhr.send( null );
    var manifest = JSON.parse( xhr.responseText );
    return manifest.version;
}

var version = getVersion();


<?php
/**
 * Provide functions to handle article trackbacks.
 * @package MediaWiki
 * @subpackage SpecialPage
 */

unset($IP);
define('MEDIAWIKI', true);
if ( isset( $_REQUEST['GLOBALS'] ) ) {
	echo '<a href="http://www.hardened-php.net/index.76.html">$GLOBALS overwrite vulnerability</a>';
	die( -1 );
}

require_once('./includes/Defines.php');

if (!file_exists('LocalSettings.php'))
	exit;

require_once('./LocalSettings.php');
require_once('includes/Setup.php');

require_once('DatabaseFunctions.php');

/**
 *
 */
function XMLsuccess() {
	echo "
<?xml version=\"1.0\" encoding=\"utf-8\"?>
<response>
<error>0</error>
</response>
	";
	exit;
}

function XMLerror($err = "Invalid request.") {
	header("HTTP/1.0 400 Bad Request");
	echo "
<?xml version=\"1.0\" encoding=\"utf-8\"?>
<response>
<error>1</error>
<message>Invalid request: $err</message>
</response>
";
		exit;
}

if (!$wgUseTrackbacks)
	XMLerror("Trackbacks are disabled.");

if (   !isset($_POST['url'])
    || !isset($_POST['blog_name'])
    || !isset($_REQUEST['article']))
	XMLerror("Required field not specified");

$dbw =& wfGetDB(DB_MASTER);

$tbtitle = $_POST['title'];
$tbex = $_POST['excerpt'];
$tburl = $_POST['url'];
$tbname = $_POST['blog_name'];
$tbarticle = $_REQUEST['article'];

$title = Title::newFromText($tbarticle);
if (!$title->exists())
	XMLerror("Specified article does not exist.");

$dbw->insert('trackbacks', array(
	'tb_page'	=> $title->getArticleID(),
	'tb_title'	=> $tbtitle,
	'tb_url'	=> $tburl,
	'tb_ex'		=> $tbex,
	'tb_name'	=> $tbname
));

XMLsuccess();
exit;
?>

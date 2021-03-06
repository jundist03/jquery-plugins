<?php
class ErrorFactory
{
  public static function makeFromGitHubError($e)
  {
    if(!$e || !($e instanceof Exception))
      //TODO log this
      $msg = 'Unknown GitHub error.';
    else
    {
      switch($e->getCode())
      {
        case 401:
          //TODO log this
          $msg = 'We are currently processing too many GitHub requests. Please try again in a few minutes.';
          break;

        case 404:
          $msg = 'That repo does not exist.';
          break;

        default:
          $msg = 'Unknown GitHub error.';
          break;
      }
    }

    return new Exception($e);
  }

  public static function makeError($code, $extra = null)
  {
    switch($code)
    {
      case ERROR_NOT_REPO_OWNER:
        $msg = 'Cannot add that repo, because you are not its owner.';
        break;

      case ERROR_FORKED_REPO:
        $msg = 'You cannot add a forked repo.';
        break;

      case ERROR_UNKNOWN_TAG:
        $msg = 'One or more of the tags you supplied do not exist in that repository.';
        break;

      case ERROR_NO_PLUGIN:
        $msg = 'That plugin does not exist.';
        break;

      case ERROR_MISC_SYSTEM:
        //TODO log this
        $msg = 'There was an issue processing your request. Please try again or try again later.';
        break;

      case ERROR_DATABASE:
        //TODO log this - probably means the db is down or there's a bug in our code
        $msg = 'The database is current not available. Please try again in a few minutes.';
        break;

      case ERROR_MISSING_PACKAGE_FILE:
        $msg = 'You need a file named "package.json" in the root of your repository at the HEAD commit.';
        break;

      case ERROR_NO_TAGS:
        $msg = 'You need tags in your repository so that we can define versions.';
        break;

      case ERROR_PLUGIN_ALREADY_EXISTS:
        $msg = 'That plugin already exists.';
        break;

      case ERROR_MISSING_SOURCE_FILE:
        $msg = 'Could not find a source file for the "'.$extra.'" tag.';
        break;

      default: 
        $msg = 'An unknown error occured.';
        break;
    }

    return new Exception($msg);
  }
}
?>

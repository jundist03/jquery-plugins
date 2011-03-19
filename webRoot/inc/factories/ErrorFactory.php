<?php
class ErrorFactory
{
  public static function makeFromGitHubError($e)
  {
    if(!$e || !($e instanceof Exception))
      $msg = 'Unknown GitHub error.';
    else
    {
      switch($e->getCode())
      {
        case 401:
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

  public static function makeError($code)
  {
    switch($code)
    {
      case ERROR_NOT_REPO_OWNER:
        $msg = 'Cannot add that repo, because you are not its owner.';
        break;

      case ERROR_FORKED_REPO:
        $msg = 'You cannot add a forked repo.';
        break;

      default: 
        $msg = 'An unknown error occured.';
        break;
    }

    return new Exception($e);
  }
}
?>
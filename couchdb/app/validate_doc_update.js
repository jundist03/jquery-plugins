function (newDoc, oldDoc, userCtx) {
  var author = (oldDoc || newDoc)['author'];
  var docid = (oldDoc || newDoc)['_id'];

  function forbidden(message) {    
    throw({forbidden : message});
  };
  
  function unauthorized(message) {
    throw({unauthorized : message});
  };

  function require(beTrue, message) {
    if (!beTrue) forbidden(message);
  };

  function requireString(str, message) {
    require(str, message);

    if(message.constructor != String) forbidden(message);
  };

  function requireArray(arr, message) {
    require(arr, message);

    if(arr.constructor != Array) forbidden(message);
  };

  function requireObject(obj, message) {
    require(obj, message);

    if(obj.constructor != Object) forbidden(message);
  };

  function requireVersion(str, message) {
    requireString(str, message);

    var ver = str.split('.');

    if(ver.length != 3 || isNaN(ver[0]) || isNaN(ver[1]) || isNaN(ver[2]))
      forbidden(message);
  };

  // Default Values

  if(!doc.clone)
    doc.clone = 'http://github.com/'+doc.owner+'/'+doc.name+'.git';
  else
    requireString(doc.clone, '"clone" should be a URL to your git file on the Internet.');

  if(!doc.repository)
    doc.repository = 'http://github.com/'+doc.owner+'/'+doc.name;
  else
    requireString(doc.repository, '"repository" should be a URL to your source code control\'s interface (ex., GitHub project page).');

  // Required Items that Cannot Change Between Revisions

  requireString(doc.name, '"name" must be the name of your plugin, used in your file name.');

  if(oldDoc && doc.name != oldDoc.name)
    forbidden('You cannot change the plugin name.');

  requireString(doc.owner, '"owner" must be the owner of the plugin and GitHub repository.');

  if(oldDoc && doc.owner != oldDoc.owner)
    forbidden('You cannot change the plugin owner. You probably want to fork the project under a different name.');

  // Required Items that May Change Between Revisions

  requireString(doc.label, '"label" must be a string, providing a decorative version of your plugin name.');

  requireString(doc.copyright, '"copyright" must be a string with your copyright information.');

  requireString(doc.defaultVersion, '"defaultVersion" must be a string referring to the most stable version of your plugin.');

  // Optional Items

  if(doc.licenses)
  {
    requireArray(doc.licenses, '"licenses" must be an array of strings.');

    for(var i in doc.licenses)
      requireString(doc.licenses[i], 'Each item in the "licenses" array needs to be a string.');
  }

  if(doc.docs)
    requireString(doc.docs, '"docs" should be a relative path to your plugin\'s documentation directory in GitHub (a string).');

  if(doc.description)
    requireString(doc.description, '"description" needs to be text describing your plugin.');

  if(doc.screenshot)
    requireString(doc.screenshot, '"screenshot" should be a URL to an image for your plugin.');

  if(doc.issues)
    requireString(doc.issues, '"issues" should be a URL to your bug tracking software.');

  if(doc.dependencies)
  {
    var dependenciesError = '"dependencies" should be an object of project names to arrays of version numbers.';

    requireObject(doc.dependencies, dependenciesError);

    for(var i in doc.dependencies)
    {
      requireArray(doc.dependencies[i], dependenciesError);

      for(var j in doc.dependencies[i])
        requireVersion(doc.dependencies[i][j], dependenciesError);
    }
  }

  if(doc.maintainers)
  {
    var maintainersError = '"maintainers" must be an array of objects.';

    requireArray(doc.maintainers, maintainersError);

    for(var i in doc.maintainers)
    {
      requireObject(doc.maintainers[i], maintainersError);
      requireString(doc.maintainers[i].name, 'Every maintainer must have a name property that is a string.');

      for(var j in doc.maintainers[i])
      {
        if(j != 'name' && j != 'email' && j != 'twitter')
          doc.maintainers[i][j] = null;
        else
          requireString(doc.maintainers[i][j], 'Each maintainer can have a name, email, and twitter, all of which must be strings.');
      }
    }
  }
}

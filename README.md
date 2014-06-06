# FileSync.js
=================

FileSync is a utility library to download and store files on local system using HTML5 File API. This can be used within your existing for Chrome App(s), using this utility once can easily download a list of files(any files png,jpeg,html,css,js) and later on view them locally in offline mode.



## Quick Examples


```
  var filesToDownload = [
    {
      sourceUrl: "http://www.html5rocks.com/static/images/google_logo_small.png",
      localPath: "/image1/google_logo_small.png"
    },
    {
      sourceUrl: "http://www.html5rocks.com/static/images/google_logo_small.png",
      localPath: "/image2/google_logo_small.png"
    }

  ];
  
  
  //create fileSyncService obj
  var fileSyncService = new FileSyncService();
  
  //set files to download
  fileSyncService.setFilesToDownload(filesToDownload);
  
  //set storage medium (TEMPORARY/PERSISTENT)  fileSyncService.setStorageType(FileSyncService.storageTypes.TEMPORARY);
  
  //set storage quota, once can also set unlimited storage in manifest file of your chrome app
  fileSyncService.setStorageQuota(1024*1024);
  
  //Now lets start the download process
  fileSyncService.startDownloadProcess(function(filesDownloaded){
  	
  	//this progress callback, it will be called after file is dowloaded and created in local filesystem
  	
  }, function(){
  
  	//this success callback, it will be called when all the files are downloaded and created in local system  
  	
  }, function(e){
  	//this error callback, it will be called when any error occurs while downloading and creating files.
  })

    
    
```


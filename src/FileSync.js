/**
 * Created by Ankur Garha on 05/06/14.
 */


function FileSyncService(){
  var _filesToDownload;

  this.setFilesToDownload = function(files){
    _filesToDownload = files;
  }

  this.getFilesToDownload = function(){
    return _filesToDownload;
  }
}

FileSyncService.prototype.startDownloadProcess = function(progressCallback, successCallback, errorCallback){
  async.eachSeries(this.getFilesToDownload(), function (file, doneCallback) {
    setTimeout(function(){
      progressCallback();
      doneCallback(null);
    },1000);

  },function(){
    //We are done with download process so its time to call the successCallback
    successCallback();
  });
}

FileSyncService.prototype.downloadFile = function(file){
  var url = file.sourceUrl;
  if (!url) {
    console.log("There is some error in file url");
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.onload = function (e) {
    if (this.status == 200 && this.readyState == 4) {
      var imageName = file.sourceUrl.substring(file.sourceUrl.lastIndexOf("/") + 1);
      var imageDataBlob = new Blob([this.response]);
    }
    else{
      console.log('ERROR: ' + this.status + ' ' + this.statusText);
      console.log('Could not fetch ' + url);
    }

  }
  xhr.onerror = function (e) {
    console.log('ERROR: ' + this.status + ' ' + this.statusText);
    console.log('Could not fetch ' + url);
  };
  xhr.responseType = "arraybuffer";
  xhr.open('GET', url, true);
  xhr.send();
}


/*
FileSyncService.prototype.downloadFile





async.eachSeries(fileInfoJsonArray, function (file, doneCallback) {
    var url = file.sourceUrl;
    if (!url) {
      console.log("There is some error in file url");
      return;
    }
    var xhr = new XMLHttpRequest();
    xhr.onload = function (e) {
      if (this.status == 200 && this.readyState == 4) {
        var imageName = file.sourceUrl.substring(file.sourceUrl.lastIndexOf("/") + 1);
        var imageDataBlob = new Blob([this.response]);
        async.waterfall([
          function(callback){
            window.requestFileSystem(window.PERSISTENT, 1024 * 1024,function (fs) {
              callback(null, fs);
            },errorHandler);
          },
          function(fs, callback){
            var path = file.localPath.substring(1,file.localPath.lastIndexOf("/"));
            var folders = path.split("/");
            var nextRoot = fs.root;
            async.eachSeries(folders, function (folder, doneCallback) {
              nextRoot.getDirectory(folder, {create: true}, function(dirEntry) {
                nextRoot = dirEntry;
                doneCallback(null);
              },errorHandler)
            },function(){
              callback(null,fs);
            });
          },
          function(fs, callback){
            var path = file.localPath.substring(0,file.localPath.lastIndexOf("/"));
            var folders = path.split("/")
            fs.root.getFile(file.localPath, {create: true}, function (fileEntry) {
              callback(null, fileEntry);
            },errorHandler);

          },
          function(fileEntry, callback){
            console.log('File to write : '+fileEntry.toURL());

            fileEntry.createWriter(function (fileWriter) {
              callback(null, fileWriter);
            },errorHandler);

          },
          function(fileWriter, callback){
            fileWriter.onwriteend = function (e) {
              filesDownloaded++;
              console.log('Sync status : '+filesDownloaded+"/"+fileInfoJsonArray.length);
              progressCallback(filesDownloaded);
              callback("done")
            };
            fileWriter.onerror = function (e) {
              console.log('Write failed: ' + e.toString());
              callback("error");

            };
            fileWriter.write(imageDataBlob);

          }
        ], function (err, result) {
          // result now equals 'done'
          doneCallback(null);
        });
      } else {
        console.log('ERROR: ' + this.status + ' ' + this.statusText);
      }
    };
    xhr.onerror = function (e) {
      console.log('ERROR: ' + this.status + ' ' + this.statusText);
      console.log('Could not fetch ' + url);
    };
    xhr.responseType = "arraybuffer";
    xhr.open('GET', url, true);
    xhr.send();
  },
  function (err) {
    // Square has been called on each of the numbers
    // so we're now done!
    completionCallback(fileInfoJsonArray.length,true);
    console.log("Finished!");
  });

  */
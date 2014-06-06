/**
 * Created by Ankur Garha on 05/06/14.
 */


function FileSyncService(){
  window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
  window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder || window.MozBlobBuilder;
  var _filesToDownload;
  var _storageType;
  var _storageQuota;

  this.setStorageQuota = function(value){
    _storageQuota = value;
  }

  this.getStorageQuota = function(){
    return _storageQuota;
  }


  this.setStorageType = function(type){
    _storageType = type;
  }

  this.getStorageType = function(){
    return _storageType;
  }

  this.setFilesToDownload = function(files){
    _filesToDownload = files;
  }

  this.getFilesToDownload = function(){
    return _filesToDownload;
  }

}

FileSyncService.storageTypes = {
  TEMPORARY : window.TEMPORARY,
  PERSISTENT : window.PERSISTENT
}

FileSyncService.errorHandler = function(e){
  var msg = '';
  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };
  console.log(msg);
}

FileSyncService.prototype.startDownloadProcess = function(progressCallback, successCallback, errorCallback){
  var self = this;
  var filesDownloaded = 0;
  var filesToDownload = this.getFilesToDownload();
  async.eachSeries(filesToDownload, function (file, doneCallback) {
    if(!file.sourceUrl || !file.localPath ){
      var error = new Exception("File object is not supported, each file object should have sourceUrl and localPath ");
      errorCallback(error);
      doneCallback(null);
    }
    self.downloadFile(file,self.getStorageType(), self.getStorageQuota(),function(){
      filesDownloaded++;
      console.log('Sync status : '+filesDownloaded+"/"+filesToDownload.length);

      progressCallback(filesDownloaded);
      doneCallback(null);
    },errorCallback)


  },function(){
    //We are done with download process so its time to call the successCallback
    successCallback();
  });
}

FileSyncService.prototype.downloadFile = function(file, storageType, storageQuota, fileDownloadedCallback,errorHandler){
  var url = file.sourceUrl;
  if (!url) {
    errorHandler(this)
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.onload = function (e) {
    if (this.status == 200 && this.readyState == 4) {
      var imageName = file.sourceUrl.substring(file.sourceUrl.lastIndexOf("/") + 1);
      var imageDataBlob = new Blob([this.response]);
      async.waterfall([
        function(callback){
          window.requestFileSystem(storageType, storageQuota,function (fs) {
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
        fileDownloadedCallback();
      });
    }
    else{
      errorHandler(this)
    }

  }
  xhr.onerror = function (e) {
    errorHandler(this);
  };
  xhr.responseType = "arraybuffer";
  xhr.open('GET', url, true);
  xhr.send();
}

function Exception(message){
  this.message = message;
  this.name = "Exception";
}

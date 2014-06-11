'use strict';
describe("FileSync : Asynchronous specs", function() {
  var request;
  beforeEach(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    callbacks = {
      successCallback: function (value) {
        //this is success callback
        console.log("success callback called");
        done();
      },
      errorCallback: function (e) {
        console.log("error callback called : "+ e.toString());
        done();
      },
      progressCallback: function () {
        console.log("progress callback called");
      }
    };

    spyOn(callbacks, 'successCallback').and.callThrough()
    spyOn(callbacks, 'progressCallback').and.callThrough();
    spyOn(callbacks, 'errorCallback').and.callThrough()

    fileSyncService = new FileSyncService();
    fileSyncService.setFilesToDownload(filesToDownload);
    fileSyncService.setStorageType(FileSyncService.storageTypes.TEMPORARY);
    fileSyncService.setStorageQuota(1024*1024);
    fileSyncService.startDownloadProcess(callbacks.progressCallback, callbacks.successCallback, callbacks.errorCallback)
    request = mostRecentAjaxRequest();

  });

  it('successCallback should be called after all the files have been downloaded', function () {
    expect(callbacks.successCallback).toHaveBeenCalled();
    expect(callbacks.successCallback.calls.count()).toEqual(1);
  });

  it('successCallback should be called only once', function () {
    expect(callbacks.successCallback.calls.count()).toEqual(1);
  });

  it('progressCallback should be called after each file has been downloaded', function () {
      expect(callbacks.progressCallback.calls.count()).toEqual(filesToDownload.length);
  });
});
'use strict';

describe('Service: Filesyncservice', function () {

  // instantiate service
  var fileSyncService, callbacks;

  var filesToDownload = [
    {
      sourceUrl: "",
      localPath: ""
    },
    {
      sourceUrl: "",
      localPath: ""
    }

  ];
  beforeEach(function (_Filesyncservice_) {

    callbacks = {
      successCallback: function (value) {
        //this is success callback
        console.log("success callback called");
      },
      errorCallback: function () {
        console.log("error callback called");

      },
      progressCallback: function () {
        console.log("progress callback called");

      }
    };

    spyOn(callbacks, 'successCallback').andCallThrough();
    ;
    spyOn(callbacks, 'progressCallback').andCallThrough();
    ;
    spyOn(callbacks, 'errorCallback').andCallThrough();
    ;

    fileSyncService = new FileSyncService();
    fileSyncService.setFilesToDownload(filesToDownload);

  });


  it('should set filesToDownload before downloading', function () {
    expect(fileSyncService.getFilesToDownload().length).toBe(filesToDownload.length);
  });

  it('successCallback should be called after all the files have been downloaded', function () {
    fileSyncService.startDownloadProcess(callbacks.progressCallback, callbacks.successCallback, callbacks.errorCallback)

    waitsFor(function () {
      return callbacks.successCallback.calls.length > 0;
    }, "The Ajax call timed out.", 5000);

    runs(function () {
      expect(callbacks.successCallback).toHaveBeenCalled();
      expect(callbacks.successCallback.calls.length).toEqual(1);
    });
  });

  it('successCallback should be called only once', function () {

    fileSyncService.startDownloadProcess(callbacks.progressCallback, callbacks.successCallback, callbacks.errorCallback)

    waitsFor(function () {
      return callbacks.successCallback.calls.length > 0;
    }, "The Ajax call timed out.", 5000);

    runs(function () {
      expect(callbacks.successCallback.calls.length).toEqual(1);
    });

  });

  it('progressCallback should be called after each file has been downloaded', function () {
    fileSyncService.startDownloadProcess(callbacks.progressCallback, callbacks.successCallback, callbacks.errorCallback)

    waitsFor(function () {
      return callbacks.successCallback.calls.length > 0;
    }, "The Ajax call timed out.", 5000);

    runs(function () {
      expect(callbacks.progressCallback.calls.length).toEqual(filesToDownload.length);
    });
  });


});

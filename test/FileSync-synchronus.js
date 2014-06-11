'use strict';

// instantiate service
var fileSyncService, callbacks;

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
describe('FileSync : Synchronous specs', function () {


  beforeEach(function () {

    fileSyncService = new FileSyncService();
    fileSyncService.setFilesToDownload(filesToDownload);
    fileSyncService.setStorageType(FileSyncService.storageTypes.TEMPORARY);
    fileSyncService.setStorageQuota(1024*1024);
  });


  it('should set filesToDownload before downloading', function () {
    expect(fileSyncService.getFilesToDownload().length).toBe(filesToDownload.length);
  });
  it('should set storage quota before downloading', function () {
    expect(fileSyncService.getStorageQuota()).toBe(1024*1024);
  });
  it('should set storage type before downloading', function () {
    expect(fileSyncService.getStorageType()).toBe(FileSyncService.storageTypes.TEMPORARY);
  });
});

export interface IFileInfo {
  name: string;
  contentType: string;
  extension: string;
}

export interface IRemoteFileInfo extends IFileInfo {
  url: string;
}

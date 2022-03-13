import {Injectable} from "@angular/core";
import {ApiConfiguration} from "../api/api-configuration";
import {Observable} from "rxjs";
import {ApiService} from "../api/services/api.service";
import {FileResponse} from "../api/models/file-response";
import {GlueResponse} from "../api/models";

@Injectable({providedIn: 'root'})
export class WorkspaceService {

  constructor(private _apiService: ApiService, private _apiConfiguration: ApiConfiguration) {
  }

  makeDirectory(directoryPath: string): Observable<string> {
    console.log(directoryPath)
    return this._apiService.makeDirectory({body: {directory: directoryPath}});
  }

  uploadFile(file: File, directory: string): Observable<string> {
    let filename = file.name;
    let blob = new Blob([file], {type: file.type})
    return this._apiService.uploadFile({
      body: {
        'filename': directory + '/' + filename,
        'file': blob
      }
    });
  }

  getFiles(): Observable<Array<FileResponse>> {
    return this._apiService.getFiles();
  }

  deleteFiles(path: string): Observable<string> {
    return this._apiService.deleteFile({pathB64: btoa(path)});
  }

  getGlues(): Observable<Array<GlueResponse>> {
    return this._apiService.getGlues();
  }

  moveFile(src:string, dest:string): Observable<string> {
    return this._apiService.moveFile({pathB64: btoa(src), body: {dest: dest}});
  }

  openFile(src: string) {
    window.open(this._apiConfiguration.rootUrl + "/files/" + btoa(src) + "/content", "_blank");
  }

}

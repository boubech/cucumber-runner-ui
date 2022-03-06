import {Injectable} from "@angular/core";
import {ApiConfiguration} from "../api/api-configuration";
import {Observable} from "rxjs";
import {ApiService} from "../api/services/api.service";
import {FileResponse} from "../api/models/file-response";
import {FileToDeleteRequest, GlueResponse} from "../api/models";

@Injectable({providedIn: 'root'})
export class WorkspaceService {

  constructor(private _apiService: ApiService, private _apiConfiguration: ApiConfiguration) {
  }

  uploadFile(file: File): Observable<string> {
    let filename = file.name;
    let blob = new Blob([file], {type: file.type})
    return this._apiService.uploadFile({
      body: {
        'filename': filename,
        'file': blob
      }
    });
  }

  getFiles(): Observable<Array<FileResponse>> {
    return this._apiService.getFiles();
  }

  deleteFiles(files: FileToDeleteRequest[]): Observable<string> {
    return this._apiService.deleteFile({body: files});
  }

  getGlues(): Observable<Array<GlueResponse>> {
    return this._apiService.getGlues();
  }

}

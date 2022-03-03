import {Injectable} from "@angular/core";
import {ApiConfiguration} from "../api/api-configuration";
import {Observable} from "rxjs";
import {ApiService} from "../api/services/api.service";
import {FileResponse} from "../api/models/file-response";

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

  getGlues(): Observable<Array<string>> {
    return this._apiService.getGlues();
  }
}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api/services';

@Component({
  selector: 'app-cucumber-ui',
  templateUrl: './cucumber-ui.component.html',
  styleUrls: ['./cucumber-ui.component.css']
})
export class CucumberUiComponent implements OnInit {

  filename: string = '';
  blob: any = null;

  files: String[] = [];
  glues: String[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.refreshWorkspace();
    this.refreshGlues();
  }

  onFileSelected(event: any): void {
     this.filename = event.target.files[0].name;
     this.blob = new Blob([event.target.files[0]], { type: event.target.files[0].type })
  }

  uploadFile():void {
      this.apiService.uploadFile({body: {
      'filename': this.filename,
      'file' : this.blob
      }}).subscribe( value => this.refreshWorkspace());
  }

  refreshWorkspace(): void {
    this.apiService .getFiles()
                    .subscribe(result => this.files = result);
  }
  refreshGlues(): void {
    this.apiService .getGlues()
                    .subscribe(result => this.glues = result);
  }
}

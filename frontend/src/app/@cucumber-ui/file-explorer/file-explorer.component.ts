import {Component, Input, OnInit} from '@angular/core';
import {FeatureRunnerResponse} from "../../api/models/feature-runner-response";
import {FileResponse} from "../../api/models/file-response";

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent implements OnInit {

  @Input() files: FileResponse[] | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}

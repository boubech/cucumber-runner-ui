import {Injectable} from "@angular/core";
import { GlueResponse } from "src/app/api/models";
import { GherkinHighlightRulesService } from "./gherkin-hightlight-rules.service";

@Injectable({providedIn: 'root'})
export class AutoCompletionService {


    constructor( private _gherkinHighlightRulesService: GherkinHighlightRulesService) {
    }

    get(glues: Array<GlueResponse>): Array<any> {
        let result = glues.map(glue => { return {value: glue.type +' '+ glue.value, score: 1, meta: glue.comment};});

        this._gherkinHighlightRulesService.getLanguagesLabels().forEach(function(label) {
            result.push({value: label, score: 1, meta: ''});
        });

        return  [{
            getCompletions: (editor:any, session: any, pos: any, prefix: any, callback: any) => {
            callback(null, result);
            },
        }];
    }
}

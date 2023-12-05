import { FeatureFlagDirective } from "./feature-flag.directive";
import { NgModule } from "@angular/core";



@NgModule({
    declarations: [
        FeatureFlagDirective        
    ],
    exports: [        
        FeatureFlagDirective
    ]
})
export class FeatureFlagModule {

}
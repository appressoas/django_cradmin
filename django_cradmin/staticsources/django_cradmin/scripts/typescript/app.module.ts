import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
//import {TogglableMenuDirective} from "./directives/toggleable-menu.directive";
import {MenuToggleDirective} from "./directives/menu-toggle.directive";
import {AppComponent} from "./app.component";

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

//import {Component} from '@angular/core';
//import {TogglableMenuDirective} from "./directives/toggleable-menu.directive";
//import {MenuToggleDirective} from "./directives/menu-toggle.directive";
//
//
//@Component({
//  selector: 'cradmin-all'
//  //directives: [MenuToggleDirective, TogglableMenuDirective]
//})
//export class CradminAllComponent {
//  constructor() {}
//}

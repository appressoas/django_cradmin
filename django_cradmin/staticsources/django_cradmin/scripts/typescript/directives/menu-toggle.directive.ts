import {Directive} from '@angular/core';
//import {GlobalVariableService} from "../services/global-variables.service";


@Directive({
  selector: 'cradmin-menu-toggle',
})
/**
 * TODO
 */
export class MenuToggleDirective {
  visible: boolean = false;

  //constructor(private globalVariables: GlobalVariableService) {
  //}
  constructor() {

  }
}

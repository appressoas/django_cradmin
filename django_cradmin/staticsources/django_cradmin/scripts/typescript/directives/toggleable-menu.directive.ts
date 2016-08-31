import {Directive} from '@angular/core';
import {GlobalVariableService} from "../services/global-variables.service";


@Directive({
  selector: 'cradmin-togglable-menu',
})
/**
 * TODO
 */
export class TogglableMenuDirective {
  constructor(private globalVariables: GlobalVariableService) {

  }
}

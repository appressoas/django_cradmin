import {Injectable} from "@angular/core";


@Injectable()
export class GlobalVariableService {
  private globalVariables: Map<string, any>;

  constructor() {
    this.globalVariables = new Map<string, any>();
  }
}

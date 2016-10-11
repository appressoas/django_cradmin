import {CradminMenuToggle} from './CradminMenuToggle';
import {CradminTabController} from './CradminTabController';

export class CradminModuleLoader {
  private static isInitialized = false;

  static setup() {
    if (this.isInitialized){
      console.error("attempting to initialize multiple times? No such luck - fix your bootstrapping!");
      return;
    }
    this.isInitialized = true;
    new CradminMenuToggle();
    new CradminTabController();
  }
}

CradminModuleLoader.setup();

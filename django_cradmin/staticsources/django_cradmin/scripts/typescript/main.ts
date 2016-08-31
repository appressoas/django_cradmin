//import {bootstrap}    from '@angular/platform-browser-dynamic';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from "./app.module";

//bootstrap(<any>AppModule);
platformBrowserDynamic().bootstrapModule(AppModule);

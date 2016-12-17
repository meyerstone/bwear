import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Home } from '../pages/home/home';
import { Folders } from '../pages/folders/folders';
import { Dropbox } from '../providers/dropbox';
import {Items} from "../pages/items/items";

@NgModule({
  declarations: [
    MyApp,
    Home,
    Folders,
    Items
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Home,
    Folders,
    Items
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, [Dropbox]]
})
export class AppModule {}

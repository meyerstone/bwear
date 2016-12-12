import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Home } from '../pages/home/home';
import { Dropbox } from '../providers/dropbox';

@NgModule({
  declarations: [
    MyApp,
    Home
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Home
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, [Dropbox]]
})
export class AppModule {}

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Device } from '@ionic-native/device';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { PagesModule } from '../pages/pages.module';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiProvider } from '../providers/api/api';
import { HttpClientModule } from '@angular/common/http';
import { LoadingProvider } from '../providers/loading/loading';
import { AlertProvider } from '../providers/alert/alert';
import { HelptextsProvider } from '../providers/helptexts/helptexts';
import { SearchProvider } from '../providers/search/search';
import { NetworkProvider } from '../providers/network/network';
import { Network } from '@ionic-native/network';
import { ToastProvider } from '../providers/toast/toast';
import { PushProvider } from '../providers/push/push';
import { Contacts } from '@ionic-native/contacts';
import { Push } from '@ionic-native/push';
import { IBeacon } from '@ionic-native/ibeacon';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Diagnostic } from '@ionic-native/diagnostic';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    PagesModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    LoadingProvider,
    AlertProvider,
    Device,
    HelptextsProvider,
    SearchProvider,
    InAppBrowser,
    NetworkProvider,
    Network,
    ToastProvider,
    Contacts,
    Push,
    PushProvider,
    IBeacon,
    LocalNotifications,
    Diagnostic
  ]
})
export class AppModule {}

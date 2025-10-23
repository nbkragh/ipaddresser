import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { App } from './app';
import { IPaddressList } from './components/ipaddress-list/ipaddress-list';
import { IPaddressForm } from './components/ipaddress-form/ipaddress-form';

@NgModule({
  imports: [
    App,
    IPaddressList,
    IPaddressForm,
    BrowserModule,
    ReactiveFormsModule,
  ],
  bootstrap: [App],
})
export class AppModule {}
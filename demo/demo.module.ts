import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TextInputAutocompleteModule } from '../src';
import { DemoComponent } from './demo.component';

@NgModule({
  declarations: [DemoComponent],
  imports: [BrowserModule, TextInputAutocompleteModule.forRoot()],
  bootstrap: [DemoComponent]
})
export class DemoModule {}

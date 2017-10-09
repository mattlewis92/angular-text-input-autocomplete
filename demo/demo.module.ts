import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TextInputAutocompleteModule } from '../src';
import { DemoComponent } from './demo.component';

@NgModule({
  declarations: [DemoComponent],
  imports: [BrowserModule, TextInputAutocompleteModule, FormsModule],
  bootstrap: [DemoComponent]
})
export class DemoModule {}

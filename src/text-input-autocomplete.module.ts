import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputAutocompleteDirective } from './text-input-autocomplete.directive';
import { TextInputAutocompleteContainerComponent } from './text-input-autocomplete-container.component';
import { TextInputAutocompleteMenuComponent } from './text-input-autocomplete-menu.component';

@NgModule({
  declarations: [
    TextInputAutocompleteDirective,
    TextInputAutocompleteContainerComponent,
    TextInputAutocompleteMenuComponent
  ],
  imports: [CommonModule],
  exports: [
    TextInputAutocompleteDirective,
    TextInputAutocompleteContainerComponent,
    TextInputAutocompleteMenuComponent
  ],
  entryComponents: [TextInputAutocompleteMenuComponent]
})
export class TextInputAutocompleteModule {}

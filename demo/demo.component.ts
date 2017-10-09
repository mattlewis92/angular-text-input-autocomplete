import { Component } from '@angular/core';

// generated from http://listofrandomnames.com/index.cfm?textarea
const names = [
  'Reda Marriott',
  'Cleta Cheatwood',
  'Penney Fortman',
  'Andy Mary',
  'Lilia Ricci',
  'Simonne Horne',
  'Marquis Macgillivray',
  'Ettie Koester',
  'Lovie Mero',
  'Gretta Ripley',
  'Jutta Casteel',
  'Donita Looby',
  'Patrice Guillotte',
  'Kirstin Sever',
  'Ezra Tremper',
  'Darell Monnier',
  'Elvira Balser',
  'Noriko Kluge',
  'Zulema Shake',
  'Kary Schreck'
];

@Component({
  selector: 'mwl-demo-app',
  template: `
    <mwl-text-input-autocomplete-container>
      <textarea
        placeholder="Type @ to search..."
        class="form-control"
        rows="5"
        [(ngModel)]="formControlValue"
        mwlTextInputAutocomplete
        [findChoices]="findChoices"
        [getChoiceLabel]="getChoiceLabel">
      </textarea>
    </mwl-text-input-autocomplete-container>
  `
})
export class DemoComponent {
  formControlValue = '';

  findChoices(searchText: string) {
    return names
      .filter(item => item.toLowerCase().includes(searchText.toLowerCase()))
      .slice(0, 5);
  }

  getChoiceLabel(choice: string) {
    return `@${choice} `;
  }
}

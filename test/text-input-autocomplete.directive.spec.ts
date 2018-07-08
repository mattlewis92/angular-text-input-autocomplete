import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed
} from '@angular/core/testing';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  TextInputAutocompleteModule,
  TextInputAutocompleteMenuComponent
} from '../src';
import { Component, DebugElement, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

/* tslint:disable max-classes-per-file */

@Component({
  template: `
    <mwl-text-input-autocomplete-container>
      <textarea
        [(ngModel)]="formControlValue"
        mwlTextInputAutocomplete
        [findChoices]="findChoices"
        [getChoiceLabel]="getChoiceLabel"
        [triggerCharacter]="triggerCharacter"
        [searchRegexp]="searchRegexp"
        [menuComponent]="menuComponent"
        (menuShown)="menuShown($event)"
        (menuHidden)="menuHidden($event)"
        (choiceSelected)="choiceSelected($event)">
      </textarea>
    </mwl-text-input-autocomplete-container>
  `
})
class TestComponent {
  formControlValue = '';
  findChoices = sinon.stub().returns(['foo', 'bar', 'bam']);
  getChoiceLabel = sinon.stub().returnsArg(0);
  triggerCharacter = '@';
  searchRegexp: string | RegExp = /^\w*$/;
  menuComponent = TextInputAutocompleteMenuComponent;
  menuShown = sinon.spy();
  menuHidden = sinon.spy();
  choiceSelected = sinon.spy();
}

@Component({
  template: 'Custom template!'
})
class CustomMenuComponent extends TextInputAutocompleteMenuComponent {}

@NgModule({
  entryComponents: [CustomMenuComponent],
  declarations: [CustomMenuComponent],
  exports: [CustomMenuComponent]
})
class TestModule {}

describe('text-input-autocomplete directive', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let textarea: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TextInputAutocompleteModule, FormsModule, TestModule],
      declarations: [TestComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    textarea = fixture.debugElement.query(By.css('textarea'));
    document.body.appendChild(fixture.nativeElement);
  });

  function setTextareaSelectionStart(selectionStart: number) {
    Object.defineProperty(textarea.nativeElement, 'selectionStart', {
      value: selectionStart
    });
  }

  function updateTextareaValue(value: string, selectionStart: number) {
    textarea.nativeElement.value = value;
    setTextareaSelectionStart(selectionStart);
    textarea.triggerEventHandler('input', {
      target: textarea.nativeElement
    });
  }

  function typeInTextarea(str: string) {
    const chars = Array.from(str);
    chars.forEach(char => {
      textarea.triggerEventHandler('keypress', {
        key: char
      });
      updateTextareaValue(
        textarea.nativeElement.value + char,
        textarea.nativeElement.value.length + 1
      );
    });
  }

  function getMenu(menuComponent = TextInputAutocompleteMenuComponent) {
    return fixture.debugElement.query(By.directive(menuComponent));
  }

  function arrowDown(menuComponent = TextInputAutocompleteMenuComponent) {
    getMenu(menuComponent).componentInstance.onArrowDown({
      preventDefault: sinon.spy()
    });
    fixture.detectChanges();
  }

  function arrowUp(menuComponent = TextInputAutocompleteMenuComponent) {
    getMenu(menuComponent).componentInstance.onArrowUp({
      preventDefault: sinon.spy()
    });
    fixture.detectChanges();
  }

  it('should show a menu when the trigger character is typed', () => {
    typeInTextarea('test @');
    expect(getMenu()).to.be.ok;
  });

  it('should call find choices with the search text', () => {
    typeInTextarea('test @derp');
    expect(component.findChoices).to.have.been.calledWith('derp');
  });

  it("should remove the menu when typing text that doesn't match the searchRegexp", () => {
    typeInTextarea('test @fhfhdh');
    expect(getMenu()).to.be.ok;
    typeInTextarea(' space removes the menu');
    expect(getMenu()).not.to.be.ok;
  });

  it('should hide the menu if typing text somewhere else in the textarea', () => {
    typeInTextarea('test @foo');
    expect(getMenu()).to.be.ok;
    updateTextareaValue('tesp @foo', 4);
    expect(getMenu()).not.to.be.ok;
  });

  it('should hide the menu if typing text before the mention', () => {
    typeInTextarea('test @foo');
    expect(getMenu()).to.be.ok;
    updateTextareaValue('test typing @foo', 6);
    expect(getMenu()).not.to.be.ok;
  });

  it(
    'should show all options in the menu',
    fakeAsync(() => {
      typeInTextarea('text @fo');
      flush();
      const options = getMenu().queryAll(By.css('li'));
      expect(options.length).to.equal(3);
      expect(options[0].nativeElement.innerText).to.equal('foo');
      expect(options[1].nativeElement.innerText).to.equal('bar');
      expect(options[2].nativeElement.innerText).to.equal('bam');
    })
  );

  it(
    'should select an option when its clicked',
    fakeAsync(() => {
      typeInTextarea('text @b');
      flush();
      const options = getMenu().queryAll(By.css('li'));
      options[1].query(By.css('a')).triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(textarea.nativeElement.value).to.equal('text bar');
      expect(component.formControlValue).to.equal('text bar');
      expect(getMenu()).not.to.be.ok;
    })
  );

  it(
    'should remember the textarea caret position when the focus is lost',
    fakeAsync(() => {
      typeInTextarea('text @b');
      flush();
      const options = getMenu().queryAll(By.css('li'));
      textarea.triggerEventHandler('blur', {});
      setTextareaSelectionStart(0);
      options[1].query(By.css('a')).triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(textarea.nativeElement.value).to.equal('text bar');
      expect(component.formControlValue).to.equal('text bar');
      expect(getMenu()).not.to.be.ok;
    })
  );

  it(
    'should use the keyboard shortcuts to navigate the menu',
    fakeAsync(() => {
      typeInTextarea('text @b');
      flush();
      const options = getMenu().queryAll(By.css('li'));
      expect(options[0].nativeElement.classList.contains('active')).to.be.true;
      expect(options[1].nativeElement.classList.contains('active')).to.be.false;
      arrowDown();
      expect(options[0].nativeElement.classList.contains('active')).to.be.false;
      expect(options[1].nativeElement.classList.contains('active')).to.be.true;
      arrowDown();
      expect(options[1].nativeElement.classList.contains('active')).to.be.false;
      expect(options[2].nativeElement.classList.contains('active')).to.be.true;
      arrowDown();
      expect(options[1].nativeElement.classList.contains('active')).to.be.false;
      expect(options[2].nativeElement.classList.contains('active')).to.be.true;
      arrowUp();
      expect(options[1].nativeElement.classList.contains('active')).to.be.true;
      expect(options[2].nativeElement.classList.contains('active')).to.be.false;
      arrowUp();
      expect(options[0].nativeElement.classList.contains('active')).to.be.true;
      expect(options[1].nativeElement.classList.contains('active')).to.be.false;
      arrowUp();
      expect(options[0].nativeElement.classList.contains('active')).to.be.true;
      expect(options[1].nativeElement.classList.contains('active')).to.be.false;
      arrowDown();
      getMenu().componentInstance.onEnter({
        preventDefault: sinon.spy()
      });
      fixture.detectChanges();
      expect(textarea.nativeElement.value).to.equal('text bar');
      expect(component.formControlValue).to.equal('text bar');
      expect(getMenu()).not.to.be.ok;
    })
  );

  it(
    'should reset the active choice when the list of choices changes',
    fakeAsync(() => {
      typeInTextarea('text @b');
      flush();
      arrowDown();
      component.findChoices.returns(['baz', 'derp']);
      typeInTextarea('a');
      flush();
      const options = getMenu().queryAll(By.css('li'));
      expect(options.length).to.equal(2);
      expect(options[0].nativeElement.classList.contains('active')).to.be.true;
      expect(options[1].nativeElement.classList.contains('active')).to.be.false;
    })
  );

  it('should allow the trigger character to be changed', () => {
    component.triggerCharacter = '/';
    fixture.detectChanges();
    typeInTextarea('text @b');
    expect(getMenu()).not.to.be.ok;
    typeInTextarea(' /test');
    expect(getMenu()).to.be.ok;
  });

  it('should allow the search regexp to be changed', () => {
    component.searchRegexp = /^[abc]*$/;
    fixture.detectChanges();
    typeInTextarea('text @def');
    expect(getMenu()).not.to.be.ok;
    typeInTextarea('text @aaa');
    expect(getMenu()).to.be.ok;
  });

  it('should allow the search regexp to be a string', () => {
    component.searchRegexp = '^[abc]*$';
    fixture.detectChanges();
    typeInTextarea('text @def');
    expect(getMenu()).not.to.be.ok;
    typeInTextarea('text @aaa');
    expect(getMenu()).to.be.ok;
  });

  it('should allow the menu component to be customised', () => {
    component.menuComponent = CustomMenuComponent;
    fixture.detectChanges();
    typeInTextarea('text @def');
    expect(getMenu(CustomMenuComponent).nativeElement.innerHTML).to.equal(
      'Custom template!'
    );
  });

  it(
    'should allow the find choices option to return a promise',
    fakeAsync(() => {
      component.findChoices.resolves(['bar']);
      typeInTextarea('text @def');
      flush();
      const options = getMenu().queryAll(By.css('li'));
      expect(options.length).to.equal(1);
      expect(options[0].nativeElement.innerText).to.equal('bar');
    })
  );

  it(
    'should allow the choice label to be customised',
    fakeAsync(() => {
      component.getChoiceLabel = sinon.stub().returns('@bar');
      fixture.detectChanges();
      typeInTextarea('text @b');
      flush();
      const options = getMenu().queryAll(By.css('li'));
      options[1].query(By.css('a')).triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(component.getChoiceLabel).to.have.been.calledWith('bar');
      expect(textarea.nativeElement.value).to.equal('text @bar');
      expect(component.formControlValue).to.equal('text @bar');
    })
  );

  it('should emit an event when the menu is shown', () => {
    typeInTextarea('test @');
    expect(component.menuShown).to.have.been.calledOnce;
  });

  it('should emit an event when the menu is hidden', () => {
    typeInTextarea('test @');
    typeInTextarea('bar baz');
    expect(component.menuHidden).to.have.been.calledOnce;
  });

  it(
    'should emit an event when a choice is selected',
    fakeAsync(() => {
      typeInTextarea('text @b');
      flush();
      const options = getMenu().queryAll(By.css('li'));
      options[1].query(By.css('a')).triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(component.choiceSelected).to.have.been.calledWith({
        choice: 'bar',
        insertedAt: {
          start: 5,
          end: 8
        }
      });
    })
  );

  it(
    'should set a flag on the menu when the loading promise rejects',
    fakeAsync(() => {
      const err = new Error('fail');
      component.findChoices.rejects(err);
      typeInTextarea('text @b');
      flush();
      expect(getMenu().componentInstance.choiceLoadError).to.equal(err);
    })
  );

  it(
    'should set a flag on the menu when the promise is loading',
    fakeAsync(() => {
      typeInTextarea('text @b');
      expect(getMenu().componentInstance.choiceLoading).to.be.true;
      flush();
      expect(getMenu().componentInstance.choiceLoading).to.be.false;
    })
  );

  it(
    'should not throw when using a custom template and trying to scroll',
    fakeAsync(() => {
      component.menuComponent = CustomMenuComponent;
      fixture.detectChanges();
      typeInTextarea('text @def');
      flush();
      expect(() => arrowDown(CustomMenuComponent)).not.to.throw();
    })
  );

  it(
    'should add a component selector to the menu for global styling',
    fakeAsync(() => {
      typeInTextarea('test @');
      expect(getMenu().nativeElement.tagName.toLowerCase()).to.equal(
        'mwl-text-input-autocomplete-menu'
      );
    })
  );
});

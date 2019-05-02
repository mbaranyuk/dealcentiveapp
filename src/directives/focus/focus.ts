import { Renderer, Directive, Input, OnChanges, ElementRef } from '@angular/core';
/**
 * Generated class for the FocusDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[autofocus]' // Attribute selector
})
export class FocusDirective implements OnChanges {
  @Input('autofocus') isFocused: boolean;

  constructor(private el: ElementRef, private renderer: Renderer) {
  }

  ngOnChanges() {
    if (this.isFocused) {
      setTimeout(() => {
        let element = this.el.nativeElement.localName !== 'input' ? this.el.nativeElement.children[0] : 
          this.el.nativeElement;
        if (element) {
          this.renderer.invokeElementMethod(element, 'focus');
        }
      }, 0);
    }
  }

}

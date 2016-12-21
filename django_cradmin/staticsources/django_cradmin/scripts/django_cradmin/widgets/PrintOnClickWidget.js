import AbstractWidget from "ievv_jsbase/widget/AbstractWidget";

/**
 * Run ``window.print()`` on click widget.
 *
 * @example

 */
export default class PrintOnClickWidget extends AbstractWidget {
  constructor(element) {
    super(element);
    this._onClick = this._onClick.bind(this);
    this.element.addEventListener('click', this._onClick);
  }

  _onClick(event) {
    event.preventDefault();
    window.print();
  }

  destroy() {
    this.element.removeEventListener('click', this._onClick);
  }
}

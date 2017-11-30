import React from "react";
import ReactDOM from "react-dom";
import AbstractWidget from "ievv_jsbase/lib/widget/AbstractWidget";
import FilterListRegistry from '../filterlist/FilterListRegistry'


export default class FilterListWidget extends AbstractWidget {
  getDefaultConfig() {
    return {
      component: 'List'
    }
  }

  constructor (element, widgetInstanceId) {
    super(element, widgetInstanceId)
    const registry = new FilterListRegistry()
    if (!this.config.component) {
      throw new Error('The "component" config is required')
    }
    const listComponentClass = registry.getListComponent(this.config.component)
    if (!listComponentClass) {
      throw new Error(
        `No filterlist list component registered for ` +
        `the "${this.config.component}" alias.`)
    }

    delete this.config.component
    const reactElement = React.createElement(listComponentClass, this.config)
    ReactDOM.render(
      reactElement,
      this.element
    );
  }

  destroy () {
    ReactDOM.unmountComponentAtNode(this.element)
  }
}

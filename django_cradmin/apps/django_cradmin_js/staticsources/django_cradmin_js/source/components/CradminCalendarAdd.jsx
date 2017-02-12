import React from "react";
import ReactDOM from "react-dom";
import LoggerSingleton from "ievv_jsbase/lib/log/LoggerSingleton";
import ObjectManager from "ievv_jsbase/lib/utils/ObjectManager";
import CradminDateSelector from "./CradminDateSelector";


export default class CradminCalendarAdd extends React.Component {

  static get defaultProps() {
    return {
      signalNameSpace: null,
      className: 'calendar-add',
      dateSelectorProps: {}
    }
  }

  constructor(props) {
    super(props);
    if(this.props.signalNameSpace == null) {
      throw new Error('The signalNameSpace prop is required.');
    }
    this.logger = new LoggerSingleton().getLogger(
      'django_cradmin.components.CradminCalendarAdd');
    this._dateSelectorProps = ObjectManager.mergeAndClone(this.props.dateSelectorProps, {
      signalNameSpace: this.props.signalNameSpace
    });
  }

  render() {
    return <div className={this.props.className}>
      <CradminDateSelector {...this._dateSelectorProps}/>
    </div>;
  }
}

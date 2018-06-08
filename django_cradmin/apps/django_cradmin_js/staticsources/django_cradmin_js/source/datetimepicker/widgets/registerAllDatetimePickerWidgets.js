import WidgetRegistrySingleton from 'ievv_jsbase/lib/widget/WidgetRegistrySingleton'
import DatePickerWidget from './DatePickerWidget'
import DateTimePickerWidget from './DateTimePickerWidget'

/**
 * Register all the cradmin widgets for datetimepicker in the ievv_jsbase WidgetRegistrySingleton.
 */
export default function registerAllDatetimePickerWidgets () {
  const widgetRegistry = new WidgetRegistrySingleton()
  widgetRegistry.registerWidgetClass('cradmin-datetimepicker-date', DatePickerWidget)
  widgetRegistry.registerWidgetClass('cradmin-datetimepicker-datetime', DateTimePickerWidget)
}

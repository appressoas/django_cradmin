import WidgetRegistrySingleton from 'ievv_jsbase/lib/widget/WidgetRegistrySingleton'
import EmbeddedDateSelectWidget from './EmbeddedDateSelectWidget'
import EmbeddedDateTimeSelectWidget from './EmbeddedDateTimeSelectWidget'
import ModalDateSelectWidget from './ModalDateSelectWidget'
import ModalDateTimeSelectWidget from './ModalDateTimeSelectWidget'

/**
 * Register all the cradmin widgets for datetimepicker in the ievv_jsbase WidgetRegistrySingleton.
 */
export default function registerAllDatetimePickerWidgets () {
  const widgetRegistry = new WidgetRegistrySingleton()
  widgetRegistry.registerWidgetClass('cradmin-datetimepicker-embedded-date', EmbeddedDateSelectWidget)
  widgetRegistry.registerWidgetClass('cradmin-datetimepicker-modal-date', ModalDateSelectWidget)
  widgetRegistry.registerWidgetClass('cradmin-datetimepicker-embedded-datetime', EmbeddedDateTimeSelectWidget)
  widgetRegistry.registerWidgetClass('cradmin-datetimepicker-modal-datetime', ModalDateTimeSelectWidget)
}

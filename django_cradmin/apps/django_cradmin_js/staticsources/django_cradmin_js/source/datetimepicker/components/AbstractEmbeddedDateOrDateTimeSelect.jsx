import AbstractDateOrDateTimeSelect from './AbstractDateOrDateTimeSelect'

export default class AbstractEmbeddedDateOrDateTimeSelect extends AbstractDateOrDateTimeSelect {
  static get defaultProps () {
    return Object.assign({}, super.defaultProps, {
      bemVariants: ['sane-max-width'],
      bodyBemVariants: ['outlined']
    })
  }

  setDraftMomentObject (draftMomentObject) {
    this.triggerOnChange(draftMomentObject)
  }
}

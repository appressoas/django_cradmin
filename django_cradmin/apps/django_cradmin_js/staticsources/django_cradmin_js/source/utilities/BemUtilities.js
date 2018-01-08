/**
 * General purpose BEM css class utilities.
 */
export default class BemUtilities {

  static addVariants (bemBlockOrElement, bemVariants=[]) {
    let cssClass = bemBlockOrElement
    for (let variant of bemVariants) {
      cssClass = `${cssClass} ${bemBlockOrElement}--${variant}`
    }
    return cssClass
  }

  static buildBemElement (bemBlock, bemElement, bemVariants=[]) {
    return BemUtilities.addVariants(`${bemBlock}__${bemElement}`, bemVariants)
  }
}

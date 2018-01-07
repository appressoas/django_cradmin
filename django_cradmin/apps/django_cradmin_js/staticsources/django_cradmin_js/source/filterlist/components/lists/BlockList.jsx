import AbstractList from './AbstractList'

export default class BlockList extends AbstractList {
  static get defaultProps () {
    return Object.assign(super.defaultProps, {
      bemBlock: 'blocklist'
    })
  }
}

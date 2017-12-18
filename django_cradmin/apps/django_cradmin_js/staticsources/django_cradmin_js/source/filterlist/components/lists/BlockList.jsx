import AbstractList from './AbstractList'

export default class BlockList extends AbstractList {
  get listClassName () {
    return 'blocklist'
  }

  componentDidMount () {
    super.componentDidMount()
    this.loadFirstPageFromApi()
  }
}

import AbstractList from './AbstractList'

export default class List extends AbstractList {
  get listClassName () {
    return 'blocklist'
  }

  componentDidMount () {
    super.componentDidMount()
    this.loadFirstPageFromApi()
  }
}

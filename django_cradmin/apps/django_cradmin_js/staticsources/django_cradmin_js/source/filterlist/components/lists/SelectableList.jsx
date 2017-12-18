import AbstractList from './AbstractList'

export default class SelectableList extends AbstractList {
  get listClassName () {
    return 'selectable-list'
  }

  componentDidMount () {
    super.componentDidMount()
    this.loadFirstPageFromApi()
  }
}

import AbstractList from './AbstractList'

export default class List extends AbstractList {

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    super.componentDidMount()
    this.loadFirstPageFromApi()
  }
}

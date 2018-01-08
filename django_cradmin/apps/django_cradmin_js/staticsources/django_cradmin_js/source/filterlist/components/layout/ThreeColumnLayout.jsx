import React from 'react'
import {
  RENDER_LOCATION_BOTTOM, RENDER_LOCATION_CENTER,
  RENDER_LOCATION_LEFT,
  RENDER_LOCATION_RIGHT,
  RENDER_LOCATION_TOP
} from '../../filterListConstants'
import AbstractLayout from './AbstractLayout'

export default class ThreeColumnLayout extends AbstractLayout {

  //
  //
  // Css classes
  //
  //
  get bemBlock () {
    return 'threecolumn'
  }

  get className () {
    return `${this.bemBlock}__header`
  }

  get leftColumnClassName () {
    return `${this.bemBlock}__leftcolumn`
  }

  get centerColumnClassName () {
    return `${this.bemBlock}__centercolumn`
  }

  get rightColumnClassName () {
    return `${this.bemBlock}__rightcolumn`
  }

  get topBarClassName () {
    return `${this.bemBlock}__topbar`
  }

  get bottomBarClassName () {
    return `${this.bemBlock}__bottombar`
  }

  //
  //
  // Rendering
  //
  //

  renderLeftColumnContent () {
    return this.renderComponentsAtLocation(RENDER_LOCATION_LEFT)
  }

  renderLeftColumn () {
    const content = this.renderLeftColumnContent()
    if (content) {
      return <div className={this.leftColumnClassName} key={'leftColumn'}>
        {content}
      </div>
    }
    return null
  }

  renderTopBarContent () {
    return this.renderComponentsAtLocation(RENDER_LOCATION_TOP)
  }

  renderTopBar () {
    const content = this.renderTopBarContent()
    if (content) {
      return <div className={this.topBarClassName} key={'topBar'}>
        {content}
      </div>
    }
    return null
  }

  renderBottomBarContent () {
    return this.renderComponentsAtLocation(RENDER_LOCATION_BOTTOM) || []
  }

  renderBottomBar () {
    const content = this.renderBottomBarContent()
    if (content) {
      return <div className={this.bottomBarClassName} key={'bottomBar'}>
        {content}
      </div>
    }
    return null
  }

  renderRightColumnContent () {
    return this.renderComponentsAtLocation(RENDER_LOCATION_RIGHT)
  }

  renderRightColumn () {
    const content = this.renderRightColumnContent()
    if (content) {
      return <div className={this.rightColumnClassName} key={'rightColumn'}>
        {content}
      </div>
    }
    return null
  }

  renderCenterColumnContent () {
    const centerColumnContent = [
      this.renderTopBar()
    ]
    centerColumnContent.push(...this.renderComponentsAtLocation(RENDER_LOCATION_CENTER, []))
    if (this.props.isLoadingNewItemsFromApi || this.props.isLoadingMoreItemsFromApi) {
      centerColumnContent.push(this.renderLoadingIndicator())
    }
    centerColumnContent.push(this.renderBottomBar())
    return centerColumnContent
  }

  renderCenterColumn () {
    return <div className={this.centerColumnClassName} key={'centerColumn'}>
      {this.renderCenterColumnContent()}
    </div>
  }

  renderContent () {
    return [
      this.renderLeftColumn(),
      this.renderCenterColumn(),
      this.renderRightColumn()
    ]
  }

  render () {
    return <div className={this.props.bemBlock}>
      {this.renderContent()}
    </div>
  }
}

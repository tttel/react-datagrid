import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import join from '../../utils/join'
import assign from 'object-assign'
import { Flex, Item } from 'react-flex'

const IS_MAC     = global && global.navigator && global.navigator.appVersion && global.navigator.appVersion.indexOf("Mac") != -1
const IS_FIREFOX = global && global.navigator && global.navigator.userAgent && !!~global.navigator.userAgent.toLowerCase().indexOf('firefox')

class Scroller extends Component {

  render(){
    const props = this.props
  
    const {
      itemHeight, 
      dataLength, 
      contentHeight,
      scrollTop,
      height
    } = props
    
    const scrollContentStyle = {
      height: contentHeight
    }

    return <Flex
      row
      wrap={false}
      alignItems="stretch"
      className="react-datagrid__scroller"
    >
      <Flex
        flex={1}
        className="react-datagrid__scroller__content"
        alignItems="stretch"
        wrap={false}
        ref="viewport"
        onWheel={this.onWheel}
        style={{ height }}
      >
        {props.children}
      </Flex> 
      <Item 
        ref="scrollbar"
        className="react-datagrid__scroller__scrollbar"
        onScroll={this.onScrollBarScroll}
        style={{ height, width: this.props.scrollbarWidth }}
      >
        <div 
          className="react-datagrid__scroller__scrollbar__content"
          ref="scrollBarContent" 
          style={scrollContentStyle} 
        />
      </Item>
    </Flex>
  }

  onScrollBarScroll(event){
    this.onScroll(this.normalizeScrollTop(event.target.scrollTop), event)
  }

  onWheel(event){
    const props = this.props
    const {
      scrollStep,
      scrollTop,
      maxScrollTop
    } = props


    const { deltaY } = event
    let newScrollTop = scrollTop
    
    if (deltaY < 0) {
      newScrollTop += deltaY * scrollStep
    } else {
      newScrollTop += deltaY * scrollStep
    }
   
    newScrollTop = this.normalizeScrollTop(newScrollTop)

    if (newScrollTop != scrollTop) {
      this.onScroll(newScrollTop)
    }
  }

  onScroll(scrollTop, event){
    this.props.onScroll(scrollTop, event)
  }

  setScroll(scrollTop){
    findDOMNode(this.refs.scrollbar).scrollTop = scrollTop
  }

  normalizeScrollTop(scrollTop){
    const { maxScrollTop } = this.props
    let newScrollTop = ~~scrollTop

    if (newScrollTop < 0) {
      newScrollTop = 0
    }

    if (newScrollTop > maxScrollTop) {
      newScrollTop = maxScrollTop
    }

    return newScrollTop
  }
}

Scroller.defaultProps = {
  scrollStep: IS_FIREFOX? 40 : 1
}

Scroller.propTypes = {
  className: PropTypes.string,
  scrollTop: PropTypes.number,
  scrollStep: PropTypes.number
}

export default Scroller


import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import join from '../../utils/join'
import assign from 'object-assign'
import { Flex, Item } from 'react-flex'
const DragHelper = require('drag-helper')

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
      height,
      scrollbarWidth
    } = props
    
    const scrollContentStyle = {
      height: contentHeight
    }

    const contentStyle = {
      maxHeight: height,
      minHeight: height, // needed for ie
      maxWidth: `calc(100% - ${scrollbarWidth}px)`
    }

    const scrollerStyle = { 
      height, 
      maxHeight: height, 
      maxWidth: scrollbarWidth, 
      minWidth: scrollbarWidth 
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
        onTouchStart={this.onTouchStart}
        style={contentStyle}
      >
        {props.children}
      </Flex> 
      <div 
        ref="scrollbar"
        className="react-datagrid__scroller__scrollbar"
        onScroll={this.onScrollBarScroll}
        style={scrollerStyle}
      >
        <div 
          className="react-datagrid__scroller__scrollbar__content"
          ref="scrollBarContent" 
          style={scrollContentStyle} 
        />
      </div>
    </Flex>
  }

  // onScroll is triggered indirectly by:
  // - onWheel 
  // - onTouch 
  // - onScroll by scrollbar
  onScroll(scrollTop, event){
    this.props.onScroll(this.normalizeScrollTop(scrollTop), event)
  }

  onScrollBarScroll(event){
    this.onScroll(event.target.scrollTop, event)
  }

  onWheel(event){
    const props = this.props
    const {
      scrollStep,
      scrollTop,
      maxScrollTop
    } = props
   
    const { deltaY, deltaX } = event

    // horizontal scroll is native so do nothing
    if (~~deltaX !== 0) {
      return
    }

      event.preventDefault()
   
    let newScrollTop = scrollTop
    
    if (deltaY < 0) {
      newScrollTop += deltaY * scrollStep
    } else {
      newScrollTop += deltaY * scrollStep
    }
   
    // don't trigger onscroll value doen't change
    // it happens when scrolltop is normalized to 0 or maxScrollTop
    if (newScrollTop != scrollTop) {
      this.onScroll(newScrollTop)
    }
  }

  setScroll(scrollTop){  
    findDOMNode(this.refs.scrollbar).scrollTop = scrollTop
  }

  onTouchStart(event) {
    DragHelper(event, {
      scope: this,
      onDrag: function(event, config) {
        console.log(config.diff)
        // handle touch events only on vertical drags
        if (config.diff.top == 0){
          return
        }
       
        let newScrollPos = this.props.scrollTop - config.diff['top']

        this.onScroll(newScrollPos, event)
        
        // event.stopPropagation()
        // event.preventDefault()
      }        
    })
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


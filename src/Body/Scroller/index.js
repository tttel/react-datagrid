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

  componentDidMount(){
    this.scrollAt(this.props.scrollTop)
  }

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
    const newScrollTop = this.normalizeScrollTop(scrollTop)

    if (newScrollTop != this.props.scrollTop) {
      this.props.onScroll(newScrollTop, event)
    }
  }

  onScrollBarScroll(event){
    if (event.target.scrollTop !== this.props.scrollTop) {
      console.log('aaaaa')
      this.onScroll(event.target.scrollTop, event)
    }
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
    
    this.onScroll(newScrollTop)
  }

  onTouchStart(event) {
    // debugger
    DragHelper(event, {
      scope: this,
      onDragStart: (event, config) => {
        console.log('drag start')
        this.initialScrollStart = this.props.scrollTop
      },
      onDrag: (event, config) => {
        
        if (config.diff.left === 0 && config.diff.top === 0) {
          return
        }

        // handle touch events only on vertical drags
        if (config.diff.top == 0){
          return
        }

        // if no flag set
        if (this.isDragHorizontal == null) {
          this.isDragHorizontal = Math.abs(config.diff.left) > Math.abs(config.diff.top)
        }

        if (this.isDragHorizontal) {
          return
        }

        const newScrollPos = this.initialScrollStart - config.diff.top
        
        this.onScroll(newScrollPos, event) 

        event.stopPropagation()
        event.preventDefault()
      },
      onDrop: (event, config) => {
        this.isDragHorizontal = null
        this.initialScrollStart = null
      }
    })

  }

  scrollAt(scrollTop){  
    this.refs.scrollbar.scrollTop = this.normalizeScrollTop(scrollTop)
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


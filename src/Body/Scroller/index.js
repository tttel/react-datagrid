import React, { PropTypes } from 'react'
import Component from 'react-class'
import join from '../../utils/join'
import assign from 'object-assign'
import { Flex } from 'react-flex'




class Scroller extends Component {

  render(){
    const props = this.props
  
    const {
      itemHeight, 
      dataLength, 
      contentHeight,
      scrollTop
    } = props
    
    const contentClassName = join('react-datagrid__scroller__content')
    const contentProps = {
      className: contentClassName,
      style: {
        height: contentHeight
      }
    }

    return <div
      className="react-datagrid__scroller"
      ref="viewport"
      onWheel={this.onWheel}
    >
      <Flex wrap={false} row alignItems="stretch" {...contentProps}>
        {props.children}
      </Flex> 
    </div>
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
   
    if (newScrollTop <= maxScrollTop) {
      this.onScroll(newScrollTop)
    }
  }

  onScroll(scrollTop){
    this.props.onScroll(scrollTop)
  }

  setScroll(scrollTop){
    this.refs.viewport.scrollTop = scrollTop
  }
}

Scroller.defaultProps = {
  scrollStep: 0.5
}

Scroller.propTypes = {
  className: PropTypes.string,
  scrollTop: PropTypes.number,
  scrollStep: PropTypes.number
}

export default Scroller
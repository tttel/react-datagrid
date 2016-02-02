import React, { PropTypes } from 'react'
import Component from 'react-class'
import join from 'src/utils/join'
import assign from 'object-assign'
import { Flex } from 'react-flex'

export default class Scroller extends Component {

  render(){
    const props = this.props

    const className = 'react-datagrid__scroller'
    const scrollerProps = {
      className,
      style: {
        height: props.totalHeight,
        overflow: 'auto'
      }
    }
   
    const {
      itemHeight, 
      dataLength, 
      contentHeight
    } = props
    
    const contentClassName = join('react-datagrid__scroller__content')
    const contentProps = {
      className: contentClassName,
      style: {
        height: contentHeight
      }
    }

    return <div
      {...scrollerProps}
      ref="viewport"
      onScroll={(e) => this.props.onScroll(e.target.scrollTop, e)}
    >
      <Flex wrap={false} row alignItems="stretch" {...contentProps}>
        {props.children}
      </Flex> 
    </div>
  }

}

Scroller.propTypes = {
  className: PropTypes.string,
  scrollTop: PropTypes.number
}
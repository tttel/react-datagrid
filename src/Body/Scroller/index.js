import React, { PropTypes } from 'react'
import Component from 'react-class'
import join from 'src/utils/join'
import assign from 'object-assign'

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
   
    const {itemHeight, dataLength, contentHeight} = props
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
      <div {...contentProps}>
        {props.children}
      </div> 
    </div>
  }

}

Scroller.propTypes = {
  className: PropTypes.string,
  scrollTop: PropTypes.number
}
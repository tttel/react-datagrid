import React, { PropTypes } from 'react'
import Component from 'react-class'
import { findDOMNode } from 'react-dom'
import { Flex } from 'react-flex'
import Column from '../Column'

/**
 * Navigation helper is used for navigatin between rows using arrows.
 * When a row will recieve focus, it will trigger focus on NavigationHelper.
 * Doing so we can handle onKeyPress, even if the initial focused row loses focus
 * when is unmounted
 */
export default class NavigationHelper extends Component {
  render(){
    const props = this.props
    let {
      onBlur
    } = props

    return <div 
      tabIndex={-1}
      ref="navigationHelper" 
      className="react-datagrid__navigation-helper"
      onBlur={onBlur}
      onKeyDown={this.onKeyDown}
    />
  }

  onKeyDown(event){
    if (event.key === 'ArrowUp') {
      this.props.onArrowUp()
    }

    if (event.key === 'ArrowDown') {
      this.props.onArrowDown()
    }
  }

  focus(){
    this.refs.navigationHelper.focus()
  }
}

NavigationHelper.propTypes = {
  onArrowUp: PropTypes.func,
  onArrowDown: PropTypes.func
}

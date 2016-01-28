import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import assgin from 'object-assign'

import {Item} from 'react-flex'

export default class Cell extends Component {
  render(){
    const props = this.props
    let style = assgin({}, props.style)
    let flex
    
    if (props.width){
      style = assgin(style, {minWidth: props.width})
    } else {
      flex = props.flex || 1
    }

    if (props.textAlign) {
      style.textAlign = props.textAlign
    }

    const columnProps = {
      className: "react-datagrid__column-header",
      style,
      flex
    }
    
    return <Item {...columnProps}>{props.children}</Item>
  }
}
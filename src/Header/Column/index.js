import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'

import {Item} from 'react-flex'

export default class Cell extends Component {
  render(){
    const props = this.props

    const columnProps = {
      className: "react-datagrid__column-header"
    }
    
    if (props.width){
      columnProps.style = {
        maxWidth: props.width
      }
    } else {
      columnProps.flex = props.flex || 1
    }

    return <Item {...columnProps}>{props.children}</Item>    
  }
}
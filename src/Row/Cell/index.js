import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import assign from 'object-assign'
import {Item} from 'react-flex'

export default class Cell extends Component {

  render(){
    const props = this.props

    const name = props.name
    const data = props.data
    const value = data[name]
    const renderCell = props.render

    
    const cellProps = assign({}, props, {
      value,
      className: "react-datagrid__cell",
      children: value
    })

    let result
    if (typeof renderCell === 'function') {
      result = renderCell(value, data, cellProps)
    }

    if (result === undefined){
      result = <Item {...cellProps} />
    }

    return result

  }
}

Cell
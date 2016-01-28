import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import {Flex} from 'react-flex'
import assign from 'object-assign'

import join from '../utils/join'

import Cell from './Cell'

export default class Row extends Component {
  render(){
    const props = this.props
    const data = props.data
    const columns = props.columns

    const className = join('react-datagrid__row', props.className)
    
    let style = assign({}, props.style)
    
    if (props.rowStyle) {
      if (typeof props.rowStyle === 'function') {
        style = props.rowStyle(data, props)
      } else {
        style = assign(style, props.rowStyle)
      }
    }  
    
    const rowProps = assign({}, props, {
      className,
      style,
      children: this.renderRow(data, columns)
    })

    let row
    if (props.renderRow){
      row = props.renderRow(rowProps)
    }

    if (row === undefined){
      row = <Flex {...rowProps} data={null} />
    }

    return row
  }

  renderRow(data, columns){
    return columns.map((column, index) => {
      const key = column.name || index // column.name can be ommited if it has a render method
      return <Cell {...column} data={data} key={key} />
    })
  }
}

Row.propTypes = {
  renderRow: PropTypes.func,
  rowProps: PropTypes.object
}
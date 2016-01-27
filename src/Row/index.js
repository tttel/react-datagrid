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

    const rowProps = assign({}, props, {
      className,
      children: this.renderRows(data, columns)
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

  renderRows(data, columns){
    return columns.map((column) => {
      return <Cell {...column} data={data} key={column.name} />
    })
  }
}
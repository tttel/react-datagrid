import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import {Flex} from 'react-flex'
import assign from 'object-assign'
import join from 'src/utils/join'

import Cell from 'src/Cell'
import getColumnsWidth from 'src/utils/getColumnsWidth'

export default class Row extends Component {
  render(){
    const props = this.props
    const {
      rowHeight,
      data,
      columns,
      minWidth
    } = props

    const className = join(
        'react-datagrid__row',
        props.even &&  'react-datagrid__row--even',
        !props.even && 'react-datagrid__row--odd',
        props.className
      )


    let style = assign({}, props.style, {
      height: rowHeight,
      minWidth
    })
    
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
      row = <Flex wrap={false} {...rowProps} data={null} />
    }

    return row
  }

  renderRow(data, columns){
    const lastIndex = columns.length - 1
    return columns.map((column, index) => {
      const columnProps = column.props
      const {
        name
      } = columnProps
      
      // column.name can be ommited if it has a render method
      const key = `${name}-${index}` || index 
      const isFirst = index === 0
      const isLast = index === lastIndex
      const value = data[name]
      
      return <Cell 
        {...columnProps}
        data={data}
        key={key}
        first={isFirst}
        last={isLast}
        value={value}
      />
    })
  }
}

Row.propTypes = {
  renderRow: PropTypes.func,
  rowProps: PropTypes.object
}
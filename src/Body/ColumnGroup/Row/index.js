import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import {Flex} from 'react-flex'
import assign from 'object-assign'
import join from '../../../utils/join'

import Cell from '../../../Cell'
import getColumnsWidth from '../../../utils/getColumnsWidth'

export default class Row extends Component {
  render(){
    const props = this.props
    const {
      rowHeight,
      data,
      columns,
      minWidth,
      rowStyle,
      renderRow,
      even,
      hover
    } = props


    const className = join(
        'react-datagrid__row',
        even &&  'react-datagrid__row--even',
        !even && 'react-datagrid__row--odd',
        hover && 'react-datagrid__row--hover',
        props.className
      )


    let style = assign({}, props.style, {
      height: rowHeight,
      minWidth
    })
    
    if (rowStyle) {
      if (typeof rowStyle === 'function') {
        style = rowStyle(data, props)
      } else {
        style = assign(style, rowStyle)
      }
    }  
    
    const rowProps = assign({}, props, {
      className,
      style,
      children: this.renderRow(data, columns),
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave
    })

    let row
    if (renderRow) {
      row = renderRow(rowProps)
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

  onMouseEnter(){
    this.props.onHover(this.props.data.id) 
  }

  onMouseLeave(){
    this.props.onBlur(this.props.data.id)     
  }
}

Row.propTypes = {
  renderRow: PropTypes.func,
  rowProps: PropTypes.object,
  onHover: PropTypes.func
}
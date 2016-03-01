import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import {Flex} from 'react-flex'
import assign from 'object-assign'
import join from '../../../utils/join'
import shallowequal from 'shallowequal'

import Cell from '../../../Cell'
import getColumnsWidth from '../../../utils/getColumnsWidth'


export default class Row extends Component {

  shouldComponentUpdate(nextProps){
    if (typeof nextProps.shouldComponentUpdate === 'function'){
      return nextProps.shouldComponentUpdate(nextProps, this.props)
    }

    return !shallowequal(nextProps, this.props)    
  }

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
      over,
      active,
      selected,
      passedProps,
    } = props

    const {
      overClassName,
      selectedClassName,
      className: passedClassName
    } = passedProps

    let className = join(
        'react-datagrid__row',
        even &&  'react-datagrid__row--even',
        !even && 'react-datagrid__row--odd',
        over && 'react-datagrid__row--over',
        selected && 'react-datagrid__row--selected',
        active && 'react-datagrid__row--active',
        props.className
    )

    if (passedProps) {
      className = join(
        className,
        over && passedProps.overClassName,
        selected && passedProps.selectedClassName
      )
    }

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
    }, 
      passedProps,
      
      // passedProps should not overwrite the folowing methods
      // onEvent prop will be called also
    {
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      onClick: this.onClick
    })



    let row
    if (renderRow) {
      row = renderRow(rowProps)
    }

    if (row === undefined){
      row = <Flex wrap={false} {...rowProps} id={null} data={null} />
    }

    return row
  }

  renderRow(data, columns){
    const lastIndex = columns.length - 1
    return columns.map((column, index) => {
      const columnProps = column
      const {
        name
      } = columnProps
      
      // column.name can be ommited if it has a render method
      const key = `${name}-${index}` || index 
      const isFirst = index === 0
      const isLast = index === lastIndex
      const value = data[name]

      const cellProps = assign({}, columnProps, {
        data,
        key,
        first: isFirst,
        last: isLast,
        value
      })

      let cell
      if (this.props.cellFactory){
        cell = this.props.cellFactory(cellProps)
      }

      if (cell === undefined){
        cell = <Cell {...cellProps} />
      }
      
      return cell
    })
  }

  onMouseEnter(event){
    const props = this.props
    const { passedProps } = props
    
    props.onMouseEnter(event, props)

    if (passedProps && passedProps.onMouseEnter) {
      passedProps.onMouseEnter(event, props)
    } 
  }

  onMouseLeave(event){
    const props = this.props
    const { passedProps } = props
    
    props.onMouseLeave(event, props)

    if (passedProps && passedProps.onMouseLeave) {
      passedProps.onMouseLeave(event, props)
    }     
  }

  onClick(event){
    const props = this.props
    const { passedProps } = props
    
    props.onClick(event, props)

    if (passedProps && passedProps.onClick) {
      passedProps.onClick(event, props)
    }     
  }
}

Row.propTypes = {
  renderRow: PropTypes.func,
  passedProps: PropTypes.object,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
  selected: PropTypes.bool
}
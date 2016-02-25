import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import assign from 'object-assign'
import { Item } from 'react-flex'
import join from '../utils/join'
import shallowequal from 'shallowequal'

export default class Cell extends Component {

  shouldComponentUpdate(nextProps){
   return !shallowequal(nextProps, this.props)    
  }

  render(){
    const props = this.props

    const {
      name,
      data,
      render: renderCell,
      column,
      cellDefaultClass,
      coumnDefaultClass,
      value
    } = props
    
     
    const style = assign({}, props.style)

    const baseClassName = column? coumnDefaultClass : cellDefaultClass
    const className = join(
        baseClassName,
        props.textAlign && `${baseClassName}--align-${props.textAlign}`,
        props.first && `${baseClassName}--first`,
        props.last && `${baseClassName}--last`
      )

    let minWidth = props.minWidth
    let width = props.width
    let maxWidth = props.maxWidth

    if (width && minWidth && width < minWidth){
      width = minWidth
    }

    if (minWidth !== undefined){
      style.minWidth = minWidth
    }

    if (maxWidth !== undefined) {
      style.maxWidth = maxWidth
    }

    if (width !== undefined) {
      style.minWidth = style.maxWidth = width
    }
    

    const cellProps = assign({}, props, {
      value,
      className,
      children: value,
      style
    })

    let result
    if (renderCell) {
      result = renderCell(value, data, cellProps)
    }

    if (result === undefined){
      result = <Item {...cellProps} data={null} />
    }

    return result
  }
}

Cell.defaultProps = {
  cellDefaultClass: 'react-datagrid__cell',
  coumnDefaultClass: 'react-datagrid__column-header',
  minWidth: 40
}

Cell.propTypes = {
  style: PropTypes.object,
  render: PropTypes.func,
  data: PropTypes.object,
  name: PropTypes.string,
  width: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
  flex: (props, propName) => {
    const flex = props[propName]

    if (flex < 1 || flex > 24) {
      return new Error(`Column flex prop expected to be between 1 and 24, got ${flex}`)
    }
  },
  cellDefaultClass: PropTypes.string
}
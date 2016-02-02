import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import assign from 'object-assign'
import {Item} from 'react-flex'
import join from 'src/utils/join'

export default class Cell extends Component {

  render(){
    const props = this.props

    const name = props.name
    const data = props.data
    const value = data[name]
    const renderCell = props.render
     
    const style = assign({}, props.style)

    const className = join(
        props.cellDefaultClass,
        props.textAlign && `${props.cellDefaultClass}--align-${props.textAlign}`,
        props.first && `${props.cellDefaultClass}--first`,
        props.last && `${props.cellDefaultClass}--last`
      )

    if (props.width) {
      style.minWidth = props.width
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
  cellDefaultClass: 'react-datagrid__cell'
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
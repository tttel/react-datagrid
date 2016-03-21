import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import assign from 'object-assign'
import { Item } from 'react-flex'
import join from '../../../utils/join'
import shallowequal from 'shallowequal'

export default class Cell extends Component {

  shouldComponentUpdate(nextProps){
    if (typeof nextProps.shouldComponentUpdate === 'function'){
      return nextProps.shouldComponentUpdate(nextProps, this.props)
    }

    return !shallowequal(nextProps, this.props)
  }

  render(){
    const props = this.props

    const {
      name,
      data,
      render: renderCell,
      headerCell,
      cellDefaultClassName,
      headerCellDefaultClassName,
      value,
    } = props

    const style = assign({}, props.style)

    const baseClassName = headerCell? headerCellDefaultClassName : cellDefaultClassName
    let className = join(
        baseClassName,
        props.textAlign && `${baseClassName}--align-${props.textAlign}`,
        props.first && `${baseClassName}--first`,
        props.last && `${baseClassName}--last`
      )

    if (headerCell) {
      className = join(className, props.titleClassName)
    } else {
      className = join(className, props.className)
    }

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

    let cellProps = assign({}, props, {
      value,
      className,
      children: value,
      style,
      onClick: this.onClick
    })

    // TODO:
    // title can be
    if (headerCell) {
      // I want to add onClick event handler so I can
      // use it for sort
      cellProps = this.getHeaderCellProps(cellProps)
    }

    // TODO: don't call renderCell on header cell
    let result
    if (renderCell) {
      result = renderCell(value, data, cellProps)
    }

    if (result === undefined){
      result = <Item {...cellProps} data={null} />
    }

    return result
  }

  getHeaderCellProps(cellProps){
    let children = React.Children.toArray(cellProps.children)
    let sortTools

    if (cellProps.sortInfo) {
      sortTools = this.getScortTools(cellProps.sortInfo.dir)
      children = children.concat(sortTools)
    }

    return assign({}, cellProps, {
      children
    })
  }

  onClick(event){
    if (this.props.onClick) {
      this.props.onClick(event, this.props)
    }
  }

  // direction can be 1, -1 or null
  getScortTools(direction = null){
    if (direction === 0) {
      return
    }

    return direction === -1?
      <i className="react-datagrid__icon-sort-desc" /> :
      <i className="react-datagrid__icon-sort-asc" />
  }
}

Cell.defaultProps = {
  cellDefaultClassName: 'react-datagrid__cell',
  headerCellDefaultClassName: 'react-datagrid__column-header',
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
  cellDefaultClassName: PropTypes.string,
  onClick: PropTypes.func,
}

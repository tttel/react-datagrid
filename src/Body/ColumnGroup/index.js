import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import assign from 'object-assign'
import join from '../../utils/join'

import Row from './Row'
import Column from '../../Column'
import getColumnsWidth from '../../utils/getColumnsWidth'

export default class ColumnGroup extends Component {
  constructor(props){
    super(props)

    this.state = {
      columns: this.getColumns(props)
    }
  }

  componentWillReceiveProps(nextProps){
    if (
        nextProps.columns !== this.props.columns ||
        nextProps.children !== this.props.children
      ) {
      this.setState({
        columns: this.getColumns(nextProps)
      })
    }
  }

  getColumns(props){
    props = props || this.props
    const children = props.children

    // We want to allow users to use columns configuration as jsx
    // or as an array of config objects
    let columns
    if (children) {
      // if we have children, we want to take only valid children
      columns = React.Children
        .toArray(children)
        .filter(child => child && child.props && child.props.isColumn)
    } else {
      // used to add default props
      columns = props.columns.map(column => <Column {...column} />)
    }
    
    return columns
      .map(c => c.props)
  }


  render(){
    const props = this.props
    const {
      viewportHeight,
      width,
      chilren,
      fixed,
      innerWrapperOffset
    } = props

    const style = assign({}, props.style, {
       height: viewportHeight,
      }
    )

    const columns = this.state.columns

    if (width !== undefined) {
      style.width = width
    }

    let minWidth = getColumnsWidth(columns)

    // Fixed means that it is not allowed to have horizontal scroll
    if (fixed) {
      style.minWidth = minWidth
    }

    const className = join(
        'react-datagrid__colum-group', 
        props.className
      )

    const innerWrapperStyle = {
      transform: `translate3d(0,${innerWrapperOffset}px, 0)` 
    }

    return <div 
      {...props} 
      className={className} 
      style={style} 
      data={null}
      onScroll={this.onScroll}
    > 
      <div
        style={innerWrapperStyle}
      >
        {this.renderRows(columns, minWidth)}
      </div>
    </div>
  }

  onScroll(ev){
    ev.stopPropagation()

    this.props.onScroll(ev)
  }

  renderRows(columns, minWidth){
    const props = this.props
    const {
      data,
      from,
      to,
      rowHeight,
      globalProps,
      onRowMouseEnter,
      onRowMouseLeave,
      onRowClick,
      renderRow,
      cellFactory,
      rowStyle,
      overRowId,
      // selected can be an object or an index
      selected,
      isMultiselect,
      hasSelection,
      activeIndex,
      onRowFocus,
      rowProps: passedProps,
      zebraRows,
      bufferValid,
      isScrolling,
      rowPlaceholder,
    } = props

    return data.slice(from, to).map((rowData, index, dataSlice) => {
      const id = rowData[globalProps.idProperty]
      const over = overRowId === id
      const realIndex = index + from
      const key = `row-${realIndex}`
      const even = !!(realIndex % 2)
      const active = activeIndex === realIndex

      const isSelected = hasSelection && 
                        (
                          isMultiselect? 
                            selected.hasOwnProperty(id) : // TODO: use hasOwn, with curry
                            selected == id // to allow type conversion, so 5 == '5'
                        )

      const rowProps = {
        id,
        columns,
        minWidth,
        active,
        // index,
        key,
        over,
        renderRow,
        cellFactory,
        rowStyle,
        realIndex, // is used rowSelect, for a correct selection (onClick)
        rowHeight,
        passedProps,
        bufferValid,
        isScrolling,
        rowPlaceholder,
        selected: isSelected, // row uses selected as a bool, a state 
        data: rowData, 
        onMouseEnter: onRowMouseEnter,
        onMouseLeave: onRowMouseLeave,
        onClick: onRowClick,
        onFocus: onRowFocus
      }

      if (zebraRows) {
        rowProps.even = even
        rowProps.odd = !even
      } else {
        rowProps.even = false
        rowProps.odd = false
      }

      let row
      if (props.rowFactory){
        row = props.rowFactory(rowProps)
      }

      if (row === undefined){
        row = <Row {...rowProps} />
      }

      return row
    })
  }
}

ColumnGroup.propTypes = {
  children: (props, propName) => {
    const children = props[propName]

    React.Children.map(children, (child) => {
      if ( !child || !child.props ||  !child.props.isColumn) {
        return new Error('The only children allowed of Datagrid are ColumnGroup')
      }
    })
  },
  onRowMouseEnter: PropTypes.func,
  onRowMouseLeave: PropTypes.func
}

ColumnGroup.defaultProps = {
  isColumnGroup: true
}

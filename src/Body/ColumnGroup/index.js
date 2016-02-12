import React, { PropTypes } from 'react'
import {findDOMNode} from 'react-dom'
import Component from 'react-class'
import assign from 'object-assign'
import join from '../../utils/join'

import Row from './Row'
import Column from '../../Column'
import getColumnsWidth from '../../utils/getColumnsWidth'

export default class ColumnGroup extends Component {
  render(){
    const props = this.props
    const {
      offsetTop,
      scrollTop,
      viewportHeight,
      width,
      height,
      chilren,
      fixed
    } = props

    const style = assign({}, style, {
       height,
       transform: `translateY(${offsetTop}px)`
      }
    )

    let columns
    if (chilren) {
      columns = chilren
    } else {
      columns = props.columns.map(column => <Column {...column} />)
    }

    if (width) {
      style.width = width
    }

    let minWidth = getColumnsWidth(columns)

    // Fixed means that it is not allowed to have horizontal scroll
    if (fixed) {
      style.minWidth = minWidth
    }

    const className = join('react-datagrid__colum-group', props.className)

    return <div 
      {...props} 
      className={className} 
      style={style} 
      data={null}
      onScroll={(ev) => ev.stopPropagation()}
    > 
      {this.renderRows(columns, minWidth)}
    </div>
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
      rowStyle,
      rowProps: passedProps,
      overRowId,
      selected,
      isMultiselect,
      hasSelection
    } = props

    if (Array.isArray(data) && data.length === 0) {
      return <EmptyText emptyText={this.props.emptyText} />
    }

    return data.slice(from, to).map((rowData, index) => {
      const id = rowData[globalProps.idProperty]
      const key = `row-${id}`
      const even = !!(index % 2)
      
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
        index,
        even,
        key,
        data: rowData, 
        renderRow,
        rowStyle,
        onMouseEnter: onRowMouseEnter,
        onMouseLeave: onRowMouseLeave,
        onClick: onRowClick,
        rowHeight,
        over: overRowId === id,
        selected: isSelected,
        passedProps
      }

      return <Row 
        {...rowProps}
      />
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

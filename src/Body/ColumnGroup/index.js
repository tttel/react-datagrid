import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import assign from 'object-assign'
import join from '../../utils/join'

import shallowequal from 'shallowequal'
import getColumnsWidth from '../../utils/getColumnsWidth'

import InnerWrapper from './InnerWrapper'
import Header from './Header'

export default class ColumnGroup extends Component {

  shouldComponentUpdate(nextProps){
    return !shallowequal(nextProps, this.props)
  }

  render(){
    const props = this.props
    const {
      viewportHeight,
      width,
      chilren,
      fixed,
      innerWrapperOffset,
      hideHeader,
      columns,
      isMultiSort,
      sortable,
      sortInfo,
    } = props
    
    const style = assign({}, props.style, {
       // height: viewportHeight,
      }
    )

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
      {
        !hideHeader
        &&
        <Header 
          columns={columns} 
          minWidth={minWidth} 
          onHeaderCellClick={props.onHeaderCellClick}
          isMultiSort={isMultiSort}
          sortable={sortable}
          sortInfo={sortInfo}
          onHeaderHeightChange={this.props.onHeaderHeightChange}
        />
      }
      <div className="react-datagrid__colum-group__body">
        <div 
          className="react-datagrid__colum-group__body__inner-wrapper"
          style={innerWrapperStyle}
        >
          <InnerWrapper {...props} columns={columns} minWidth={minWidth} innerWrapperOffset={null} />
        </div>
      </div>
    </div>
  }

  onScroll(ev){
    ev.stopPropagation()
    this.props.onScroll(ev)
  }
}

ColumnGroup.defaultProps = {
  isColumnGroup: true
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
  onRowMouseLeave: PropTypes.func,
}


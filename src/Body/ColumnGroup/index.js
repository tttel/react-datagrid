import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import assign from 'object-assign'
import join from '../../utils/join'
import shallowequal from 'shallowequal'

import ColumnGroupInnerWrapper from './ColumnGroupInnerWrapper'
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
      <div style={innerWrapperStyle}>
        <ColumnGroupInnerWrapper {...props} columns={columns} minWidth={minWidth} innerWrapperOffset={null} />
      </div>
    </div>
  }

  onScroll(ev){
    ev.stopPropagation()
    this.props.onScroll(ev)
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


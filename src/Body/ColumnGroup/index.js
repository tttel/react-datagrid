import React, { PropTypes } from 'react'
import {findDOMNode} from 'react-dom'
import Component from 'react-class'
import assign from 'object-assign'
import join from 'src/utils/join'

import Row from './Row'


export default class CoumnGroup extends Component {
  render(){
    const props = this.props
    const {
      offsetTop,
      scrollTop,
      viewportHeight,
      width
    } = props

    const height = viewportHeight + (scrollTop - offsetTop)

    const style = assign({}, style, {
        height,
        transform: `translateY(${offsetTop}px)`
      }
    )

    if (width) {
      style.width = width
    }


    const innerWrapperStyle = {
      width: 800
    }

    const className = join('react-datagrid__colum-group', props.className)

    return <div 
      {...props} 
      className={className} 
      style={style} 
      data={null}
      onScroll={(ev) => ev.stopPropagation()}
    > 
      {this.renderRows()}
    </div>
  }

  renderRows(){
    const props = this.props
    const {
      data,
      from,
      to,
      columns,
      rowHeight,
      globalProps
    } = props


    if (Array.isArray(data) && data.length === 0) {
      return <EmptyText emptyText={this.props.emptyText} />
    }

    return data.slice(from, to).map((rowData, index) => {
      const id = `row-${rowData[globalProps.idProperty]}`
      const even = !!(index % 2)
      const rowProps = assign(
          {
            key: id,
            data: rowData, 
            columns: columns,
            renderRow: props.renderRow,
            rowFactory: props.rowFactory,
            rowStyle: props.rowStyle,
            index,
            even
          },
          props.rowProps
        )

      return <Row 
        {...rowProps}
      />
    })
  }
}


CoumnGroup.defaultProps = {
  isColumnGroup: true
}
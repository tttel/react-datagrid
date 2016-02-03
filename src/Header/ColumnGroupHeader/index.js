import React, { PropTypes } from 'react'
import {findDOMNode} from 'react-dom'
import Component from 'react-class'
import assign from 'object-assign'
import join from 'src/utils/join'
import humanize from 'src/utils/humanize'
import { Flex } from 'react-flex'

import Cell from 'src/Cell'
import getColumnsWidth from 'src/utils/getColumnsWidth'


export default class ColumnGroupHeader extends Component {
  render(){
    const props = this.props
    const {
      width,
      columns
    } = props
    
    const className = join('react-datagrid__header__colum-group', props.className)
    const style = assign({}, props.style)

    let minWidth = getColumnsWidth(columns)

    if (width) {
      style.width = Math.max(width, minWidth)
    }

    if (minWidth){
      style.minWidth = minWidth
    }

    return <Flex
        {...props} 
        wrap={false} 
        className={className} 
        data={null}
        style={style}
      >
      {this.renderColumns(columns)}
    </Flex>
  }

  renderColumns(columns){
    return columns.map((column, index) => {
      const columnProps = column.props
      const {
        name,
        title
      } = columnProps

      let value
      if (title) {
        value = title
      } else {
        value = humanize(name)
      }

      return <Cell column key={index} {...columnProps} value={value}></Cell>
    })
  }
}


ColumnGroupHeader.defaultProps = {
  isColumnGroup: true
}
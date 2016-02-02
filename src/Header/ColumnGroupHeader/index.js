import React, { PropTypes } from 'react'
import {findDOMNode} from 'react-dom'
import Component from 'react-class'
import assign from 'object-assign'
import join from 'src/utils/join'
import humanize from 'src/utils/humanize'
import { Flex } from 'react-flex'

import Cell from 'src/Cell'


export default class CoumnGroup extends Component {
  render(){
    const props = this.props
    const { 
      columns,
      width
    } = props
    
    const className = join('react-datagrid__header__colum-group', props.className)

    const style = assign({}, props.style)

    if (width) {
      style.width = width
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
      let value 
      if (column.title) {
        value = column.title
      } else {
        value = humanize(column.name)
      }

      return <Cell column key={index} {...column} value={value}></Cell>
    })
  }
}


CoumnGroup.defaultProps = {
  isColumnGroup: true
}
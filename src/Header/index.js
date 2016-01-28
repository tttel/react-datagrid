import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import {Flex} from 'react-flex'
import humanize from '../utils/humanize'

import Column from './Column'

export default class Header extends Component {
  render(){
    const props = this.props
    const columns = props.columns
    const dataSource = props.dataSource

    return <Flex className="react-datagrid__header">{this.renderColumns(dataSource, columns)}</Flex>    
  }

  renderColumns(dataSource, columns){
    return columns.map((column, index) => {
      let content 
      if (column.title) {
        content = column.title
      } else {
        content = humanize(column.name)
      }

      return <Column key={index} {...column}>{content}</Column>
    })
  }
}


Header.PropTypes = {

}
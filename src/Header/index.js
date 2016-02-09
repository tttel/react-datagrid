import React, { PropTypes } from 'react'
import Component from 'react-class'
import { findDOMNode } from 'react-dom'
import { Flex } from 'react-flex'
import Column from '../Column'

import ColumnGroupHeader from './ColumnGroupHeader'

export default class Header extends Component {
  render(){
    const props = this.props
    let {
      columns,
      columnGroups
    } = props


    return <Flex wrap={false} row alignItems="stretch" className="react-datagrid__header">
      {
        !!columnGroups? 
        this.renderColumnGroups(columnGroups):
        this.renderColumnGroup(columns)
      }
    </Flex>   
  }


  renderColumnGroup(columns){
    return <ColumnGroupHeader width="100%" columns={columns} />
  }

  renderColumnGroups(columnGroups){
    return React.Children.map(columnGroups, (columnGroup, index) => {
      const columnGroupProps = columnGroup.props
      const {children} = columnGroupProps

      let columns
      if (children) {
        columns = children
      } else {
        columns = columnGroupProps.columns.map(column  => <Column {...column} />)
      }

      
       return <ColumnGroupHeader columns={columns} />
    })
  }
}

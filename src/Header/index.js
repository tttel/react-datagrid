import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import {Flex} from 'react-flex'


import ColumnGroup from './ColumnGroupHeader'

export default class Header extends Component {
  render(){
    const props = this.props
    const {
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
    return <ColumnGroup width="100%" columns={columns} />
  }

  renderColumnGroups(children){
    return React.Children.map(children, (child, index) => {
       return <ColumnGroup  columns={child.props.columns} />
    })
  }
}

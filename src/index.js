import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import is from 'i-s'

import { Flex, Item } from 'react-flex'

import Header from './Header'
import Row from './Row'
import join from './utils/join'

export default class DataGrid extends Component {

  constructor(props){
    super(props)

    this.state = {
    }
  }

  render(){
    const props = this.props
    const columns = props.columns
    const dataSource = props.dataSource

    const className = join(props.className, 'react-datagrid')

    return <Flex column flex alignItems="stretch" {...props} className={className}>
      <Header dataSource={dataSource} columns={columns} />
      
      <Item flex column className="react-datagrid__body">
        {this.renderRows(dataSource, columns)}
      </Item>
    </Flex>
  }

  renderRows(dataSource, columns){
    return dataSource.map((data, index) => {
      return <Row key={index} data={data} columns={columns} />
    })
  }
}

DataGrid.propTypes = {
  loading          : React.PropTypes.bool,
  idProperty       : React.PropTypes.string.isRequired,

  columns: PropTypes.arrayOf(function(props, propName){
    const column = props[propName]
    
    if (!column.name && typeof column.render != 'function'){
      return new Error(`column ${propName} should have a "name" prop or a "render" function!`)
    }
  })
}

DataGrid.defaultProps = {
}

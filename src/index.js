import React, { PropTypes } from 'react'
import Component from 'react-class'
import { Flex, Item } from 'react-flex'
import assign from 'object-assign'

import Header from './Header'

import Body from './Body'

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
      
      <Body 
        {...props}
        data={this.getRowsData(props.dataSource)}
      />
    </Flex>
  }


  getRowsData(dataSource){
    return dataSource
  }

}

DataGrid.propTypes = {
  loading          : React.PropTypes.bool,
  idProperty       : React.PropTypes.string.isRequired,

  columns: PropTypes.arrayOf((props, propName) => {
    const column = props[propName]

    if (!column.name && typeof column.render != 'function'){
      return new Error(`column ${propName} should have a "name" prop or a "render" function!`)
    }
  }),
}

DataGrid.defaultProps = {
}

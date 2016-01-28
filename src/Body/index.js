import React, { PropTypes } from 'react'
import Component from 'react-class'
import {Item} from 'react-flex'
import assign from 'object-assign'

import Row from './Row'

export default class Body extends Component {
  render(){
    const props = this.props
    const {data, columns} = props

    return <Item 
      {...props} 
      flex 
      column 
      className="react-datagrid__body"
    >
      {this.renderRows(data, columns, props)}
    </Item>
  }
  
  renderRows(dataSource, columns, props){
    return dataSource.map((data, index) => {
      const id = data[this.props.idProperty]
      const rowProps = assign(
          {
            key: id,
            data, 
            columns: columns,
            renderRow: props.renderRow,
            rowFactory: props.rowFactory,
            rowStyle: props.rowStyle,
            index
          },
          props.rowProps
        )

      return <Row 
        {...rowProps}
      />
    })
  }
}


Body.propTypes = {

}
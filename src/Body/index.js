import React, { PropTypes } from 'react'
import Component from 'react-class'
import {Item} from 'react-flex'

import assign from 'object-assign'
import join from 'src/utils/join'


import EmptyText from './EmptyText'
import Row from './Row'

export default class Body extends Component {
  render(){
    const props = this.props
    const {data, columns} = props
    const {loading} = props
    const className = join(
        'react-datagrid__body'
      )

    return <Item 
      {...props} 
      flex 
      column 
      className={className}
      data={null}
    >
      {
        !loading && <div className="react-datagrid__scroller">
          {this.renderRows(data, columns, props)}
        </div>
      }
    </Item>
  }

  renderRows(data, columns, props){

    if (!data) {
      console.error(
        `Something went wront with dataSource, most likely loading prop is set to false, and promise did not resolve` )
      return
    }

    if (Array.isArray(data) && data.length === 0) {
      return <EmptyText emptyText={this.props.emptyText} />
    }

    return data.map((rowData, index) => {
      const id = rowData[this.props.idProperty]
      const rowProps = assign(
          {
            key: id,
            data: rowData, 
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
  loading: PropTypes.bool,
}
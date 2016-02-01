import React, { PropTypes } from 'react'
import Component from 'react-class'
import {Item} from 'react-flex'
import getDataRangeToRender from './getDataRangeToRender'

import assign from 'object-assign'
import join from 'src/utils/join'

import EmptyText from './EmptyText'
import Row from './Row'
import Scroller from './Scroller'
import ColumnGroup from 'src/ColumnGroup'

export default class Body extends Component {
  constructor(props){
    super(props)

    this.state = {
      scrollTop: 0
    }
  }

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
        // !loading && <div className="react-datagrid__scroller">
        //   {this.renderRows(data, columns, props)}
        // </div>
      }
      {!loading && this.renderScroller()}
    </Item>
  }

  renderScroller(){
    const props = this.props
    const {data, columns, rowHeight, scrollerHeight} = props
   
    if (!data) {
      console.error(
        `Something went wrong with dataSource, most likely loading prop is set to false, and promise did not resolve` )
      return
    }
    
    const scrollTop = this.state.scrollTop
    const totalHeight = 400
    const {from, to} = getDataRangeToRender(totalHeight, rowHeight, scrollTop)
    const offsetTop = from * rowHeight


    const columnGroups = [
      <ColumnGroup
        key="1"
        data={data}
        offsetTop={offsetTop}
        columns={columns}
        from={from}
        rowHeight={rowHeight}
        to={to}
      />
    ]    

    return <Scroller 
      contentHeight={rowHeight * data.length}
      onScroll={this.onScroll}
      atotalHeight={scrollerHeight}
    >
      {columnGroups}
    </Scroller>
  }

  onScroll(scrollTop){
    this.setState({
      scrollTop
    })
  }

  renderRows(data, columns, props){



    if (Array.isArray(data) && data.length === 0) {
      return <EmptyText emptyText={this.props.emptyText} />
    }

    return data.map((rowData, index) => {
      const id = rowData[this.props.idProperty]
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

Body.defaultProps = {
  rowHeight: 40
}

Body.propTypes = {
  loading: PropTypes.bool,
}
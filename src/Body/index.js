import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import { Item } from 'react-flex'
import getDataRangeToRender from './getDataRangeToRender'
import assign from 'object-assign'
import join from '../utils/join'

import EmptyText from './EmptyText'

import Scroller from './Scroller'
import ColumnGroup from './ColumnGroup'

class Body extends Component {

  constructor(props){
    super(props)

    this.state = {
      bodyHeight: 0,
      scrollTop: 0
    }
  }
  
  componentDidMount(){
    this.setBodyHeight()
  }

  // todo func getBodyHeight
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
      ref="body"
    >
      {props.resizeTool}
      {!loading && this.renderScroller()}
    </Item>
  }

  renderScroller(){
    const props = this.props
    const {
      data, 
      rowHeight,
      contentHeight
    } = props

    if (!data) {
      console.error(
          `Something went wrong with dataSource, most likely loading prop is set to false, and promise did not resolve` 
        )
      return
    }

    return <Scroller 
      contentHeight={contentHeight}
      onScroll={this.onScroll}
      ref="scroller"
    >
      {this.renderColumnGroups()}
    </Scroller>
  }

  renderColumnGroups(){
    const props = this.props
    const {
      data,
      columns,
      rowHeight,
      contentHeight
    } = props

    const bodyHeight = this.state.bodyHeight
    const scrollTop = this.state.scrollTop
    const {from, to} = getDataRangeToRender(bodyHeight, rowHeight, scrollTop)
    const offsetTop = from * rowHeight
    const columnGrupHeight = bodyHeight + (scrollTop - offsetTop)

    const columnGroupProps = {
      data,
      offsetTop,
      scrollTop,
      rowHeight,
      from,
      to,
      viewportHeight: bodyHeight,
      globalProps: props,
      height: columnGrupHeight
    }

    /**
     * If no coumnGroup is specified, create a ColumGroup with all passed columns
     */
    if (!props.children) {
      return <ColumnGroup 
        {...columnGroupProps} 
        columns={columns} 
        width={'100%'}
      />  
    } else {
    /**
     * Children are specified, take each Columngroup and insert props
     */
      return React.Children.map(props.children, (child, index) => {
         return React.cloneElement(
            child, 
            assign(
              {}, 
              child.props, 
              columnGroupProps,
              {key: index}
            )
          )
      })
    }
  }

  onScroll(scrollTop, event){  
    this.setState({
        scrollTop
    })

    if (this.props.onScroll) {
      this.props.onScroll(scrollTop, event)
    }
  }

  onResize(){
    this.setBodyHeight()
  }

  setBodyHeight(){
    const bodyNode = findDOMNode(this.refs.body)
    let bodyHeight

    if (bodyNode) {
      bodyHeight = bodyNode.offsetHeight
    } else {
      bodyHeight = 0
    }

    this.setState({
      bodyHeight: bodyHeight
    })
  }
}

Body.defaultProps = {
  rowHeight: 40,
}

Body.propTypes = {
  loading: PropTypes.bool,
  onScroll: PropTypes.func
}



import resizeNotifier from 'react-notify-resize'

export default resizeNotifier(Body)
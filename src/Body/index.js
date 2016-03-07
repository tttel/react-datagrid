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

    window.scrollToIndex = this.scrollToIndex.bind(this)

    this.state = {
      bodyHeight: 0,
      scrollTop: props.defaultScrollTop,
      overRowId: null,
      maxScrollTop: props.defaultScrollTop,
    }
  }
  
  componentDidMount(){
    this.setBodyHeight()
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.data === null) {
      this.setState({
        scrollTop: 0
      })
    }

    if (nextProps.contentHeight !== this.props.contentHeight) {
      this.setState({
        maxScrollTop: (
            nextProps.contentHeight - this.state.bodyHeight
          )
      })
    }
  }

  
  componentWillUpdate(nextProps, nextState){
    if (!this.refs.scroller) {
      return
    }

    if (
        // if controlled set each time, so the scrollbar is forced to not move
        nextProps.scrollTop != null
      ) {
        this.refs.scroller.scrollAt(nextProps.scrollTop)
      } else if (nextState.scrollTop !== this.state.scrollTop) {
        this.refs.scroller.scrollAt(nextState.scrollTop)
      }
  }

  // todo func getBodyHeight
  render(){
    const preparedProps = this.p = this.prepareProps(this.props)
    const {
      data, 
      columns,
      loading,
      scrollTop,
      resizeTool
    } = preparedProps

    const className = join(
        'react-datagrid__body'
      )

    if ((Array.isArray(data) && data.length === 0) || data === null && !loading) {
      return <EmptyText emptyText={this.props.emptyText} />
    }

    return <Item  
      flex 
      column 
      className={className}
      data={null}
      ref="body"
    >
      {resizeTool}
      {this.renderScroller()}
    </Item>
  }

  renderScroller(){
    if (!this.props.data) {
      return
    }

    return <Scroller 
      ref="scroller"
      contentHeight={this.props.contentHeight}
      onScroll={this.onScroll}
      onKeyPress={this.onScrollerKeyPress}
      scrollTop={this.p.scrollTop}
      maxScrollTop={this.p.maxScrollTop}
      height={this.state.bodyHeight}
      scrollbarWidth={this.props.scrollbarWidth}
    >
      {this.renderColumnGroups()}
    </Scroller>
  }

  renderColumnGroups(){
    const preparedProps = this.p
    const {
      data,
      columns,
      rowHeight,
      contentHeight,
      renderRow,
      rowProps,
      selected,
      isMultiselect,
      hasSelection,
      onRowClick,
      rowFactory,
      cellFactory,
      extraRows,
      onColumnGroupScroll,
      activeIndex,
      onRowFocus,
      scrollTop,
      children,
      buffer
    } = preparedProps

    const bodyHeight = this.p.bodyHeight

    let fromTo
    // first render
    if (!this.fromTo) {
      this.fromTo = getDataRangeToRender(bodyHeight, rowHeight, scrollTop, extraRows)
      this.oldScrollTop = scrollTop
    }
    
    // we need to buffer rendering
    // only rerender rows when buffer (half of extra rows height) is scrolled
    // and we need to render anoter set of rows
    // cache scrollTop and from and to
    if (Math.abs(this.oldScrollTop - scrollTop) >= buffer - 10) { // buffer pass check
      // render anoter set or forws
      this.fromTo = getDataRangeToRender(bodyHeight, rowHeight, scrollTop, extraRows)
      this.oldScrollTop = scrollTop
    }

    const {from, to} = this.fromTo
    const offsetTop = from * rowHeight
    const innerWrapperOffset = offsetTop - scrollTop

    const columnGroupProps = {
      data,
      rowHeight,
      isMultiselect,
      hasSelection,
      rowProps,
      from,
      to,
      renderRow,
      rowFactory,
      cellFactory,
      selected,
      activeIndex,
      onRowFocus,
      scrollTop,
      innerWrapperOffset,
      viewportHeight: bodyHeight,
      globalProps: this.props,
      onRowMouseEnter: this.onRowMouseEnter,
      onRowMouseLeave: this.onRowMouseLeave,
      onRowClick: onRowClick, 
      overRowId: this.state.overRowId,
      onScroll: onColumnGroupScroll
    }

    /**
     * If no coumnGroup is specified, create a ColumGroup with all passed columns
     */
    if (!children) {
      return <ColumnGroup 
        {...columnGroupProps} 
        columns={columns} 
        width={'100%'}
      />  
    } else {
    /**
     * Children are specified, take each Columngroup and insert props
     */
      return React.Children.map(children, (child, index) => {
         return React.cloneElement(
            child, 
            assign(
              {}, 
              child.props, 
              columnGroupProps,
              { key: index }
            )
          )
      })
    }
  }

  onRowMouseEnter(event, rowProps){
    this.setState({
      overRowId: rowProps.id
    })

    this.p.onRowMouseEnter(event, rowProps)
  }

  onRowMouseLeave(event, rowProps){
    // remove id if still present
    if (this.state.overRowId === rowProps.id) {
      this.setState({
        overRowId: null 
      })
    }

    this.p.onRowMouseLeave(event, rowProps)
  }

  onScroll(scrollTop, event){

    this.scrollAt(scrollTop)
    
    // There is an error of one pixel in chrome, add -2 to be safe
    if (this.p.contentHeight - 2 <= scrollTop + this.p.bodyHeight) {
      this.p.onScrollBottom()
    }

    if (this.p.onScroll) {
      this.p.onScroll(scrollTop, event)
    }
  }

  onResize(){
    this.setBodyHeight()
  }

  onScrollerKeyPress(event){
    // console.log(event)
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
      bodyHeight: bodyHeight,
    })
  }

  scrollToIndex(index, {position} = {position: 'top'}){
    // determine height at witch scrolltop should be
    const {
      bodyHeight,
      extraRows,
      rowHeight
    } = this.p

    let scrollTop

    if (position === 'top') {
      scrollTop = (index - 1) * rowHeight || 0
    } else if (position === 'bottom') {
      scrollTop = ((index - 1) * rowHeight || 0) - bodyHeight + rowHeight
    } else {
      console.error('position can be top or bottom')
      return
    }

    this.scrollAt(scrollTop)
  }

  scrollAt(scrollTop){
    this.setState({
      scrollTop
    })
  }

  prepareProps(props){
    const isScrollControlled = props.scrollTop != null 
    const scrollTop = isScrollControlled?
                  props.scrollTop:
                  this.state.scrollTop

    const buffer = (props.extraRows / 2) * props.rowHeight
    
    return assign({}, props, {
      scrollTop,
      buffer,
      isScrollControlled,
      bodyHeight: this.state.bodyHeight,
      maxScrollTop: this.state.maxScrollTop,
    })
  }
}


Body.defaultProps = {
  rowHeight: 40,
  extraRows: 10,
  defaultScrollTop: 0,
  onRowMouseEnter: () => {},
  onRowMouseLeave: () => {},
  onScrollBottom: () => {},
  onColumnGroupScroll: () => {}
}

Body.propTypes = {
  loading: PropTypes.bool,
  onScroll: PropTypes.func,
  onRowMouseEnter: PropTypes.func,
  onRowMouseLeave: PropTypes.func,
  onScrollBottom: PropTypes.func,
  onColumnGroupScroll: PropTypes.func
}

import resizeNotifier from 'react-notify-resize'

export default resizeNotifier(Body)
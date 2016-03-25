import React, { PropTypes } from 'react'
import Component from 'react-class'
import { findDOMNode } from 'react-dom'
import { Item } from 'react-flex'
import getDataRangeToRender from './getDataRangeToRender'
import assign from 'object-assign'
import join from '../utils/join'
import raf from 'raf'
import getIndexBy from '../utils/getIndexBy'
import shallowequal from 'shallowequal'
import flatten from 'lodash.flatten'

import Column from '../Column'
import EmptyText from './EmptyText'
import Scroller from './Scroller'
import ColumnGroup from './ColumnGroup'

/**
 *   Body is a statefull component, it keeps track of:
 *
 * - bodyHeight: it is the height of the this component, it is used
 *               to set the scroller height, and to calculate how many rows
 *               to be rendered, it is also used to determine when we hit scrollBottom
 *               to update we use `react-notify-resize`, to listen to size changes
 * - scrollTop
 * - overRowId: id of the row that has :hover
 * - maxScrollTop: is calculated based on contentHeight 
 *                 (height if all rows would be rendered) + visible area height
 *                 this is updated when data is changed (no of rows changes) or
 *                 bodyHeight changes
 * - isScrolling
 * - isPlaceholderActive: - flag if row placeholder should be rendered
 *                        - it is set after 300ms(by default, controlled with `rowPlaceholderDelay` prop)
 *                          if the `isScrolling` flag is still true  
 */
class Body extends Component {

  constructor(props){
    super(props)

    const columns = this.getNewColumns(props)
    const flatColumns = flatten(columns)

    this.state = {
      columns,
      flatColumns,
      bodyHeight: 0,
      scrollTop: props.defaultScrollTop,
      overRowId: null,
      maxScrollTop: props.defaultScrollTop,
      isScrolling: false,
      isPlaceholderActive: false,
    }
  }
  
  componentDidMount(){
    this.setBodyHeight()
    setTimeout(() => {
      this.setMaxScrollTop()
    }, 0)
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.data === null) {
      this.setState({
        scrollTop: 0
      })
    }

    if (
        nextProps.contentHeight !== this.props.contentHeight
      ) {
      this.setMaxScrollTop(nextProps.contentHeight)
    }

    // we have to determine if any of the folowig has changed
    // - columns
    // - columngrups has changed children or column prop
    const newColumns = this.getNewColumns(nextProps)
    if (shallowequal(newColumns, this.state.columns)) {
      const columns = this.getNewColumns(props)
      const flatColumns = flatten(columns)

      this.setState({
        columns,
        flatColumns
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
        'react-datagrid__body',
        this.state.isScrolling && 'react-datagrid__body--scrolling'
      )

    const isEmpty = (Array.isArray(data) && data.length === 0) || data === null && !loading

    return <Item  
      flex 
      column 
      className={className}
      data={null}
      ref="body"
    >
      {resizeTool}
      {
        isEmpty?
          <EmptyText emptyText={this.props.emptyText} />
          :
          this.renderScroller() 
      }
    </Item>
  }

  renderScroller(){
    if (!this.props.data) {
      return
    }

    return <Scroller 
      ref="scroller"
      contentHeight={this.p.contentHeight}
      headerHeight={this.p.headerHeight}
      onScroll={this.onScroll}
      scrollTop={this.p.scrollTop}
      height={this.state.bodyHeight}
      scrollbarWidth={this.props.scrollbarWidth}
      toggleIsScrolling={this.toggleIsScrolling}
      maxScrollTop={this.p.maxScrollTop}
      hasScroll={this.p.hasScroll}
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
      buffer,
      zebraRows,
      renderRowPlaceholder,
      rowRef,
      hideHeader,
      onHeaderCellClick,
      isMultiSort,
      sortable,
      sortInfo,
    } = preparedProps

    const bodyHeight = this.p.bodyHeight
    let bufferValid = true

    /** 
     * we need to buffer rendering
     * only rerender rows when buffer (half of extra rows height) is scrolled
     * and we need to render anoter set of rows
     * cache scrollTop and fromTo
     * const {from, to} = getDataRangeToRender(bodyHeight, rowHeight, scrollTop, extraRows) 
    **/ 
    if ((Math.abs(this.oldScrollTop - scrollTop - rowHeight) >= buffer) || !this.fromTo) {
      this.fromTo = getDataRangeToRender(bodyHeight, rowHeight, scrollTop, extraRows)
      this.oldScrollTop = scrollTop
      bufferValid = false
    }

    const {from, to} = this.fromTo
    const offsetTop = from * rowHeight
    const innerWrapperOffset = offsetTop - scrollTop

    // only send to columngroup the prop that it needs to know about
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
      innerWrapperOffset,
      zebraRows,
      bufferValid,
      renderRowPlaceholder,
      rowRef,
      hideHeader,
      onHeaderCellClick,
      sortable,
      sortInfo,
      isMultiSort,
      onHeaderHeightChange: this.onHeaderHeightChange,
      isPlaceholderActive: this.state.isPlaceholderActive,
      isScrolling: this.state.isScrolling,
      viewportHeight: bodyHeight,
      globalProps: this.props,
      onRowMouseEnter: this.onRowMouseEnter,
      onRowMouseLeave: this.onRowMouseLeave,
      onRowClick: onRowClick, 
      overRowId: this.state.overRowId,
      onScroll: onColumnGroupScroll,
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
              columnGroupProps,
              child.props, // let columngroup props overwrite those passed
              {columns: columns[index]}
            )
          )
      })
    }
  }

  onHeaderHeightChange(height){
    this.setBodyHeight(height)
    this.setState({
      headerHeight: height
    })
    setTimeout(() => {
      this.setMaxScrollTop()
    }, 0)
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

    if (this.p.onScroll) {
      this.p.onScroll(scrollTop, event)
    }

    this.toggleIsScrolling()

    if (!this.state.isScrolling) {
      // at this ponint scrolling starts
      this.setState({
        isScrolling: true
      })
      
      // if it is still scrolling after `rowPlaceholderDelay`ms (defaults to 300ms)
      // set `isPlaceholderActive` to true, to announce that row placeholder can be
      // rendered
      if (this.props.rowPlaceholder) {
        setTimeout(() => {
          if (this.state.isScrolling) {
            this.setState({
              isPlaceholderActive: true
            })
          }
        }, this.props.rowPlaceholderDelay)
      }
    }
  }

  onResize(){
    this.setBodyHeight()
    setTimeout(() => {
      this.setMaxScrollTop()
    }, 0)
  }

  setBodyHeight(offset){
    const bodyNode = findDOMNode(this.refs.body)
    let bodyHeight
    if (bodyNode) {
      bodyHeight = bodyNode.offsetHeight - (offset || 0)
    } else {
      bodyHeight = 0
    }

    this.setState({
      bodyHeight: bodyHeight,
    })
  }

  setMaxScrollTop(contentHeight){
    this.setState({
      maxScrollTop: (
          (contentHeight || this.props.contentHeight) - this.state.bodyHeight
        )
    })
  }

  /**
   * Sets isScrolling to false if there is no onScroll
   * registered for 150ms
   */
  toggleIsScrolling(){
    if (this.disableIsScrollingTimeoutId) {
      clearTimeout(this.disableIsScrollingTimeoutId)
    }
    this.disableIsScrollingTimeoutId = setTimeout(() => {
      delete this.disableIsScrollingTimeoutId
      let newState = {
          isScrolling: false,
        }

      if (this.props.rowPlaceholder){
        newState.isPlaceholderActive = false
      }

      this.setState(newState)
    }, 150)
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
      scrollTop = index * rowHeight
    } else if (position === 'bottom') {
      scrollTop = (index * rowHeight) - bodyHeight + rowHeight
    } else {
      console.error('ScrollToIndex can have position top or bottom.')
      return false
    }

    this.scrollAt(scrollTop)

    return index
  }

  scrollAt(scrollTop){
    raf(() => {
      this.setState({
        scrollTop
      })     
    })

    // trigger scrollbottom
    if (this.p.contentHeight - (this.p.scrollbarWidth + 5) <= scrollTop + this.p.bodyHeight) {
      this.p.onScrollBottom()
    }

    return scrollTop
  }


  scrollToId(id, config){
    // find index of id
    const index = getIndexBy(this.props.data, this.props.idProperty, id)

    return this.scrollToIndex(index, config)
  }


  // set columns depending 
  // - there are ColumnGrups with jsx
  // - Columgroups have a prop columns
  // - Columgroups have children
  getNewColumns(props){
    props = props || this.props
    const columnGroups = props.children
    let columns

    // we have children (ColumnGroups)
    if (columnGroups) {
      let startIndex = 0
      columns = columnGroups.map((columnGroup, index) => {
        const normalizedColumns = this.normalizeColumns(columnGroup.props, startIndex)
        startIndex += normalizedColumns.length
        return normalizedColumns
      })
    } else {
      columns = this.normalizeColumns({columns: props.columns})
    }

    return columns
  }

  normalizeColumns({children, columns}, startIndex = 0){
    // We want to allow users to use columns configuration as jsx
    // or as an array of config objects
    let normalizedColumns
    if (children) {
      // if we have children, we want to take only valid children
      normalizedColumns = React.Children
        .toArray(children)
        .filter(child => child && child.props && child.props.isColumn)
    } else {
      // used to add default props
      normalizedColumns = columns.map(column => <Column {...column} />)
    }
    
    return normalizedColumns
      .map((c, index) => assign({}, c.props, {index: index + startIndex}))
  }

  prepareProps(props){
    const isScrollControlled = props.scrollTop != null 
    const scrollTop = isScrollControlled?
                  props.scrollTop:
                  this.state.scrollTop

    // buffer is half of extrarows height
    const buffer = (props.extraRows / 2) * props.rowHeight
    const columns = this.state.columns
    const headerHeight = this.state.headerHeight || 0

    const hasScroll = this.state.bodyHeight < props.contentHeight

    return assign({}, props, {
      scrollTop,
      buffer,
      isScrollControlled,
      columns,
      headerHeight,
      hasScroll,
      bodyHeight: this.state.bodyHeight,
      maxScrollTop: this.state.maxScrollTop,
    })
  }

  // exposed methods
  getScrollTop(){
    return this.state.scrollTop
  }

  getBodyHeight(){
    return this.state.bodyHeight
  }

  getAllColumns(){
    return this.state.columns
  }

  getFlattenColumns(){
    return this.state.flatColumns
  }
}


Body.defaultProps = {
  rowHeight: 40,
  extraRows: 4,
  defaultScrollTop: 0,
  onRowMouseEnter: () => {},
  onRowMouseLeave: () => {},
  onScrollBottom: () => {},
  onColumnGroupScroll: () => {},
  zebraRows: true,
  rowPlaceholderDelay: 300
}

Body.propTypes = {
  loading: PropTypes.bool,
  onScroll: PropTypes.func,
  onRowMouseEnter: PropTypes.func,
  onRowMouseLeave: PropTypes.func,
  onScrollBottom: PropTypes.func,
  onColumnGroupScroll: PropTypes.func,
  zebraRows: PropTypes.bool,
}

import resizeNotifier from 'react-notify-resize'

export default resizeNotifier(Body)
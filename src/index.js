import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import { Flex, Item } from 'react-flex'
import assign from 'object-assign'
import join from './utils/join'
import LoadMask from 'react-load-mask'
import hasown from 'hasown'

import Header from './Header'
import Body from './Body'
import ColumnGroup from './Body/ColumnGroup'
import NavigationHelper from './NavigationHelper'

import 'react-load-mask/index.css'

const SCREEN_HEIGHT = global.screen && global.screen.height

class DataGrid extends Component {

  constructor(props){
    super(props)

    const {
      selected
    } = props

    const isLoading = props.dataSource && !!props.dataSource.then

    this.state = {
      loading: isLoading,
      data: false,
      selected: props.defaultSelected,
      activeIndex: props.defaultActiveIndex,
      previousActiveIndex: props.defaultActiveIndex
    }
  }

  componentDidMount(){
    const dataGridNode = findDOMNode(this.refs.dataGrid)
  
    // load data
    this.loadSourceData(this.props.dataSource, this.props)
  }

  componentWillReceiveProps(nextProps, nextState){
    // if data changed
    if (this.p.dataSource !== nextProps.dataSource) {
      this.loadSourceData(nextProps.dataSource, nextProps)
    }
  }

  render(){
    const preparedProps = this.p = this.prepareProps(this.props, this.state)
     
    const {
      dataSource,
      columns,
      hideHeader,
      onRowMouseEnter,
      onRowMouseLeave,
      onScrollBottom,
      loading,
      data,
      isMultiselect,
      selected,
      className,
      hasSelection,
      children,
      activeIndex
    } = preparedProps

    return <Flex 
      {...preparedProps} 
      column 
      flex
      alignItems="stretch" 
      wrap={false}
      className={className}
      ref="dataGrid"
    >
      
      {loading && this.renderLoadMask()}
      { 
        !hideHeader 
        && 
        <Header 
          columns={columns} 
          columnGroups={children}
        />
      }
      <Body
        {...preparedProps}
        ref="body"
        onRowMouseEnter={onRowMouseEnter}
        onRowMouseLeave={onRowMouseLeave}
        onScrollBottom={onScrollBottom}
        selected={selected}
        onRowClick={this.onRowClick}
        onRowFocus={this.onRowFocus}
      />
      <NavigationHelper 
        ref="NavigationHelper"
        onArrowUp={this.onArrowUp}
        onArrowDown={this.onArrowDown}
      />
    </Flex>
  }

  renderLoadMask(){
    return <LoadMask 
      visible={true} 
      className="react-datagrid__load-mask" 
    />
  }

  onRowClick(event, rowProps){
    this.handleSelection(rowProps, event)
  }

  onRowFocus(event, rowProps){
    let newActiveIndex

    // check if the event comes from the row and not one of it's children
    if (event.target === event.currentTarget) {
      newActiveIndex = rowProps.realIndex

      this.refs.NavigationHelper.focus()
    } else {
      newActiveIndex = -1
    }

    this.setState({
      activeIndex: newActiveIndex
    })
  }

  onArrowUp(event, rowProps){
    if (!this.p.isActiveIndexControlled) {
      const newIndex = this.state.activeIndex - 1

      if (newIndex >= 0) {   
        this.changeActiveIndex(newIndex, rowProps) 
      }
    }
  }

  onArrowDown(event, rowProps){
    if (!this.p.isActiveIndexControlled) {
      const newIndex = this.state.activeIndex + 1

      if (newIndex !== this.p.data.length) {
        this.changeActiveIndex(newIndex, rowProps) 
      }
    }
  }

  changeActiveIndex(newIndex){
    const scrollTop = this.getScrollTop()
    const bodyHeight = this.getBodyHeight()
    const rowScrollTop = newIndex * this.props.rowHeight

    // scroll to item if is not visible
    // top 
    if (scrollTop > rowScrollTop) {
      this.scrollToIndex(newIndex)
    }

    // bottom
    if ((scrollTop + bodyHeight) < rowScrollTop + this.props.rowHeight) {
      this.scrollToIndex(newIndex, {position: 'bottom'})
    }

    this.setState({
      activeIndex: newIndex,
    })

    this.props.onActiveIndexChange(newIndex)
  }

  loadSourceData(dataSource, props){

    if (dataSource === null) {
      this.setData(null)
      return
    }

    if (Array.isArray(dataSource)) {
      this.setData(dataSource)
    }

    if (dataSource.then) {
      if (props.onDataSourceResponse) {
        dataSource.then(props.onDataSourceResponse, props.onDataSourceResponse)
      }

      this.setState({
        loading: true
      })

      dataSource.then(data => {
        if (!Array.isArray(data)) {
          throw new Error(`dataSource Promise did not return an array, it returned a ${typeof data}`)
        }

        this.setData(data)
      })
    }
  }

  setData(data){
    const props = this.props
    const {
      selected,
      defaultSelected,
      onSelectionChange
    } = props

    let newDataState = {
      data,
      loading: false
    }

    // make dataMap only if selected is used
    if (this.isSelectionEnabled() && data !== null) {
      newDataState.dataMap = data.reduce((acc, item) => {
        acc[this.getItemId(item)] = item
        return acc
      }, {})
    }

    this.setState(newDataState)
  }

  getItemId(item){
    return item[this.props.idProperty]
  }

  getSelected(){
    return this.isSelectionControlled()?
           this.props.selected :
           this.state.selected  
  }

  isSelectionControlled(){
    return this.props.selected !== undefined
  }

  isSelectionEnabled(){
    const selected = this.props.selected
    const defaultSelected = this.props.defaultSelected

    return selected !== undefined || defaultSelected !== undefined
  }

  isSelectionEmptry(){
    const selected = this.getSelected()
    let selectionEmptry = false

    if (selected === undefined) {
      selectionEmptry = true
    }
  
    if (typeof selected === 'object' && selected !== null) {
      selectionEmptry = Object.keys(selected).length === 0     
    }

    return selectionEmptry
  }

  prepareProps(props, state){
    const loading = props.loading == undefined? 
                    this.state.loading :
                    props.loading 

    const selected = this.getSelected()
    const hasSelection = !this.isSelectionEmptry()
    const contentHeight = props.rowHeight * (state.data? state.data.length : 0) + props.scrollbarWidth
    const isMultiselect = typeof selected === 'object' && selected !== null
    const activeIndex = props.activeIndex !== undefined? props.activeIndex: this.state.activeIndex

    const className = join(props.className, 'react-datagrid')
    const isActiveIndexControlled = this.props.activeIndex !== undefined

    return assign({}, props, {
      loading,
      selected,
      hasSelection,
      contentHeight,
      isMultiselect,
      className,
      data: state.data,
      activeIndex
    })
  }

  // TODO: find a fix to extra nesting
  scrollAt(scrollTop){
    return this.refs.body.component.scrollAt(scrollTop)
  }

  scrollToIndex(...args){
    return this.refs.body.component.scrollToIndex(...args)
  }

  scrollToId(...args){
    return this.refs.body.component.scrollToId(...args)
  }

  getScrollTop(){
    return this.refs.body.component.getScrollTop()
  }

  getBodyHeight(){
    return this.refs.body.component.getBodyHeight()
  }
}

DataGrid.defaultProps = {
  defaultLoading: false,
  hideHeader: false,
  onRowMouseEnter: () => {},
  onRowMouseLeave: () => {},
  onScrollBottom: () => {},
  onActiveIndexChange: () => {},
  rowProps: {},
  defaultSelected: undefined,
  defaultActiveIndex: -1,
  scrollbarWidth: 20
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

  dataSource: (props, propName) => {
    const dataSource = props[propName]

    if (dataSource === undefined) {
      return new Error('dataSource prop is required.')
    }

    if (
        dataSource !== null &&
        !Array.isArray(dataSource) && 
        !(dataSource && dataSource.then)
      ) {
      return new Error(`dataSource must be an array, null or a promise.`)
    }
  },

  onDataSourceResponse: PropTypes.func,
  children: (props, propName) => {
    const children = props[propName]

    React.Children.map(children, (child) => {
      if (
          !child || !child.props || 
          (!child.props.isColumnGroup || !child.props.isColumn)
        ) {
        return new Error('The only children allowed of Datagrid are ColumnGroup and Column')
      }
    })
  },

  onScroll: PropTypes.func,
  hideHeader: PropTypes.bool,
  onRowMouseEnter: PropTypes.func,
  onRowMouseLeave: PropTypes.func,
  onScrollBottom: PropTypes.func,

  selected: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
      PropTypes.object
    ]),
  defaultSelected: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
      PropTypes.object
    ]),
  onSelectionChange: PropTypes.func,

  activeIndex: PropTypes.number,
  defaultActiveIndex: PropTypes.number,
  onActiveIndexChange: PropTypes.func,

  scrollToIndex: PropTypes.func,
  scrollToId: PropTypes.func,
  scrollbarWidth: PropTypes.number
}


import rowSelect from './rowSelect'
DataGrid.prototype = assign(DataGrid.prototype, rowSelect)


export default DataGrid

// Column is a dummy componnet only used for configuration
import Column from './Column'

export {
  ColumnGroup,
  Column
}
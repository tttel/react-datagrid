import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import { Flex, Item } from 'react-flex'
import assign from 'object-assign'
import join from './utils/join'
import LoadMask from 'react-load-mask'
import hasown from 'hasown'
import getIndexBy from './utils/getIndexBy'
import sorty from 'sorty'

import Body from './Body'
import ColumnGroup from './Body/ColumnGroup'
import NavigationHelper from './NavigationHelper'

import 'react-load-mask/index.css'

const SCREEN_HEIGHT = global.screen && global.screen.height

class DataGrid extends Component {
  constructor(props){
    super(props)

    const isLoading = props.dataSource && !!props.dataSource.then

    this.state = {
      loading: isLoading,
      data: false,
      selected: props.defaultSelected,
      activeIndex: props.defaultActiveIndex,
      sortInfo: props.defaultSortInfo
    }
  }

  componentDidMount(){
    const dataGridNode = findDOMNode(this.refs.dataGrid)
  
    // load data
    this.loadSourceData(this.props.dataSource, this.props)
  }

  componentWillReceiveProps(nextProps, nextState){
    
    // data is cached in state
    // needs to be updated if dataSource changes
    if (this.p.dataSource !== nextProps.dataSource) {
      this.loadSourceData(nextProps.dataSource, nextProps)
    }
  }

  render(){
    const preparedProps = this.p = this.prepareProps(this.props, this.state)
     
    const {
      columns,
      hideHeader,
      loading,
      className,
      children,
    } = preparedProps

    return <Flex 
      {...this.props} 
      ref="dataGrid"
      className={className}
      column
      flex
      alignItems="stretch"
       wrap={false}
    >
      {false && this.renderLoadMask()}
      <Body
        {...preparedProps}
        ref="body"
        onRowClick={this.onRowClick}
        onRowFocus={this.onRowFocus}
        onHeaderCellClick={this.onHeaderCellClick}
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

  onHeaderCellClick(event, props){
    const preparedProps = this.p

    // if it is sortable, then do magic
    if (preparedProps.sortable) {
      let newSortInfo

      const column = this.getColumn(props.index)

      if (preparedProps.isMultiSort) {
        this.handleMultipleSort(column)
      } else {
        this.handleSingleSort(column)
      }
    }
  }

  /**
   * Sorting
   *   order of sort change
   * - if none, then 1 (asc)
   * - if 1, then -1 (desc)
   * - if -1, then 0 (none)
   */


  /**
   * On single sort when you click on a sortable column it will begin 
   * to change between it's three states
   * if you click on a new column the sortInfo overwritten with the
   * new sortInfo detemined by the new column
   */
  handleSingleSort(column){
    const newSortInfo = this.getNewSortInfoDescription(column, this.state.sortInfo && this.state.sortInfo.dir)
    
    // this.setState({
    //   sortInfo: newSortInfo
    // })
    this.props.onSortInfoChange(newSortInfo)

    this.setData(null, {sortInfo: newSortInfo})
  }

  /**
   * On multiselect, when you click on one toggle between it's state
   * if direction is 0, we remove i
   * TODO: do multisort
   */
  handleMultipleSort(column){
    const sortInfo = this.p.sortInfo

    if (!sortInfo.length) {
      // is empty
      this.setState({
        sortInfo: this.getNewSortInfoDescription(column)
      })
    } else {
      // determine if it is new
      const sortInfoIndex = getIndexBy(sortInfo, 'index', column.index)
    }
  }

  getNewSortInfoDescription(column, dir){
    let newSortInfo = {}
    let newDir

    if (!dir || dir === 0) {
      newDir = 1
    } else if (dir === 1) {
      newDir = -1
    } else if (dir === -1) {
      // newSortInfo shoud be null in this case
      // this means there is no sort
      // so there is no need to sort with nothing
      return null
    }

    newSortInfo.dir = newDir

    // column cannot be sorted if it has no name and no sort function
    if (!column.name && !column.sort) {
      return
    }

    if (column.name) {
      newSortInfo.name = column.name
    }

    if (column.sort) {
      newSortInfo.fn = column.sort
    }

    if (column.type) {
      newSortInfo.type = type
    }

    newSortInfo.index = column.index

    return newSortInfo
  }

  getColumn(index){
    const columns = this.refs.body.component.getFlattenColumns()

    return columns[index]
  }


  changeActiveIndex(newIndex){
    const scrollTop = this.getScrollTop()
    const bodyHeight = this.getBodyHeight()
    const rowScrollTop = newIndex * this.props.rowHeight

    // scroll to item if is not visible
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

  // handles source data it it is array, it is passed directly to setData
  // if is a promise, sets loading flat to true, when resolves passes data to setData
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

  sortData(sortInfo, data){
    if (sortInfo) {
      return sorty(sortInfo, data)
    }
  }

  /**
   * updates state with data removes loading flag
   * and if selection is enabled creates a hasmap from the data
   * { idProperty: {..}, .. }
   */
  setData(data, config){
    const preparedProps = this.p
    const {
      selected,
      defaultSelected,
      onSelectionChange,
      sortable,
    } = preparedProps

    let newDataState = {
      loading: false
    }
    if (data) {
      newDataState.data = data
      newDataState.originalData = data
    }

    let sortInfo
    // if we pass a config with sortinfo
    if (config) {
      sortInfo = config.sortInfo

      if (sortInfo) {
        newDataState.data = this.sortData(sortInfo, [...this.state.originalData])
      } else {
        newDataState.data = this.state.originalData
      }

      if (sortInfo !== undefined) {
        newDataState.sortInfo = sortInfo
      }
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

  getActiveIndex(){
    return this.p.activeIndex
  }

  isSelectionControlled(){
    return this.props.selected !== undefined
  }

  isSelectionEnabled(){
    const selected = this.props.selected
    const defaultSelected = this.props.defaultSelected

    return selected !== undefined || defaultSelected !== undefined
  }

  /**
   * selected can be an object is case of multiselect
   * or a string or number in case of single select
   */
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

  /**
   * creates an object with props, that can come from
   * this.props, this.state, or computed
   * it is helpful to have a single point of access
   */
  prepareProps(props, state){
    const loading = props.loading == undefined? 
                    this.state.loading :
                    props.loading 

    const className = join(props.className, 'react-datagrid')
    const selected = this.getSelected()
    const hasSelection = !this.isSelectionEmptry()

    /**
     * content height, is the hight of the container that hods all the rows, if the all the rows
     * are rendered, it is used for virtual scroll, based on it we know what to render
     */
    const contentHeight = props.rowHeight * (state.data? state.data.length : 0) + props.scrollbarWidth
    const isMultiselect = typeof selected === 'object' && selected !== null

    // active index is used for rows navigation
    const activeIndex = props.activeIndex !== undefined? props.activeIndex: this.state.activeIndex
    const isActiveIndexControlled = this.props.activeIndex !== undefined

    // sortInfo
    // if is controleld use props, if not sortinfo
    const sortInfo = props.sortInfo? props.sortInfo : this.state.sortInfo
    const isMultiSort = Array.isArray(sortInfo)

    const data = sortInfo && state.data? this.sortData(sortInfo, state.data) : state.data

    return assign({}, props, {
      loading,
      selected,
      hasSelection,
      contentHeight,
      isMultiselect,
      className,
      data,
      activeIndex,
      sortInfo,
      isMultiSort,
    })
  }

  // exposed methods on body component
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
  onSortInfoChange: () => {},
  rowProps: {},
  defaultSelected: undefined,
  defaultActiveIndex: -1,
  scrollbarWidth: 20,
  rowPlaceholder: false,
  defaultSortInfo: null,
  sortable: false,
}

DataGrid.propTypes = {
  idProperty : React.PropTypes.string.isRequired,
  loading: React.PropTypes.bool,
  hideHeader: PropTypes.bool,
  defaultLoading : React.PropTypes.bool,
  

  // row config
  onRowMouseEnter: PropTypes.func,
  onRowMouseLeave: PropTypes.func,

  /**
   * TODO: refactor find a more elengant way of declaring placeholder
   * you should be able to configure placeholder global on dataGrid
   * and also on ColumnGroup
   */
  rowPlaceholder: PropTypes.bool,
  renderRowPlaceholder: PropTypes.func,
  rowPlaceholderDelay: PropTypes.number,

  // scrolling and scroll
  onScroll: PropTypes.func,
  onScrollBottom: PropTypes.func, 
  scrollToIndex: PropTypes.func,
  scrollToId: PropTypes.func,
  scrollbarWidth: PropTypes.number,

  // selection
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


  // sort
  sortable: PropTypes.bool,
  defaultSortInfo: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ]),
  sortInfo: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ]),
  onSortInfoChange: PropTypes.func,

  // navigation
  activeIndex: PropTypes.number,
  defaultActiveIndex: PropTypes.number,  
  onActiveIndexChange: PropTypes.func,


  // columns config
  columns: PropTypes.arrayOf((props, propName) => {
    const column = props[propName]
    if (!column.name && typeof column.render != 'function'){
      return new Error(`column ${propName} should have a "name" prop or a "render" function!`)
    }
  }),
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

  // data
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
}


import rowSelect from './rowSelect'
DataGrid.prototype = assign(DataGrid.prototype, rowSelect)

export default DataGrid

import Column from './Column'

// you can configurate the grid using an array of configuration objects
// or declaratively (jsx) using ColumnGroup and Column. 
export {
  ColumnGroup,
  Column // Column is a dummy componnet only used for configuration
}
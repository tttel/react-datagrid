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
      selected: props.defaultSelected
    }
  }

  componentDidMount(){
    const dataGridNode = findDOMNode(this.refs.dataGrid)
  
    // load data
    this.loadSourceData(this.props.dataSource, this.props)
  }

  componentWillReceiveProps(nextProps, nextState){

    // if data changed
    if (this.p.data !== nextProps.data) {
      this.loadSourceData(this.props.dataSource, this.props)
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
      contentHeight
    } = preparedProps

    return <Flex 
      {...preparedProps} 
      column 
      flex
      alignItems="stretch" 
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
        isMultiselect={isMultiselect}
        hasSelection={hasSelection}
        columns={columns}
        data={data}
        loading={loading}
        contentHeight={contentHeight}
        onRowMouseEnter={onRowMouseEnter}
        onRowMouseLeave={onRowMouseLeave}
        onScrollBottom={onScrollBottom}
        selected={selected}
        onRowClick={this.onRowClick}
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


  loadSourceData(dataSource, props){
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
    if (this.isSelectionEnabled()) {
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

    return (selected !== undefined) || defaultSelected !== undefined
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
    const contentHeight = props.rowHeight * (state.data? state.data.length : 0)
    const isMultiselect = typeof selected === 'object' && selected !== null

    const className = join(props.className, 'react-datagrid')

    return assign({}, props, {
      loading,
      selected,
      hasSelection,
      contentHeight,
      isMultiselect,
      className,
      data: state.data,
    })
  }
}

DataGrid.defaultProps = {
  defaultLoading: true,
  hideHeader: false,
  onRowMouseEnter: () => {},
  onRowMouseLeave: () => {},
  onScrollBottom: () => {},
  rowProps: {},
  defaultSelected: undefined
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

    if (!dataSource) {
      return new Error('dataSource prop is required.')
    }

    if (!(dataSource.then || Array.isArray(dataSource))) {
      return new Error(`dataSource must be an array or a promise.`)
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
  onSelectionChange: PropTypes.func
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
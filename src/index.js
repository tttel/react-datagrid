import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import { Flex, Item } from 'react-flex'
import assign from 'object-assign'
import join from './utils/join'
import LoadMask from 'react-load-mask'

import Header from './Header'
import Body from './Body'
import ColumnGroup from './Body/ColumnGroup'

import 'react-load-mask/index.css'

const SCREEN_HEIGHT = global.screen && global.screen.height


class DataGrid extends Component {

  constructor(props){
    super(props)

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

  componentWillReceiveProps(nextProps){
    // if (nextProps.dataSource !== this.props.dataSource) {
    //   this.loadSourceData(nextProps.dataSource, nextProps)
    // }
  }

  render(){
    const props = this.props
    const {
      dataSource,
      columns,
      hideHeader,
      onRowHover,
      onRowBlur,
      onScrollBottom,
      selected: coltrolledSelection
    } = props

    const className = join(props.className, 'react-datagrid')
    const loading = props.loading == undefined? 
                    this.state.loading :
                    props.loading 


    const { 
      data
    } = this.state

    const selected = coltrolledSelection || coltrolledSelection === 0?
                     coltrolledSelection :
                     this.state.selected  

    const isMultiselect = typeof selected === 'object'
    const hasSelection = selected !== undefined
  
    return <Flex 
      {...props} 
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
          columnGroups={props.children}
        />
      }
      <Body
        {...props}
        isMultiselect={isMultiselect}
        columns={columns}
        data={data}
        loading={loading}
        contentHeight={this.getContentHeight()}
        onRowHover={onRowHover}
        onRowBlur={onRowBlur}
        onScrollBottom={onScrollBottom}
        selected={selected}
      />
    </Flex>
  }

  getContentHeight(){
    const {rowHeight} = this.props
    const {data} = this.state

    if (!data) {
      return 0
    }

    const contentHeight = rowHeight * data.length

    return contentHeight
  }

  renderLoadMask(){
    return <LoadMask 
      visible={true} 
      className="react-datagrid__load-mask" 
    />
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
    if (
      (!!selected !== undefined) ||
      !!defaultSelected !== undefined ||
      !!onSelectionChange
    ) {
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
}

DataGrid.defaultProps = {
  defaultLoading: true,
  hideHeader: false,
  onRowHover: () => {},
  onRowBlur: () => {},
  onScrollBottom: () => {},
  rowProps: {},
  defaultSelected: {}
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

export default DataGrid

// Column is a dummy componnet only used for configuration
import Column from './Column'

export {
  ColumnGroup,
  Column
}
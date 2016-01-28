import React, { PropTypes } from 'react'
import Component from 'react-class'
import { Flex, Item } from 'react-flex'
import assign from 'object-assign'
import join from './utils/join'
import LoadMask from 'react-load-mask'

import Header from './Header'
import Body from './Body'

import 'react-load-mask/index.css'


export default class DataGrid extends Component {

  constructor(props){
    super(props)

    this.state = {
      defaultLoading: true,
      data: false
    }
  }

  componentDidMount(){
    this.loadSourceData(this.props.dataSource, this.props)
  }

  componentWillReceiveProps(nextProps){
    // if (nextProps.dataSource !== this.props.dataSource) {
    //   this.loadSourceData(nextProps.dataSource, nextProps)
    // }
  }

  render(){
    const props = this.props
    const columns = props.columns
    const dataSource = props.dataSource
    const className = join(props.className, 'react-datagrid')
    const loading = props.loading == undefined? 
                    this.state.defaultLoading :
                    props.loading 

    return <Flex column flex alignItems="stretch" {...props} className={className}>
      {loading && this.renderLoadMask()}

      <Header dataSource={dataSource} columns={columns} />
      <Body 
        {...props}
        data={this.state.data}
        loading={loading}
      />
    </Flex>
  }

  renderLoadMask(){
    return <LoadMask 
      visible={true} 
      className="react-datagrid__load-mask" 
    />
  }

  loadSourceData(dataSource, props){
    if (Array.isArray(dataSource)) {
      this.setState({
        data: dataSource,
        defaultLoading: false
      })
    }

    if (dataSource.then) {
      if (props.onDataSourceResponse) {
        dataSource.then(props.onDataSourceResponse, props.onDataSourceResponse)
      }

      this.setState({
        defaultLoading: true
      })

      dataSource.then(data => {
       
        this.setState({
          data,
          defaultLoading: false
        })

      }).catch((err) => {
        console.error(err) 
      })
    }
  }

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
  }
}

DataGrid.defaultProps = {
}

DataGrid.propTypes = {
  onDataSourceResponse: PropTypes.func
}

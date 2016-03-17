import React from 'react'
import { render } from 'react-dom'
import Component from 'react-class'

import { Flex } from 'react-flex'
import DataGrid, { ColumnGroup } from './src'
import './index.scss'

import gen, { gen2 } from './generate'
import Perf from 'react-addons-perf'


const data = gen2(1000)
const columns = [
  {
    name: 'name'
  }, {
    name: 'age'
  }, {
    name: 'gender'
  }, {
    name: 'location'
  }, {
    name: 'status'
  } , {
    title: 'Actions',
    render(value, data, props) {
      if (props.headerCell){
        value = 'test'
        return
      }

      props.children = <div>
        <button>add</button>
        <button>remove</button>
      </div>
    }
  }
]


class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      height: 500,
      sortInfo: {dir: 1, name: "firstName", index: 2}
    }
  }

  render(){
    return <Flex 
      column 
      alignItems="stretch" 
      className="app"
      wrap={false}
      style={{
        height: this.state.height
      }}
    >
      <h1>  
        React DataGrid by ZippyUi
      </h1>

      <div>
        <button 
          style={{
            marginBottom: 10
          }}
          onClick={() => this.setState({
            height: this.state.height + 10
          })}
        >
          Add Height
        </button>
        <button 
          style={{
            marginBottom: 10
          }}
          onClick={() => this.setState({
            height: this.state.height - 10
          })}
        >
          Remove Height
        </button>
      </div>

      <DataGrid
        idProperty={'id'}
        dataSource={data}
        columns={columns}
        sortable
        onSortInfoChange={(sortInfo) => this.setState({sortInfo})}
        sortInfo={this.state.sortInfo}
      />
    </Flex>
  }
}


render(<App />, document.getElementById('content'))
import React from 'react'
import { render } from 'react-dom'
import Component from 'react-class'

import { Flex } from 'react-flex'
import DataGrid, { ColumnGroup } from './src'
import './index.scss'

import gen from './generate'

const data = new Promise((rez, rej) => {
  setTimeout(() => {
    rez(gen(10000))
    // rez('hello world')
  }, 1000)
})


const columns = [
  {
    name: 'firstName',
    textAlign: 'center'
  }, {
    name: 'lastName', 
    width: 150,
    textAlign: 'center'
  }, {
    name: 'email',
    textAlign: 'right'
  }, {
    name: 'city',
    flex: 3,
    textAlign: 'right'
  }
]

const columns2 = [
  {
    name: 'firstName',
    textAlign: 'center'
  }, {
    name: 'lastName'
  }, {
    name: 'email',
    width: 400
  }, {
    name: 'email',
    width: 400
  }, {
    name: 'email',
    width: 400
  }, {
    name: 'email',
    width: 400
  }
]

class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      height: 500
    }
  }
  render(){
    return <Flex 
      column 
      alignItems="stretch" 
      className="app"
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
      </div>

      <DataGrid
        className="grid"
        columns={columns}
        dataSource={data}
        idProperty="id"
        rowHeight={40}
        defaultSelected={{1:1, 2:2, 3:3}}
        onSelectionChange={selected => console.log(selected)}
      >
        <ColumnGroup fixed columns={columns} />
        <ColumnGroup className="myColumnGroup" columns={columns2} />
      </DataGrid>
    </Flex>
  }
}


render(<App />, document.getElementById('content'))
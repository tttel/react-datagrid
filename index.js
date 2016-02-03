import React from 'react'
import { render } from 'react-dom'
import Component from 'react-class'

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
  render(){
    return <div className="app">
      <h1>React DataGrid by ZippyUi</h1>
      <DataGrid
        className="grid"
        columns={columns}
        dataSource={data}
        idProperty="id"
        rowHeight={40}
      >
        <ColumnGroup fixed columns={columns} />
        <ColumnGroup className="myColumnGroup" columns={columns2} />
      </DataGrid>
    </div>
  }
}

render(<App />, document.getElementById('content'))

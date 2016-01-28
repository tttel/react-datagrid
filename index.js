import React from 'react'
import { render } from 'react-dom'
import Component from 'react-class'

import DataGrid from './src'
import './index.scss'

import gen from './generate'

const data = new Promise((rez, rej) => {
  setTimeout(() => {
    rez(gen(300))
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

class App extends Component {
  render(){
    return <DataGrid 
      className="grid"
      dataSource={data}
      columns={columns}
      idProperty="id"
    />
  }
}

render(<App />, document.getElementById('content'))


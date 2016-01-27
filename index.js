import React from 'react'
import { render } from 'react-dom'
import Component from 'react-class'

import DataGrid from './src'
import './index.scss'

import gen from './generate'

const data = gen(10)


const columns = [
  {
    name: 'firstName'
  }, {
    name: 'lastName', xrender: function(){}, width: 150
  }, {
    name: 'city',
    title: 'Hello World',
    render: (props, data) => {
      return <h2>{data[props.name]}</h2>
    }
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


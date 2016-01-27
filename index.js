import React from 'react'
import { render } from 'react-dom'
import Component from 'react-class'

import gen from './generate'

class App extends Component {
  onChange(v){
    value = v
    this.setState({})
  }
  render(){
    return <div>
      <h1>Hello world</h1>
    </div>
  }
}

render(<App />, document.getElementById('content'))


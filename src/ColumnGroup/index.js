import React, { PropTypes } from 'react'
import Component from 'react-class'




export default class CoumnGroup extends Component {


  render(){
    const props = this.props
    const {
      data, 
      offsetTop,
      from,
      to, 
      columns
    } = props

    const style = {
      transform: `translateY(${offsetTop}px)`
    }

    const rows = data.slice(from, to).map((row, index) => {
      const realIndex = index + from

      return <div  
        style={{height: 40}}
        key={`react-datagrid__row-${realIndex}`}
      >
        {row.firstName}{realIndex}
      </div>
    })


    return <div style={style}> 
      {rows}
    </div>
  }

  renderRows(){

  }
}
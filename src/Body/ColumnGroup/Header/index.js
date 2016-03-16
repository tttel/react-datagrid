import React, { PropTypes } from 'react'
import Component from 'react-class'
import { Flex } from 'react-flex'

import assign from 'object-assign'
import join from '../../../utils/join'
import humanize from '../../../utils/humanize'
import Cell from '../Cell'

export default class Header extends Component {
  render(){
    const props = this.props
    const {
      width,
      columns,
      minWidth
    } = props
    const className = join('react-datagrid__colum-group__header', props.className)
    const style = assign({}, props.style)



    if (width) {
      style.width = Math.max(width, minWidth)
    }

    if (minWidth){
      style.minWidth = minWidth
    }

    return <Flex
        {...props} 
        wrap={false} 
        className={className} 
        data={null}
        style={style}
      >
      {this.renderColumns(columns)}
    </Flex>
  }

  renderColumns(columns){
    return columns.map((column, index) => {
      const {
        name,
        title,
      } = column
      
      let value
      
      if (title) {
        value = title
      }

      if (name){
        value = humanize(name)
      }

      return <Cell 
        {...column} 
        key={index} 
        headerCell 
        value={value}
        onClick={this.props.onHeaderCellClick} 
      />
    })
  }
}

Header.propTypes = {
  onHeaderCellClick: PropTypes.func
}
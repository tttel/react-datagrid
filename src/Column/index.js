import React, { PropTypes } from 'react'
import Component from 'react-class'


/**
 *  This is a dummy component
 *  it's purpose it for configuration of columns
 */
export default class Column extends Component {
  render(){
    return <div {...this.props} />
  }
} 

Column.defaultProps = {
  isColumn: true,
  defaultWidth: 40
}
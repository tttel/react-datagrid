import React, { PropTypes } from 'react'
import Component from 'react-class'


export default class EmptyText extends Component {
  render(){
    const props = this.props
    const {emptyText} = props

    return <div className="react-datagrid__emptry-text">{props.emptyText}</div>
  }
}

EmptyText.defaultProps = {
  emptyText: 'Your data source is empty'
}

EmptyText.propTypes = {
  emptyText: PropTypes.node
}
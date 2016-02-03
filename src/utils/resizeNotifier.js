class ResizeNotifier extends React.Component {
  render() {
    const props = this.props
    const Component = this.props.factory

    const resizeTool = <div 
      key="resizeNotifier" 
      className="resizeParent"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
        display: 'block',
        pointerEvents: 'none'
      }}
        onScroll={() => {
          console.log('resizeeeeeeeeeeeeeeeeeeeeeeeee')
        }}
    >
        <div 
          className="resizeTool" 
          style={{
            position: 'absolute',
            top: -10,
            left: -10,
            right: -10,
            bottom: -10
          }}
        />
      </div>
    

    return <Component {...props} factory={null} resizeTool={resizeTool} />
  }
}


const resizeNotifier = Component => class extends React.Component {
  render() {
    return <ResizeNotifier factory={Component} {...this.props} />
  }
}
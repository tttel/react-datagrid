'use strict';

import assign from 'object-assign';
import React, { Component } from 'react';
import ReactDOM from 'react-dom/server';

var env = require('./env');

function toQuery(str, query){
  return str + '?' + query;
}

var IndexPage = class extends Component {

  toQuery(str){
    return str + '?' + this.props.query;
  }

  prefix(str){
    return (this.props.documentRoot || './') + str;
  }

  render(){
    var props = this.props;


    var pageName = props.pageName || 'index';
    var cssFile = this.prefix(this.toQuery(pageName + '.css'));
    var jsFile  = this.prefix(this.toQuery(pageName + '.js'));
    var reactFile = this.prefix('react.min.js');
    var reactDOMFile = this.prefix('react-dom.min.js');

    return <html>
      <head>
        <title>{props.title}</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
        <meta name="HandheldFriendly" content="True"/>
        <meta name="MobileOptimized" content="320"/>
        <meta http-equiv="cleartype" content="on"/>

        <link rel="stylesheet" type="text/css" href={cssFile} />
        <script type="text/javascript" src={reactFile}></script>
        <script type="text/javascript" src={reactDOMFile}></script>
      </head>
    <body>

    <div id="content">
    </div>

    <script type="text/javascript" src={jsFile}></script>
    </body>
    </html>;
  }
};


IndexPage.defaultProps = assign({
  query: Date.now(),
  documentRoot: env.PUBLIC_PATH,
  title: 'React Data Grid'
});

IndexPage.getDoctype = function() {
  return '<!DOCTYPE html>';
};

IndexPage.renderToString = function(props) {
  return IndexPage.getDoctype() +
    React.renderToString(<IndexPage {...props} />);
};

IndexPage.renderToStaticMarkup = function(props) {
  return IndexPage.getDoctype() +
    ReactDOM.renderToStaticMarkup(<IndexPage {...props} />);
};

module.exports = IndexPage;

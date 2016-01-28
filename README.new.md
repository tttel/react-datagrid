# react-datagrid

## Props

### Basic
* `dataSource`: Array|Promise - an array of objects to render in the grid. 
* `onDataSourceResponse` - Called when `dataSource` is a promisse
* `idProperty`: String *(required)* - the name of the property where the id is found for each object in the data array
* `emptyText`: String|JSX - text that apears when dataSource provides an empty dataset
* `columns`: Array - an array of columns that are going to be rendered in the grid.
    ```jsx
    var columns = [
      { name: 'index', render: function(v){return 'Index ' + v} }
    ]
    ```
    Each column should have a `name` property, and optionally a `title` property. 
    The `name` property can be omitted if a render function is specified.
    If no `title` property is specified, a humanized version of the column `name` will be used.

   * `name`: String.
   * `title`: String/ReactElement - a title to show in the header. If not specified, a humanized version of `name` will be used. Can be a string or anything that React can render, so you can customize it as you please.
   * `width`: Int|String - specify the width of the column.
   * `style`: Object - if you want cells in this column to be have a custom style.
   * `textAlign`: String - one of 'left', 'right', 'center'.
   * `render(value, data, cellProps)`: Function - if you want custom rendering, specify this property.
     * `value`: String - the default value to be rendered (equals to data[column.name]).
     * `data` : Object - the corresponding data object for the current row.
     * `cellProps`: Object - an object with props for the current cell - has the following properties:
       *  `value`: String - the default value to be rendered (equals to data[column.name]).
       *  `className`: String - a className for the cell.
       *  `children`: String, JSX - defaults to `value`, reprezents content of the cell.
       *  `style`: Object - style for the cell.

## Rows
* `renderRow(rowProps): Function`
  * `rowProps` : Object - an object with props for the current row - has the following properties:
    * `className`: String - a className for the cell.
    * `children`: JSX - row cells.
    * `style` : object - style for the row.
* `rowStyle(data, props)`: Object/Function - you can specify either a style object to be applied to all rows, or a function. The function is called with (data, props) (so you have access to props.index for example) and is expected to return a style object.



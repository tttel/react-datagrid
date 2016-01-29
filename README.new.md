# react-datagrid

## Props

### General Props

|Prop|Type|Default|Description
--- | --- | --- | ---
`dataSource` | Array\|Promise| - | an array of data objects or a promise that when resolved returns an array of data objects.
 `idProperty`| String | - |*(required)* the name of the property where the id is found for each object in the data array
`onDataSourceResponse`| Function(data) | - | it is called if `dataSource` is a primise <br>`dataSource.then(onDataSourceResponse, onDataSourceResponse)`
`emptyText`| String\|JSX | - | text that apears when dataSource provides an empty dataset
`columns`| Array | - | an array of columns that are going to be rendered in the grid. Read more on how to confirue [columns](#columns).
    

### Rows
* `renderRow(rowProps): Function`
  * `rowProps` : Object - an object with props for the current row - has the following properties:
     * `className`: String - a className for the cell.
     * `children`: JSX - row cells.
     * `style` : object - style for the row.
* `rowStyle(data, rowProps)`: Object/Function -    You can specify either a style object to be applied to all rows, or a function.    The function is called with (data, props) (so you have access to props.index for example) and is expected to return a style object.


### Columns

```
var columns = [
  {name: 'index', render: function(v){return 'Index ' + v}},
  {name: 'firstName'},
  {name: 'lastName'}
]

var dataSource = [
  {id: 1, name: 'Foo', lastName: 'Bar'},
  {id: 2, name: 'Bar', lastName: 'Foo'}    
  ...
]
```
Each column should have a `name` property, and optionally a `title` property. 
The `name` property can be omitted if a render function is specified.
If no **`title`** property is specified, a humanized version of the column **`name`** will be used.


|Prop|Type|Default|Description
--- | --- | --- | ---
`name`| String | - | specifies what piece of data to be rendered in that column
`value`| String | `name`| the default value to be rendered (equals to data[column.name]).
`title`| String\|ReactElement| `name` | a title to show in the header. If not specified, a humanized version of `name` will be used. Can be a string or anything that React can render, so you can customize it as you please.
`width`| Int\|String| - |specify the width of the column.
`style`| Object | - |if you want cells in this column to be have a custom style.
 `textAlign`| String |-| one of 'left', 'right', 'center'. It will add one of the folowing classes: <br> `react-datagrid__cell--align-right`, <br> `react-datagrid__cell--align-left`, <br>`react-datagrid__cell--align-center`
 `render` | Function| - |if you want custom rendering, specify this property. Parameters taken: `render(value, data, cellProps)`. More about the paramenters you can read [below](#columnrender)
     
#### Column.render
Render takes three parameters: `value`, `data` and `cellProps`.

* `data`: Object - The corresponding data object for the current row.
* `cellProps`: Object - An object with props for the current cell - has the following properties:
  *  `value`: String - the default value to be rendered (equals to data[column.name]).
  *  `className`: String - a className for the cell.
  *  `children`: String, JSX - defaults to `value`, reprezents content of the cell.
  *  `style`: Object - style for the cell.

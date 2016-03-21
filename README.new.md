# react-datagrid

> A carefully crafted DataGrid for React

# Getting started

```js
  npm install --save react-datagrid
```


# Contributing

```
$ git clone https://github.com/zippyui/react-datagrid
$ cd react-datagrid
$ npm install
$ npm run dev
```


# Features

- renders huge amounts of data
- resizable columns
- reorderable columns
- remote data support
- custom row/cell/column rendering
- multiple/single selection
- sorting
- filtering
- pagination
- hideable columns
- works on mobile


# Documentation

## General 
Some statement about datagrid


#### Props
|Prop|Type|Default|Description
--- | --- | --- | ---
`idProperty`| String | - |*(required)* the name of the property where the id is found for each object in the data array
`dataSource` | Array\|Promise| - | an array of data objects or a promise that when resolved returns an array of data objects.
`onDataSourceResponse(data)`| Function | - | it is called if `dataSource` is a primise <br>`dataSource.then(onDataSourceResponse, onDataSourceResponse)`
`columns`| Array | - | an array of columns that are going to be rendered in the grid. Read more on how to configure [columns](#columns).
`emptyText`| String\|JSX | - | text that apears when dataSource provides an empty dataset
`hideHeader` | Booleon | false | Set header visibility.

## Selection
You can select stuff.

#### Props
|Prop|Type|Default|Description
--- | --- | --- | ---
`selected` | Object\|String\|Number| - | control what items are selected, for multiselect specify an object with it's keys the id's to be selected, an emptry object for no rows selected. For single selection specify a string/number representing the id of the row to be selected.
`defaultSelected` | Object\|String\|Number| - | uncontrolled version of `selected`, for multiselect specify an object with it's keys the id's to be selected, an emptry object for no rows selected. For single selection specify a string/number representing the id of the row to be selected.
`onSelectionChange(selected)` | Function | - | event handler called when selection changes, `selected` parameter  for multiselect is an object of the shape `{ id-1: { rowData }, id-2 .. }` and for single select the id, ex `id-`. ID in this case is `rowData[idProperty]`


## Navigation
You can navigate using arrows.

#### Props
|Prop|Type|Default|Description
--- | --- | --- | ---
`activeIndex` | Number | - | index of active row, used for rows navigation
`defaultActiveIndex` | Number | - | uncontrolled version of `activeIndex`
`onActiveIndexChange(index)` | Function | - | called when activeIndex changes
`defaultScrollTop` | Number | - | se default vertical scrollTop position

#### Methods
* `getActiveIndex()`


## Scroll
Statement about scrolling.

#### Props
|Prop|Type|Default|Description
--- | --- | --- | ---
`onScrollBottom` | Function | - | event handler for when the datagrid is scrolled at the bottom, it can be used as a trigger for infinite loader
`scrollTop` | Number | - | controls vertical scrollTop position, controlled version of `defaultScrollTop`
`scrollbarWidth` | Number | 20 | specify the size rezerved for the vertical and horizontal scrollbars

#### Methods
* `scrollAt(scrollTop)` - you can set scrollTop by calling this method
* `scrollToIndex(index, config)`- method to scroll to a specific row by `index`, config is used to specify where where the row should be scrolled into view, at the top or the bottom of the scrolling area.
* `scrollToId(id, config)`| method to scroll to a specific row by `id`, the id is the one specified in `idProperty`. Config is used to specify where where the row should be scrolled into view, at the top or the bottom of the scrolling area.

## Sort
Datagrid uses [`sorty`](https://www.npmjs.com/package/sorty) utility for sorting.
For a column to be sortable must fit one of the folowing requirements:
- must have a `name` prop, so we can use data asociated with it
- specify a `sort` on column, see [here](sorting-function)

#### Props
|Prop|Type|Default|Description
--- | --- | --- | ---
sortable | Bool | false | make all columns sortable, individual column can be overwritten using columns config
defaultSortInfo | Object/Array | - | set the initial sort configuration, it can be an object configuration or an array of object configurations, it is the uncontrolled version of sortInfo
sortInfo | Object/Array | - | controll sort configuration, it can be an object configuration or an array of object configurations
onSortInfoChange(newSortInfo) | Function | - | called each time sortInfo changes

#### Example

```js
var sortInfo =  [
  {name: 'country', dir: 'asc'},
  {name: 'name', dir: 'asc'}
]

<DataGrid
  sortInfo={sortInfo}
/>
```


## Row 
Rows

#### Props
|Prop|Type|Default|Description
--- | --- | --- | ---
`rowStyle` | Object/Function | - | You can specify either a style object to be applied to all rows, or a function.    The function is called with (data, props) (so you have access to props.index for example) and is expected to return a style object.
`rowPlaceholder` | Bool | false | if true while scrolling and buffered items are consumed (we scroll at the end the extra rows rendered) a placeholder is rendered it's columns. It can be set on datagrid or directly on ColumnGroup.
`renderRowPlaceholder` | Function | - | custom render function for placeholder, to take efect `rowPlaceholder` must be `true`
`rowPlaceholderDelay` | Number | 300 | time in ms, that has to pass from you start scrolling to activate rowPlaceholder
`rowRef` | String | realIndex | controls what index to be used as a ref for row, `realIndex` uses index of the piece of data that is used for the row from array of data, `renderIndex` uses the nth position of rendered rows (we render only the visible rows + extraRows). The difference is in the way react treats rows, in `renderIndex` the rows will not change, their contents will change on each render. In `realIndex` when rows are moved out of view, some will get unmounted and some mounted, and the rows will move from top to bottom or from bottom to top. If you use ColumnGropups you can overwrite the global seting directly on the ColumnGroup.
`onRowMouseLeave(event, rowProps)` | Function | - | row event handler onMouseEnter, event parameter is react event 
`onRowMouseEnter(event, rowProps)` | Function | - | row event handler onMouseEnter, event parameter is react event 
`zebraRows` | Bool | true | controll `react-datagrid__row---odd` and `eact-datagrid__row---even` classNames on rows.
`rowProps` | Object | - | Object of props to be merged to row component
`renderRow(rowProps)| Function | - | you can use this function to customize render logic of rows, see more [here](#render-row) 

#### Render
* `renderRow(rowProps): Function`
  * `rowProps` : Object - an object with props for the current row - has the following properties:
     * `className`: String - a className for the cell.
     * `children`: JSX - row cells.
     * `style` : object - style for the row.

#### rowProps
* `rowProps.overClassName` - a css class name to be applied when mouse is over the row
* `rowProps.selectedClassName`
* `rowProps.className`

## Columns

Columns can be defined as:
- an array of objects describing each column.
- using `<Column />` component, as children of `DataGrid` or `ColumnGroup` 

#### Props
|Prop|Type|Default|Description
--- | --- | --- | ---
`name`| String | - | specifies what piece of data to be rendered in that column
`value`| String | `name`| the default value to be rendered (equals to data[column.name]).
`title`| String\|ReactElement\|Function| `name` | a title to show in the header. If not specified, a humanized version of `name` will be used. Can be a string or anything that React can render, so you can customize it as you please.
`width`| Int\|String| - |specify the width of the column.
`onScroll(scrollTop, event)`| Function | - | On scroll event handler.
`style`| Object | - |if you want cells in this column to be have a custom style.
 `textAlign`| String |-| one of 'left', 'right', 'center'. It will add one of the folowing classes: <br> `react-datagrid__cell--align-right`, <br> `react-datagrid__cell--align-left`, <br>`react-datagrid__cell--align-center`
 `render` | Function| - |if you want custom rendering, specify this property. Parameters taken: `render(value, data, cellProps)`. For more information read [Column.render](#columnrender) section.
 `sortable` | Bool | - | controll if a column is sortable or not, see [more](#sort-props)


### Column.render
Render takes three parameters: `value`, `data` and `cellProps`.

* `data`: Object - The corresponding data object for the current row.
* `cellProps`: Object - An object with props for the current cell - has the following properties:
  *  `value`: String - the default value to be rendered (equals to data[column.name]).
  *  `className`: String - a className for the cell.
  *  `children`: String, JSX - defaults to `value`, reprezents content of the cell.
  *  `style`: Object - style for the cell.
  *  `headerCell`: Bool - if it is  acolumn (cell in header)

**Example:**

```jsx
var data = [...]
var columns = [
  {
    name: 'firstName',
    className: 'first-column',
    textAlign: 'center',
    style: { fontWeight: 'bold' }
  },
  {
    name: 'lastName',
    render: function(value){
      return <span>
        <b>Last name:</b> value
      </span>
    }
]
<DataGrid idProperty="id" dataSource={data} columns={columns} />
```

#### Sorting Function
```js
var columns = [
  {
    name: 'index', 
    render: function(v){return 'Index ' + v},
    sort: function(rowProps, nextRowProps){
      return rowProps - nextRowProps
    }
  },
  {name: 'firstName'},
  {name: 'lastName'}
]
```


#### Example

```js
var dataSource = [
  {id: 1, name: 'Foo', lastName: 'Bar'},
  {id: 2, name: 'Bar', lastName: 'Foo'}    
  ...
]


var columns = [
  {name: 'index', render: function(v){return 'Index ' + v}},
  {name: 'firstName'},
  {name: 'lastName'}
]

<DataGrid columns={columns} rowHeight={40} />

or

<DataGrid rowHeight={40}>
  <Column name="index" render={(v) => 'Index' + v} />
  <Column name="firstName" render={(v) => 'Index' + v} />
  <Column name="lastName" render={(v) => 'Index' + v} />
<DataGrid />

```
Each column should have a `name` property, and optionally a `title` property. 
The `name` property can be omitted if a render function is specified.
If no **`title`** property is specified, a humanized version of the column **`name`** will be used.

    

## Column Group Props

Prop|Type|Default|Description
--- | --- | --- | ---
`width`| String\|Number| - | a fixed with that Column grup should be
`fixed`| Booleon| false | if the ColumnGroup show be a fixed size, given by the acumulative width of it's columns, so it doesn't have a horizontal scrollbar.
`columns`| JSON | - | Read more on how to configure [columns](#columns).
`children`| JSX | - | Used to configure it's columns, use `Column` componnet. Read more on how to configure [columns](#columns).
`isPlaceholderActive` | Bool | false | controll if `rowPlaceholder` shold be rendered


**Example:**

```js
var dataSource = [
  {id: 1, name: 'Foo', lastName: 'Bar'},
  {id: 2, name: 'Bar', lastName: 'Foo'}    
  ...
]


var columns = [
  {name: 'index', render: function(v){return 'Index ' + v}},
  {name: 'firstName'},
  {name: 'lastName'}
]
var columns2 = [
  {name: 'index', render: function(v){return 'Index ' + v}},
  {name: 'firstName'},
]

<DataGrid columns={columns} rowHeight={40}>
  <ColumnGroup fixed columns={columns1}
  <ColumnGroup columns={columns2}
<DataGrid />

or

<DataGrid rowHeight={40}>
  <ColumnGroup fixed>
    <Column name="firstName" render={(v) => 'Index' + v} />
    <Column name="lastName" render={(v) => 'Index' + v} />
  </ColumnGroup>
  <ColumnGroup>
    <Column name="email" render={(v) => 'Index' + v} />
    <Column name="id" render={(v) => 'Index' + v} />
  </ColumnGroup>
<DataGrid />

```

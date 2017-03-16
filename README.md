Select2-to-Tree
=======

Select2-to-Tree is an extension to Select2, a popular select boxes library: https://github.com/select2/select2.

Though Select2 is very versatile, it only supports a single level of nesting. See https://select2.github.io/options.html#how-many-levels-of-nesting-are-allowed:
<blockquote>
Because Select2 falls back to an &lt;optgroup&gt; when creating nested options, only a single level of nesting is supported. Any additional levels of nesting is not guarenteed to be displayed properly across all browsers and devices.</blockquote>

Select2-to-Tree extends Select2 to support arbitrary level of nesting.

Browser compatibility
---------------------
* IE 8+
* Chrome 8+
* Firefox 10+
* Safari 3+
* Opera 10.6+

Usage
-----
Firstly, you need to know the usage of Select2: https://github.com/select2/select2

Then, in your HTML document, you add the Select2 library (the `*.js` file & `*.css` file, currently the version should be 4.0+), and the Select2-to-Tree library (the `*.js` file & `*.css` file in the "`src`" folder). jQuery is also needed.

There are 2 ways to use Select2-to-Tree:

<h3>1. Use data, and empty &lt;select&gt; element(see "Example 1" in "example/example.html"):</h3>

Suppose your HTML is like this:
```html
<select id="sel_1" style="width:16em" multiple>
</select>
```
And your data:
```js
var mydata = [
   {id:1, name:"USA", inc:[
      {name:"west", inc:[
         {id:111, name:"California", inc:[
            {id:1111, name:"Los Angeles", inc:[
               {id:11111, name:"Hollywood"}
            ]},
            {id:1112, name:"San Diego"}
         ]},
         {id:112, name:"Oregon"},
      ]},
   ]},
   {id:2, name:"India"},
   {id:3, name:"中国"}
];
```
And you call Select2-to-Tree like the following:
```js
$("#sel_1").select2ToTree({treeData: {dataArr:mydata}, maximumSelectionLength: 3});
```
"`{treeData: {dataArr:mydata}`" is for Select2-to-Tree, "`maximumSelectionLength: 3`" is for Select2 (and you can set the other Select2 arguments if needed)

About the data structure: "`id`" will be used as option value, "`name`" will be used as option label, and "`inc`" will be used to specify sub-level options. If your data structure is not like this, you can set arguments in "`treeData`" to change the default behavior, e.g., `treeData: {dataArr: mydata, valFld: "value", labelFld: "text", incFld: "sub"}`:
- `dataArr`, an array containing the data.
- `valFld`, the option value field, it's "`id`" by default. (if the value is empty, the corresponding option will be unselectable, see the "west" option in the example)
- `labelFld`, the option label field, it's "`name`" by default.
- `incFld`, the sub options field, it's "`inc`" by default.
- `dftVal`, the default value.

The above are all the parameters supported by Select2-to-Tree.

<h3>2. directly create the &lt;select&gt; element(see "Example 2" in "example/example.html"):</h3>

If it's hard to create the required data structure, you can directly create the &lt;select&gt; element. It's like the following:
```html
<select id="sel_2" style="width:8em">
   <option value="1" class="l1 non-leaf">opt_1</option>
   <option value="11" data-pup="1" class="l2 non-leaf">opt_11</option>
   <option value="111" data-pup="11" class="l3">opt_111</option>
   <option value="12" data-pup="2" class="l2">opt_12</option>
   <option value="2" class="l1">opt_2</option>
   <option value="3" class="l1">opt_3</option>
</select>
```
- the classes `l1`,`l2`,`l3`,`l4`,`l5`..., setting the nesting level.
- the attribute `data-pup`, setting the value of the parent level option.
- the class `non-leaf`, setting whether the option has children or not.

Then, you call Select2-to-Tree (the "`treeData`" argument of Select-to-Tree is not needed here, but you can set arguments for Select2):
```js
$("#sel_2").select2ToTree();
```

Copyright and license
---------------------
The license is available within the repository in the [LICENSE][license] file.

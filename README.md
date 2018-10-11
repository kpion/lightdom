# LightDom

A lightweight DOM selector and DOM manipulation class, using vanilla (ES6) JS (~250 lines of code). Inherited from the native Array class.

## Examples

Just the basics things similar to the ones from jquery. 

### The HTML we'll manipulate:

```
    <style>
        .selected{
            font-weight:bold;
        }
    </style>
    <ul id = 'list'></ul>
```
### Code:

```
    l('#list').css({border: '1px dotted #00a',opacity: 0.5});
    l('#list').append('<li>new item</li>');
    l('#list').on('click',event => {
        const lTarget = l(event.target);
        if(lTarget.is('li')){
            lTarget.toggleClass('selected');
        }
    })

    //lets add an item again - this time (for example purposes) by cloning the very first item on the list
    //the [0] returns the first (native) Node. The .append accepts it, as well as strings 
    //or other  LightDom object.
    l('#list').append(l('#list li')[0]);

    //example of iterating as native 'Node' element
    l('#list li').forEach(node => {
        node.style.padding = '5px';
    });            
```
## Installation

Right now the only way is to just copy &amp; paste the following file somewhere: https://raw.githubusercontent.com/kpion/lightdom/master/src/lightdom.js


## Change log

1.0 - August 2018 : 
        initial release

2.1 - October 2018 :
        the .append .prepend .before and .after methods now accept not only (string) HTML but also nodes.
        constructor accepts simply a Node (previously a HTMLElement)
        constructor now accepts (string) HTML
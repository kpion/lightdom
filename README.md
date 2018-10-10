# LightDom

A very lightweight DOM selector, using native JS (ES6) (~200 lines of code). Inherited from the vanilla Array class.

## Examples

Just the basics things known from jquery, like:

```
l('.someClass').append('<p>a paragraph</p>');
l('.someClass').css('color','red');
l('.someClass').each(node => {
    node.style.border = '1px dotted green';
});
```

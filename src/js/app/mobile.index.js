require.ensure(["fastclick"], function(require){
    const FastClick = require('fastclick');
    FastClick.attach(document.body);
});

const h_text = '移动端页面'

document.querySelector('#box').innerHTML = h_text
import Vue from '@/js/lib/vue'
//require.ensure(['@/js/lib/vue'], function(require){
    //const Vue = require('@/js/lib/vue');
    new Vue({
        el: '#app',
        data(){
            return {
                list: [
                    {value:'哈哈哈'},
                    {value:'嘻嘻嘻'},
                    {value:'呃呃呃'}
                ]
            }
        },
        methods:{
            
        },
        mounted(){
            
        }
    });

//});
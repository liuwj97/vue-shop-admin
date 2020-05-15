import Vue from 'vue'

// 定义全局指令
Vue.directive('focus', {
    inserted: (el) => {
        console.log(el.nodeName)
        if (el.nodeName === 'INPUT') {
            el.focus()
        } else {
            el.firstElementChild.focus()
        }
    }
})
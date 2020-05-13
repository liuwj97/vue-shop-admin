import Vue from 'vue'

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
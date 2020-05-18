import Vue from 'vue'

Vue.filter('dateFormat', (timeStamp) => {
    var date = new Date(timeStamp);
    var y = date.getFullYear();
    var M = (date.getMonth() + 1 + '').padStart(2, '0');
    var d = (date.getDate() + '').padStart(2, '0');
    var h = (date.getHours() + '').padStart(2, '0');
    var m = (date.getMinutes() + '').padStart(2, '0');
    var s = (date.getSeconds() + '').padStart(2, '0');
    return `${y}-${M}-${d} ${h}:${m}:${s}`;
})
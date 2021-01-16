"use strict"

// 防抖函数
function debounce (delay) {
    let timer;
    return (func, ...args) => {

        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(
            func.bind(null, ...args),
            delay
        );
    };
};

// 节流函数
function throttle (delay) {
    let timer;
    return (func, ...args) => {
        if (timer) {
            return false;
        }

        timer = setTimeout(() => {
            func(...args);
            timer = null;
        }, delay);
    };
};

// 字符串格式化
function formatChar (char, sourceData={}) {
    return char && char.replace && char.replace(/\{(.*)?\}/,(_, indexAt) => {
        return getDataToPath(sourceData, indexAt);
    });
};

// 根据路径获取对象的值
function getDataToPath (data={}, path='', df='') {
    return path.split('.').reduce((sourcre, key) => {
        return ( sourcre[key] || df );
    }, data);
};

//


// test --getDataToPath && formatChar
// const s = {a: 123, b: [4, 5, 6]};
// console.log(getDataToPath(s, 'b.1'))
// console.log(formatChar('-{b}-', s))

// test --debounce
// const delay = 5000;
// const d = debounce(6000);
// setInterval(() => {
//     console.log('delay---');
//     d(console.log, getDataToPath(s, 'b.1'));
// }, delay);

// test --throttle
// const s = {a: 123, b: [4, 5, 6]};
// const delay = 1000;
// const t = throttle(3000)
// setInterval(() => {
//     console.log('delay---');
//     t(console.log, getDataToPath(s, 'b.1'));
// }, delay);

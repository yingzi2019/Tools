"use strict"

// 防抖函数
function debounce (func, delay, ...args) {
    let timer;
    return () => {

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
function throttle (func, delay, immediate, ...args) {
    let timer;
    let ctx = this;
    return () => {
        if (timer) {
            return false;
        } else if (immediate) {
            func.apply(ctx, args);
            return false;
        }
        
        timer = setTimeout(() => {
            func.apply(ctx, args);
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
// const s = {a: 123, b: [4, 5, 6]};
// const delay = 5000;
// const d = debounce(console.log, 3000, getDataToPath(s, 'b.1'));
// setInterval(() => {
//     console.log('delay---');
//     d();
// }, delay);

// test --throttle
// const s = {a: 123, b: [4, 5, 6]};
// const delay = 1000;
// const t = throttle(console.log, 3000, false, getDataToPath(s, 'b.1'))
// setInterval(() => {
//     console.log('delay---');
//     t();
// }, delay);

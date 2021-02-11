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

// instance is Type ?
export function getType (obj) {
    return Object.prototype.toString.call(obj).slice(8, -1)
}
// what is type ?
export function typeOf (obj) {
    const type = typeof obj;

    if (type !== 'object') {
        return type
    }

    return getType(obj)
}

// 根据路径获取对象的值
export function getPathValue (data={}, path='', df='') {
    return path.split('.').reduce((sourcre, key) => {
        return ( sourcre[key] || df );
    }, data);
};

// 字符串格式化
export function formatString (char, sourceData={}) {
    return char && char.replace && char.replace(/\{(.*?)\}/g,(_, index) => {
        return getPathValue(sourceData, index);
    });
};

// 创建一个函数的拷贝
function createFunc (func) {
    const [full, params, operator, funcBody] = func.toString().match(/\((.*?)\)([ ]|=>)*?\{(.*)?\}/m)
    return new Function(...params.split(/,[ ]*/gm), funcBody)
}

// 深拷贝执行函数 
export function deepCopy (obj, hash=new WeakMap()) {
    const type = getType(obj);
    if (type === typeof obj || type === 'Null') return obj;
    if (type === 'Object' || type == 'Array') {
        const allDesc = Object.getOwnPropertyDescriptors(obj);
        const cloneObj = Object.create(Oobject.getPrototypeOf(obj), allDesc);
        hash.set(obj, cloneObj);

        for (let key of Reflect.ownKeys(obj)) {
            cloneObj[key] = deepCopy(obj[key]);
        }

        return cloneObj
    }

    if (type === 'Date') return new Date(obj)
    if (type === 'RegExp') return new RegExp(obj)
}
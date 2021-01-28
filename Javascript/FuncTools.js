"use strict"

const contentDisposition = require("content-disposition");


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
function getType (obj) {
    return Object.prototype.toString.call(obj).slice(8, -1)
}
// what is type ?
function typeOf (obj) {
    const type = typeof obj;

    if (type !== 'object') {
        return type
    }

    return getType(obj)
}

// 根据路径获取对象的值
function getPathValue (data={}, path='', df='') {
    return path.split('.').reduce((sourcre, key) => {
        return ( sourcre[key] || df );
    }, data);
};

// 字符串格式化
function formatChar (char, sourceData={}) {
    return char && char.replace && char.replace(/\{(.*?)\}/g,(_, index) => {
        return getPathValue(sourceData, index);
    });
};

// 创建一个函数的拷贝
function createFunc (func) {
    const [full, params, operator, funcBody] = func.toString().match(/\((.*?)\)([ ]|=>)*?\{(.*)?\}/m)
    return new Function(...params.split(/,[ ]*/gm), funcBody)
}

// 深拷贝的白名单
const whiteList = ['function', 'Object', 'Array'];

// 深拷贝执行函数 
function deepCopy (obj, hash=new WeakMap()) {
    const type = typeOf(obj);
    const isWhite = whiteList.includes(type);

    if (isWhite) {
        const allDesc = Object.getOwnPropertyDescriptors(obj);
        const keys = Object.keys(obj)

        const cloneObj =
            type === 'function'
            ? createFunc(obj)
            : type === 'Array'
                ? []
                : Object.create(Object.getPrototypeOf(obj), allDesc);

        for (const key of keys) {
            cloneObj[key] = deepCopy(obj[key])
        }

        hash.set(obj, cloneObj)
        return cloneObj

    } else {
        switch (type) {
            case 'Date':
                return new Date(obj)
            case 'RegExp':
                return new RegExp(obj)
            case hash.has(obj):
                return hash.get(obj)
            case typeof obj:
                return obj
            default:
                return false
        }
    }
}

/**
 * 
 * @param {Array} arr 期望是一个数组
 * @returns {Generator} 可以使用扩展运算符将其解构 [...result]
 */
function* flat_arr (arr) {
    if (arr instanceof Array) {
        for (const i of arr) {
            if (i instanceof Array) {
                yield* flat_arr(i);
            } else {
                yield i;
            }
        }
    } else {
        yield arr;
    }
}

/**
 * 
 * @param {Function} fn 初始函数
 * @param  {...any} args 
 * @returns 结果 或 本身
 */
function partial (fn, ...args) {
    if (fn.length <= args.length) {
        return fn(...args);
    } else {
        return (..._args) => partial(fn, ...args, ..._args);
    }
}

/**
 * 
 * @param {any} obj 
 * @returns obj type
 */
function getObjType (obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
}

/**
 * 
 * @param {any} any 
 * @returns obj type or basic type
 */
function getType (any) {
    const res = typeof any;
    if (res !== 'object') {
        return res;
    }
    return getObjType(any);
}

/**
 * 根据属性路径, 获取data中的数据
 * @param {object} data {} 
 * @param {string} path a.b.c
 * @param {any} df ''
 * @returns data.attrs
 */
function getPathValue (data = {}, path = '', df = '') {
    return path.split('.').reduce((source, key) => {
        return source[key] || df;
    }, data);
}

/**
 * 根据属性路径, 设置data中的数据
 * @param {object} data {}
 * @param {string} path 'a.b.c'
 * @param {*} value '123'
 * @param {*} df {}
 * @returns {a: {b: {c: '123'}}
 */
function setPathValue (data = {}, path = '', value = '', df = {}) {
    let path_list = path.split('.');
    const last_key = path_list.pop();
    const last = path_list.reduce((source, key) => {
        res = source[key];
        return res || ((source[key] = df), df);
    }, data);
    last[last_key] = value || df;
    return data;
}

/**
 * 格式化字符串
 * @param {string} char '123{key}, 456{path}'
 * @param {object} sourceData {key: 1, path: 'abc'}
 * @returns string '1231, 456abc'
 */
function formatString (sourceData = {}, char = '') {
    if (typeof char !== 'string' || typeof sourceData !== 'object') {
        throw new Error('第一个参数应该是字符串类型');
    }
    return char.replace(/\{(.*?)\}/g, (_, index) => {
        return getPathValue(sourceData, index);
    });
}

/**
 * 
 * @param {URL} url "https://www.baidu.com/?q=st" 
 * @returns {Object} {q: 'st'}
 */
function parseQueryString (url) {
    let queryParams = {};
    const [protocol, otherPath] = url.split('://');
    const [host, pathString, ..._args] = otherPath.split('/');
    const mergePathString = [pathString, ..._args].join('/');
    const [pathName, queryString, ...args] = mergePathString.split('?');
    const temp = [queryString, ...args].join('?');
    temp.split('&').forEach(item => {
        let [preKey, nextVal, ...args] = item.split('=');
        preKey = preKey.trim();
        nextVal = [nextVal, ...args].join('=').trim();
        if (preKey && nextVal) {
            queryParams[preKey] = nextVal;
        }
    });

    const [hostName, port = 80] = host.split(':');

    return {
        protocol,
        host,
        hostName,
        port,
        pathName,
        queryParams
    };
}

/**
 * @param {Object} interceptObject {onRequest,onResponse,setRequest(fn),setResponse(fn), removeRequest(), removeResponse()}
 */
function custXHR (interceptObject) {
    const XHR = window.XMLHttpRequest;
    if (!XHR) {
        throw new Error('抱歉，您的浏览器不支持XMLHttpResponse进行请求~');
    }

    const open = XHR.prototype.open;
    const send = XHR.prototype.send;
    let postData;
    let requestMethod;
    let requestUrl;
    XHR.prototype.open = function (
        method,
        targetUrl,
        isAsync = true,
        username,
        password
    ) {
        interceptObject.onRequest &&
            interceptObject.onRequest(
                method,
                targetUrl,
                isAsync,
                username,
                password
            );
        requestMethod = method;
        requestUrl = targetUrl;

        this.send = function (data) {
            postData = data || {};
            return send.call(this, data);
        };

        this.addEventListener('readystatechange', function (...args) {
            if (this.readyState == 4) {
                let responseData;
                contentType = this.getResponseHeader('content-type');
                if (contentType && contentType.indexOf('json')) {
                    try {
                        responseData = JSON.parse(this.responseText);
                    } catch (error) {
                        responseData = this.responseText;
                    }
                }

                interceptObject.onResponse &&
                    interceptObject.onResponse({
                        config: {
                            method: requestMethod,
                            url: requestUrl,
                            data: postData
                        },
                        response: responseData
                    });
            }
        });

        return open.call(
            this,
            method,
            targetUrl,
            (isAsync = true),
            username,
            password
        );
    };
}

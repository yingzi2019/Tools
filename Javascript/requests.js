import AxiosInstance from 'axios';

class Request {
    // 默认请求对象
    axios = AxiosInstance
    // 重试请求的时间间隔
    retryDelay = 1000
    // 请求失败的重试次数
    retry = process.env.VUE_APP_RETRY

    constructor () {
        const { axios } = this;
        axios.defaults.timeout = process.env.VUE_APP_AXIOS_TIMEOUT;
        axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
        axios.defaults.headers = {
            'Content-Type': 'application/json;charset=UTF-8'
        };

        this.useInterceptRequest()
        this.useInterceptResponse()
    }

    useInterceptRequest () {
        this.axios.interceptors.request.use(
            config => {
                return config
            },
            err => {
                return err
            }
        )
    }

    useInterceptResponse () {
        this.axios.interceptors.response.use(
            response => {
                const { code, data, msg} = response.data
                // 逻辑判断

                return data
            },
            err => {
                return err
            }
        )
    }

    /**
     * 
     * @param {String} type: get || post
     * @param {String} url: 请求的地址
     * @param {Object} options 请求携带的参数 
     * @param {Boolean} isComplex 将参数平铺, {a:1，b:2} === a=1&b=2 
     */
    fetchData (type, url, options, isComplex) {
        if (isComplex) return this.axios[type](url, null, options)
        console.log(this.axios.baseURL, 'ar--')
        return this.axios[type](url, options)
    }

    get (url, params) {
        if (!params) return this.fetchData('get', url)
        // 不加载缓存
        const newParams = Object.assign({}, params, {
            [`t-${Date.now()}`]: 1
        })
        console.log(params, newParams)

        return this.fetchData('get', url, {params: newParams})
    }

    //  post put patch delete 逻辑处理封装
    commonRequest (type, url, params, data) {
        let options = {
            params,
            data
        }

        if (params && data === undefined) {
            options = {
                data: params
            }
        }

        if (data === null) {
            options = {
                params
            }
        }

        return this.fetchData(type, url, options, true)
    }

    post (url, params, data) {
        return this.commonRequest('post', url, params, data)
    }

    put (url, params, data) {
        return this.commonRequest('put', url, params, data)
    }
    
    patch (url, params, data) {
        return this.commonRequest('patch', url, params, data)
    }
    
    delete (url, params, data) {
        return this.commonRequest('delete', url, params, data)
    }
}

export default new Request();

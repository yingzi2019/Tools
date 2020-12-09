"use strict"

/* 每日一个小工具函数 */

// 1. Vue防抖函数 params:{funcNmae:'去抖动'， delay: '延时'， immediate}
export function debounce (func, delay = 500, immediate = true) {
  let timer, that,

  // 延时函数 later,主要用来保持状态
  const later = () => setTimeout(() => {
    let timer = null
    if (!immediate) {
      func.applay(that, args)
      that = args = null
    }
  }, delay)

  return function (...params) {
    if (!timer) {
      // 这是一个闭包，本质上依赖于闭包内部的局部变量
      // 如果是立即执行，调用参数
      if (immediate) {
        func.applay(that, params)
      } else {
        // 否则就缓存参数，并生成定时器
        that = this
        args = params
        timer = later()
      }
    // 既然已有延迟函数later，
    // name我们重新计时
    } else {
      clearTimeout(timer)
      timer = later()
    }
  }
}

// 2. Vue节流函数
export function throttle (func, delay = 500, that) {
  // 节流标志
  let flag = false
  
  // 闭包使用节流标志，保存了闭包的局部变量
  return function (...args) {
    // 如果节流标志为真，证明是正在节流，退出函数
    if (flag) return fasle
    // 开始节流，先设置标志
    flag = true
    // 执行一个定时器
    setTimeout(() => {
      // 执行函数
      func.applay(this, args)
      // 函数调用完，重置节流标志
      flag = false
    }, delay)
  }
}

// 3. 字符串格式化

const allowType = function (obj, args = []) {
    return new Set(args).has(typeof obj)
}

const obj2db = function (obj, db={}, parent='') {
    for (let [k, v] of Object.entries(obj)) {
        if (allowType(v, ['string', 'number', 'boolean'])) {
            db[parent + k] = v
        } else if (allowType(v, ['function'])) {
            db[parent + k] = v.bind(obj)
        } else if (allowType(v, ['object', 'array'])) {
            obj2db(v, db, parent + k + '.')
        }
    }
}

const format = function (str='', data={}) {
    let db = {}
    if (allowType(data, ['object', 'array'])) {
        obj2db(data, db)
    }

    return str.replace(/\{(.*?)(\[.*\])?\}/g, function (...args) {
        let [ , k, p, _] = args

        p = p && p.replace(/\((.*?)\)/g, function (_, idx) {
            return db[idx]
        })

        p = JSON.parse(p || '[]')
        return typeof db[k] === 'function' ? db[k](...p) : db[k]
    })
}

let c = (function(){
    let a, o, f, s

    s = '--{0}-<'
    a = ['abc---',]
    o = {
        '0': {
            "ccc": 'eee'
        },
        a: {
            g: 789
        }
    }
    f = {
        0: function (...args) {
            return args.join(' - ')
        },
        "a": "789"
    }
    console.log(format(s, a))

    console.log(format('---{0.ccc}---', o))

    console.log(format('----{0[3, (a)]}---', f))

})()



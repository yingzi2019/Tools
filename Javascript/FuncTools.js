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






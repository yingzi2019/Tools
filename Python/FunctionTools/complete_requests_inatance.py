import json

import requests

url = 'http://www.baidu.com'

res = requests.get(url)

print(res.content.decode('utf-8'))  # 不根据chardet来推测 res.encoding() 市场推测出来的编码
# unicode_escape()  用来解码
# res.url 请求的url地址
# res.requests.headers  # 响应对象的请求头
# res.headers  # 响应对象的响应头
# res.json  # 将json的字符串转化为python的字典
# res.cookies  # 响应对象携带的cookie数据

# 2. 发送带有请求头的请求
headers = {'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36}"}
url_yaozhi = "https://news.yaozh.com/"

res = requests.get(url_yaozhi, headers=headers)
print(res.text)

# 3. 发送带有查询参数的请求
url = 'http://www.baidu.com'
url += '?kw=python&c_ts=789'

res = requests.get(url, headers=headers)
print(res.text)

# 发起多个参数的get请求

params = {'kw': 'python'}
res = requests.get(url, headers=headers, params=params)
print(res.text)

# 使用cookie参数
cookie_str = "_ga=GA1.2.1481756427.1592491629; _gid=GA1.2.10331825.1592491629; acw_tc=2f624a6415924919174086018e43d54131a608079f7b4c64d7a6f0f4593da4"

tmp = cookie_str
cookie_list = cookie_str.split(';')
dict_cookies = {cookie.split('=')[0]:cookie.split('=')[1] for cookie in cookie_list}

res = requests.get(url, headers=headers, params=params, cookies=dict_cookies)
print(res.text)

# cookiejar 转换cookies 为json对象
dict_cookies = requests.utils.dict_from_cookiejar(res.cookies)
print(dict_cookies)
jar_cookies = requests.utils.cookiejar_from_dict(dict_cookies)
print(jar_cookies)

# timeout 参数
res = requests.get(url, timeout=3)
print(res)
print(res.headers)

# 忽略CA证书
res = requests.get(url, verify=False)

# 发起post请求
res = requests.post('http://www.baidu.com', data={'kw': 'python'})  # 暂时不可用？？？WHY？
print(res)
print(res.headers)
print(res.status_code)
print(res.apparent_encoding)


# 状态保持
session = requests.session()
data = {'kw': 'python'}
res = requests.get(url)
print(res.text)
res = session.post(url, data)

# 使用代理
proxies = {"http": "127.0.0.1:9527", "https":"192.168.70.112:9966"}
resopnse = requests.get(url, proxies=proxies)
print(resopnse)


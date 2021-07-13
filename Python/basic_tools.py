import json
import hashlib
from collections import Iterable


def flat_arr(arr):
    """扁平化数组"""
    for i in arr:
        if isinstance(i, arr):
            yield from flat_arr(i)
        else:
            yield i


def get_cls_name(ins):
    """获取类名"""
    assert not isinstance(ins, type), '应该传入实例对象'
    return type(ins).__name__


convert_attrs_map = {

}


def get_ins_values(ins, attrs, convert_attrs):
    """性能耗费较多, getattr与dict.get花费时间较多, 当用于确认的数据结构, 会很好用"""
    assert isinstance(attrs, Iterable) and isinstance(convert_attrs, Iterable), '请使用可迭代对象'
    result = {}
    for i in attrs:
        result[i] = getattr(ins, i)
    for j in convert_attrs:
        func = convert_attrs.get(j)
        if func and callable(func):
            result[j] = func(ins)


def encrypt_md5(char):
    """将字符串进行MD5加密"""
    _t = hashlib.md5()
    _t.update(char.encode('utf-8'))
    return _t.hexdigest()


class EncryptResponse(object):

    def __init__(self, secret):
        self.secret_key = encrypt_md5(secret)
        self.data_length = 0
        self.front_str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
        self._index = 0
        self.b_like_list = [range(i, i + 16) for i in range(0, 64, 16)]
        self.c_like_list = [range(i, 64, 4) for i in range(4)]

    def get_index(self):
        _temp = self._index
        self._index += 1
        if self._index == 32:
            self._index = 0
        return _temp

    def get_idx_str(self, chars, i):
        if i >= self.data_length - 2:
            return (
                chars[i],
                "-" if i + 1 >= self.data_length else chars[i + 1],
                "-" if i + 2 >= self.data_length else chars[i + 2]
            )
        return (
            chars[i],
            chars[i + 1],
            chars[i + 2]
        )

    def get_secret_idx(self, pre, mid, end):
        _a = self.secret_key[self.get_index()]
        a_code = ord(pre) ^ ord(_a)
        _b = self.secret_key[self.get_index()]
        b_code = ord(mid) ^ ord(_b)
        _c = self.secret_key[self.get_index()]
        c_code = ord(end) ^ ord(_c)

        a, a_t = divmod(a_code, 4)
        d_t, d = divmod(c_code, 64)

        b_t, c_t = divmod(b_code, 16)
        b = self.b_like_list[a_t][b_t]
        c = self.c_like_list[d_t][c_t]
        return a, b, c, d

    def encrypt_json_data(self, data):
        """将json对象进行混淆"""
        json_str = json.dumps(data)
        del data
        self.data_length = len(json_str)
        self._index = 0

        result = []
        for i in range(0, self.data_length, 3):
            pre, mid, end = self.get_idx_str(json_str, i)
            args = self.get_secret_idx(pre, mid, end)
            result.extend([self.front_str[i] for i in args])
        return ''.join(result)


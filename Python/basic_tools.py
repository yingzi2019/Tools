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

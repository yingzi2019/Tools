# 根据路径获取对象数据

a = '1.a.c.f.d'

dt = {
    "a": {
        "c": {
            "f": 123,
            "g": [123, [123, {"a": [7, 8, 9]}]]
        }
    }
}

dl = [1, dt, {"a": 2}]

def get_path_data(string='', data={}, dft=''):
    kmp = string.split('.')
    tmp = data
    for idx in kmp:
        idx = int(idx) if idx.isdigit() else idx
        if isinstance(tmp, list):
            if (len(tmp) - 1) < idx:
                return dft
            tmp = tmp[idx]
        elif isinstance(tmp, dict):
            tmp[idx] =  tmp.get(idx, False)
            if not tmp[idx]:
                return dft
    return tmp
        
t = get_path_data(a, dl, '123')
print(t)

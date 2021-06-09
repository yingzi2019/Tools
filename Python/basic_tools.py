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
        a_code = ord(pre) ^ ord(self.secret_key[self.get_index()])
        b_code = ord(mid) ^ ord(self.secret_key[self.get_index()])
        c_code = ord(end) ^ ord(self.secret_key[self.get_index()])

        a, a_t = divmod(a_code, 4)
        d_t, d = divmod(c_code, 36)

        b_t, c_t = divmod(b_code, 16)
        b = self.b_like_list[a_t][b_t]
        c = self.c_like_list[d_t][c_t]
        print(a, b, c, d)
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


if __name__ == '__main__':
    data = {
        "index_banner_new": [
            {
                "id": 662,
                "title": "聚智创新·融合发展|2021大健康产业高质量发展大会暨第六届中国医药研发·创新峰会（PDI）",
                "content": "//news-files.yaozh.com/system_53/7eb9b3a0dc0d83fd466ad304c079cd32.png",
                "url": "https://pdi.yaozh.com/?ga_source=news&amp;amp%3Bga_name=index_flash",
                "nav_id": 0
            },
            {
                "id": 697,
                "title": "@医药人：“2021年中国CRO企业排行榜”评选活动报名通道开启！",
                "content": "//news-files.yaozh.com/system_53/fe6276b2adfcf030696c29b8f952b78f.jpg",
                "url": "https://news.yaozh.com/archive/33905.html?ga_source=news&amp;amp%3Bga_name=index_flash",
                "nav_id": 0
            },
            {
                "id": 736,
                "title": "【免费参会】数据赋能·创新发展|小分子创新药研发技能论坛——邀您6月共聚苏州",
                "content": "//news-files.yaozh.com/system_53/0a632e357f80253686e9874b7b3570e8.png",
                "url": "https://news.yaozh.com/archive/34123.html?ga_source=news&amp;amp%3Bga_name=index_flash",
                "nav_id": 0
            },
            {
                "id": 741,
                "title": "“医药行业三大百强榜”分析！2021中国药品研发实力100强榜即将发布",
                "content": "//news-files.yaozh.com/system_53/4b9db9c6745fc418856683c41e7d79b2.png",
                "url": "https://news.yaozh.com/archive/34167.html?ga_source=news&amp;amp%3Bga_name=index_flash",
                "nav_id": 0
            },
            {
                "id": 669,
                "title": "药智学院MDP精英训练营（第二期 上海站）|医药数据检索与研发立项专题培训",
                "content": "//news-files.yaozh.com/system_53/a5ae90b065b7984524597e9a330e2f0f.png",
                "url": "https://news.yaozh.com/archive/33763.html?ga_source=news&amp;amp%3Bga_name=index_flash",
                "nav_id": 0
            },
            {
                "id": 633,
                "title": "“化学+药学+医学”全产业链，一站式CRO研发服务",
                "content": "//news-files.yaozh.com/system_53/54be82f7fc9ab4a488892a8e71d1532c.png",
                "url": "https://news.yaozh.com/archive/33010.html?ga_source=news&amp;amp%3Bga_name=index_flash",
                "nav_id": 0
            },
            {
                "id": 536,
                "title": "实时发布、全面曝光！让项目/产品推广活起来！",
                "content": "//news-files.yaozh.com/system_53/a46bd8008f6ff8df22f7d4bd66e6c202.png",
                "url": "https://news.yaozh.com/BrandZone?ga_source=news&amp;amp%3Bga_name=index_flash",
                "nav_id": 0
            }
        ],
        "index_top_new": [
            {
                "id": 703,
                "title": "@医药人：“2021年中国CRO企业排行榜”评选活动报名通道开启！",
                "content": "//news-files.yaozh.com/system_53/baf36bfbd25a1b14570ace2c4530ad19.jpg",
                "url": "https://news.yaozh.com/archive/33905.html?ga_source=news&amp;amp%3Bga_name=index_flash",
                "nav_id": 0
            }
        ],
        "index_rightcorner_new": [],
        "index_hotactivity_new": [
            {
                "id": 696,
                "title": "“2021年中国CRO企业排行榜”评选活动",
                "content": "//news-files.yaozh.com/system_57/deeec2f96278b4bf8686b9d64e77fda1.png",
                "url": "https://news.yaozh.com/archive/33905.html",
                "nav_id": 0
            }
        ],
        "Article_detail_ad1_new": [],
        "Atals_detail_ad_new": [],
        "column_top_new": [],
        "column_banner_new": [],
        "column_banner_rightside_ad1_new": [],
        "column_banner_rightside_ad2_new": [],
        "indexh5_banner_new": [
            {
                "id": 745,
                "title": "“医药行业三大百强榜”分析！2021中国药品研发实力100强榜即将发布",
                "content": "//news-files.yaozh.com/system_53/8c696c0d6f8092d670cbdb66f365622d.png",
                "url": "https://news.yaozh.com/archive/34167.html?ga_source=news&amp;amp%3Bga_name=index_flash",
                "nav_id": 0
            },
            {
                "id": 668,
                "title": "药智学院MDP精英训练营（第二期 上海站）|医药数据检索与研发立项专题培训",
                "content": "//news-files.yaozh.com/system_53/0835ba4d5bcbfef9b97918aa63f841ff.png",
                "url": "https://news.yaozh.com/archive/33763.html?ga_source=news&amp;amp%3Bga_name=index_flash",
                "nav_id": 0
            }
        ],
        "columnh5_banner_new": [],
        "Articleh5_detail_ad1_new": [],
        "Atalsh5_detail_ad_new": [],
        "video_banner_new": [],
        "video_banner_rightside_ad1_new": [],
        "video_banner_rightside_ad2_new": [],
        "meeting_banner_new": [],
        "videoh5_banner_new": [],
        "pinpai_banner_new": [
            {
                "id": 514,
                "title": "北京鑫开元医药科技有限公司",
                "content": "//news-files.yaozh.com/system_54/d95c06e92c55f4e718119ed856d7ea9b.jpg",
                "url": "https://news.yaozh.com/archive/32657.html",
                "nav_id": 0
            },
            {
                "id": 535,
                "title": "实时发布、全面曝光！让项目/产品推广活起来！",
                "content": "//news-files.yaozh.com/system_54/7d279b69d1f0488d4a13830437a1f8e4.png",
                "url": "https://news.yaozh.com/archive/32775.html?ga_source=news&amp;amp%3Bamp%3Bga_name=index_flash",
                "nav_id": 0
            }
        ],
        "pinpai_banner_rightside_ad1_new": [
            {
                "id": 508,
                "title": "牌牌生物",
                "content": "//news-files.yaozh.com/system_54/e1c79fafdde592ace087c9b5d35524f9.png",
                "url": "https://news.yaozh.com/archive/32882.html",
                "nav_id": 0
            }
        ],
        "pinpai_banner_rightside_ad2_new": [
            {
                "id": 509,
                "title": "威凯尔医药",
                "content": "//news-files.yaozh.com/system_54/85acc817309907cd830ab4d2e7f802f4.png",
                "url": "https://news.yaozh.com/archive/33010.html",
                "nav_id": 0
            }
        ]
    }
    print(data)
    er = EncryptResponse('yaozh_news2020!')
    temp = er.encrypt_json_data(data)
    print('\n\n', temp, '\n\n')

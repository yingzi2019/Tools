import os
import multiprocessing

# 拼接路径的函数
merge = os.path.join


# 拷贝文件
def copy_file(old_file_path, new_file_path):
    with open(old_file_path, 'rb') as old_file:
      content = old_file.read()

    with open(new_file_path, 'wb') as new_file:
        new_file.write(content)
    return


# 多进程递归拷贝文件夹
def copy_files(que, file_name, old_file_name, new_file_name):
    """多进程递归完成文件夹的复制
    pool: 进程池
    fele_name: 文件名
    """
    # 输出提示信息
    print(f'===>模拟文件拷贝，从%s到%s, 文件名是:%s' %
        (old_file_name, new_file_name, file_name))

    # 初始路径
    main_file_path = merge(old_file_name, file_name)

    # 输出路径
    out_file_path = merge(new_file_name, file_name)

    # 判断是否是文件夹
    if os.path.isdir(main_file_path):
        # 是文件夹， 创建新的文件夹
        os.mkdir(out_file_path)

        # 既然是文件夹，我们获取文件夹中的文件名
        son_file_list = os.listdir(main_file_path)

        # 遍历循环，并递归
        for son_file in son_file_list:
            copy_files(
                que,
                son_file,
                main_file_path,
                out_file_path
            )

    else:
        # 执行拷贝文件
        copy_file(main_file_path, out_file_path)

        # 存入
        que.put(file_name)


# 递归计算文件夹中有多少个文件
def get_all_file(path):
    all_file_num = 0
    # os.walk(dir_path) 简单易用的文件、目录遍历器, 还能再法神个错误时，调用回调函数
    for dir_path, dir_names, file_names in os.walk(path):
        all_file_num += len(file_names)
    return all_file_num



def main():
    # 获取用户拷贝的文件夹路径或者名字
    old_file_name = input('请输入要拷贝的文件(夹)的名字(路径) :')

    # 判断是文件还是文件夹
    try:
        # 生成新文件名字
        new_file_name = '[复件]' + old_file_name
        if os.path.isdir(old_file_name):
            n = 0
            # 尝试五次
            while n<5:
                n += 1
                if os.path.exists(new_file_name):
                    new_file_name = 'copy-' + new_file_name
                    continue
                os.mkdir(new_file_name)
                break
        else:
            while True:
                if os.path.exists(new_file_name):
                    new_file_name = 'copy-' + new_file_name
                    continue
                copy_file(old_file_name, new_file_name)
                print('文件: %s, 创建成功' % new_file_name)
                break
    except Exception as e:
        print(f'目标(%s)创建失败, 源目标为: %s 错误信息是: {e}' % new_file_name, old_file_name)
        pass

    # 获取所有文件的个数
    all_file_num = get_all_file(old_file_name)
    print('file_amount--->', all_file_num)

    # 获取文件夹中所有带拷贝的文件的名字列表
    file_list = os.listdir(old_file_name)
    print('file_list--->', file_list)

    # 创建进程池
    pool = multiprocessing.Pool(5)

    # 创建队列
    que = multiprocessing.Manager().Queue()

    # 向进程池中添加拷贝文件的任务
    for file_name in file_list:
        pool.apply_async(copy_files, args=(que, file_name, old_file_name, new_file_name))

    # 关闭进程池， 不在接收任务
    pool.close()

    # 计算任务完成数
    copy_ok_num = 0
    while True:

        # 获取正在进行的工作
        file_name = que.get()
        print(f'已经完成拷贝: {file_name}')

        # 增量
        copy_ok_num += 1

        print(f'\r拷贝进度为: {(copy_ok_num / all_file_num * 100):.2f}%%')

        # 终止条件
        if copy_ok_num >= all_file_num:
          break
    print()


if __name__ == '__main__':
    main()

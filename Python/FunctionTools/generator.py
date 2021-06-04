def flat_arr(arr):
    if isinstance(arr, list):
        yield from flat_arr(arr)
    else:
        yield arr


a = [1, [2, 4, [5, 4, 7, 8, [14, 15, 1]]]]

print(list(flat_arr(a)))

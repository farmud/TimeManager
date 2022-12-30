//KMP算法
export function kmp(source: string, pattern: string) {
    //计算table(next数组)
    let table = new Array(pattern.length).fill(0);
    {
        let i = 1, j = 0;
        while (i < pattern.length) {
            if (pattern[i] === pattern[j]) {
                ++j;
                ++i;
                table[i] = j;
            } else {
                if (j > 0) {
                    j = table[j];
                } else {
                    ++i;
                }
            }
        }
    }
    //模式匹配
    {
        let i = 0, j = 0;
        while (i < source.length) {
            if (pattern[j] === source[i]) {
                ++i;
                ++j;
            } else {
                if (j > 0) {
                    j = table[j];
                } else {
                    ++i;
                }
            }
            if (j === pattern.length) {
                return true;
            }
        }
        return false;
    }
}

//过滤算法
export function select(list: any, chooser: Function) {
    let result = [];
    for (let item of list) {
        if (chooser(item)) {
            result.push(item);
        }
    }
    return result;
}
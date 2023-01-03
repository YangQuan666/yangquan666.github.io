---
title: 几种常见的关键词匹配算法介绍
date: 2022-07-10
excerpt: "本文主要介绍一下几种常见的关键词匹配算法的原理，同时加上了一些我自己做的gif动图帮助大家理解"
tags:
- 关键词匹配
- 算法
- Java
---
# 几种常见的关键词匹配算法介绍
## 背景
做内容安全有个很重要的能力就是文本关键词检测，比如检测一段话中是否含有“法轮功”等敏感字段，这就涉及到关键词匹配算法，因此我整理的一些常见的关键词匹配算法，同时加上了自己做的gif图还有自己写的的代码，希望能让读者比较容易理解算法的工作原理
## 名词解释

- 原文`content`：待检测的文本内容
- 关键词`keyword`：希望匹配的敏感词
- 关键词库：由关键词组成的集合
## 朴素算法
又称暴力匹配，这个算法很容易理解，就是将原文和关键词进行逐个比较，一致时则继续比较下一字符，直到比较完整个模式串。不一致时则将原文后移一位，重新从模式串的首位开始对比
### 特点
- **优点**：算法实现简单 
- **缺点**：性能低
### 演示
![朴素算法.gif](/post/keyword-check/朴素算法.gif)
### 代码解读
枚举原文`content`中的每个字符作为“发起点”，每次从`content`的“发起点”和`keyword`的“首位”开始尝试匹配：  

- 匹配成功：返回本次匹配的原串“发起点”
- 匹配失败：从`content`的下一个“发起点”，重新尝试匹配
```java
public int find(char[] content, char[] keyword) {
    int n = content.length, m = keyword.length;
    if (n < m) {
        return -1;
    }
    if (m == 0) {
        return 0;
    }

    // k用来记录“发起点”
    for (int k = 0; k <= n - m; k++) {
        int i = k, j = 0;
        while (j < m && content[i] == keyword[j]) {
            i++;
            j++;
        }
        if (j == m) {
            return k;
        }
    }
    return -1;
}
```
### 时间复杂度
假设content长度为n，keyword长度为m，则：

- 匹配单个keyword时间复杂度：O(n*m)
- 匹配k个keyword组成的词库时间复杂度：O(k\*m\*n)
## 朴素算法-改进版
改进版的思想是先匹配第一个单词是否相等，如果相等则再比较后续的部分，Java的`String.contains()`方法就采用了这种思想
### 代码解读
```java
public int indexOf(char[] content, char[] keyword) {
    int n = content.length, m = keyword.length;
    if (n < m) {
        return -1;
    }
    if (m == 0) {
        return 0;
    }

    char first = keyword[0];
    int max = n - m;
    for (int i = 0; i <= max; i++) {
        // 先看首字符想不想等
        while (i <= max && content[i] != first) {
            i++;
        }
        // 在看后面的想不想等
        if (i <= max) {
            int j = i + 1;
            int end = i + m;

            // j的范围在 [i+1, i+m) 之间
            for (int k = 1; j < end; j++, k++) {
                if (content[j] != keyword[k]) {
                    break;
                }
            }
            if (j == end) {
                return i;
            }
        }
    }
    return -1;
}
```
### 时间复杂度
改进版相比原版，只是实现的逻辑略有不同，但是时间复杂度并没有任何提升：

- 匹配单个keyword时间复杂度：O(m\*n)
- 匹配k个keyword组成的词库时间复杂度：O(k\*m\*n)
## 字典树
又称**前缀树**或者**Trie树**，是一种树形结构，其思想是利用字符串的公共前缀来降低查询时间的开销以达到提高效率的目的。目前内容安全就是采用该算法进行关键词的匹配
### 特点
优点：词库匹配的情况下时间复杂度较低
缺点：每次删除、修改关键词都需要全量build字典树
### 演示
![字典树.gif](/post/keyword-check/字典树.gif)
### 代码解读
```java
class TrieNode {

    int count; //表示以该处节点构成的串的个数
    int preCount; //表示以该处节点构成的前缀的字串的个数
    Map<Character, TrieNode> child;

    TrieNode() {
        child = new HashMap<>();
        count = 0;
        preCount = 0;
    }
}
```
```java
class Trie {

    TrieNode root;

    public Trie() {
        root = new TrieNode();
    }

    public void insert(char[] word) {
        TrieNode node = root;
        for (char ch : word) {
            //计算下一个节点
            TrieNode next = node.child.computeIfAbsent(ch, oldV -> new TrieNode());
            //node指向下一个节点
            node = next;
            node.preCount++;
        }
        node.count++;
    }

    public boolean search(char[] word) {
        TrieNode node = root;
        for (char ch : word) {
            TrieNode next = node.child.get(ch);
            if (next == null) {
                return false;
            }
            node = next;
        }
        return node.count > 0;
    }

    public boolean startWith(char[] prefix) {
        TrieNode node = root;
        for (char ch : prefix) {
            node = node.child.computeIfAbsent(ch, oldV -> new TrieNode());
        }
        return node.preCount > 0;
    }

}
```
### 时间复杂度
假设content长度为n，keyword长度为m，则：

- 匹配单个keyword时间复杂度：O(n\*log(m))
- 匹配`k`个关键词时间复杂度：O(n\*log(k\*m))
## KMP算法
kmp算法是由大神高德纳参与发明的算法，其核心思想是利用匹配失败后的信息，尽量减少匹配次数以达到快速匹配的目的
### 特点
优点：next数组不依赖原文content，所以在**管理时**就可以计算生成，从而大大提升**运行时**的识别速度
缺点：next数组的代码逻辑理解比较困难
### 演示
![kmp算法.gif](/post/keyword-check/kmp算法.gif)
### 代码解读
```java
public int kmp(char[] content, char[] keyword) {
    int n = content.length, m = keyword.length;
    if (n < m) {
        return -1;
    }
    if (m == 0) {
        return 0;
    }

    //计算next数组
    int[] next = next(keyword);
    int j = 0;
    for (int i = 0; i < n; i++) {
        while (j > 0 && content[i] != keyword[j]) {
            //找到j的下一个位置
            j = next[j - 1];
        }
        if (content[i] == keyword[j]) {
            j++;
        }
        if (j == m) {
            return i + 1 - j;
        }
    }
    return -1;
}
```

了解next数组之前，需要先知道一个概念：**最长公共前后缀**，举个例子：对于字符串`"ababa"`,其前缀和后缀相同的情况分别为：

- 前缀`"a"`，后缀`"a"`
- 前缀`"aba"`，后缀`"aba"`

则我们称`"aba"`是字符串`"ababa"`的最长公共前后缀，**next数组的本质就是在求字符串中的最大公共前后缀的长度**
`next[i]`表示`keyword`字符串中`[0,i-1]`组成的子串，其最大公共前后缀的长度，比如对于一个关键词：`"ababc"`,`[0,3]`组成的子串是`"abab"`，其最大公共前后缀为`"ab"`,所以`next[3]=2`
根据`next`数组的规律，我们可以确定有如下的结论是成立的：`next[i]`的最大值为`next[i-1]+1`

`next`数组的实现采用了类似动态规划的思想，在求`next[i+1]`之前假设我们已经求得了`next[0]`...`next[i]`的值：

1. 假设`next[i]=k`，则有`a[0,k-1]=a[i-k+1,i]`（前`k-1`位字符与后`k-1`位字符重合，`数组a`表示`keyword`的字符数组）
2. 如果`a[i+1]`=`a[k]`，则`a[0,k]`=`a[i-k+1,i+1]`，此时`next[i+1]`=`k+1`，否则进入下一步
3. 再假设`next[k]`=`m`，则`a[0,m-1]`=`a[k-m+1,k-1]`，
4. 联合1、3步可以得到：`a[0,m-1]`=`a[k-m+1,k-1]`=`a[i-k+1,i-k+1+m]`=`a[i-m+1,i]`这四段都重合
5. 这时再判断，如果`a[i+1]`=`a[m]`，则`a[0,m]`=`a[i-m+1,i+1]`，此时`next[i+1]`=`m+1`,否则再取`next[m]`=`n`,以此类推

```java
public int[] next(char[] keyword) {
    int[] next = new int[keyword.length];
    int j = 0;
    for (int i = 1; i < keyword.length; i++) {
        while (j < i && j > 0 && keyword[i] != keyword[j]) {
            //j取下一个理想位置
            j = next[j - 1];
        }
        if (keyword[i] == keyword[j]) {
            j++;
            next[i] = j;
        }
    }
    return next;
}
```
### 时间复杂度
假设content长度为m，keyword长度为n，则：

- next数组的构建时间复杂度为：$O(m)$
- 匹配单个keyword时间复杂度：$O(m+n)$
## BM算法
Boyer-Moore算法由Bob Boyer和J Strother Moore设计于1977年。一般情况下，比KMP算法快3-5倍。该算法常用于文本编辑器中的搜索匹配功能，比如大家所熟知的grep命令使用的就是该算法。
### 特点
优点：应用广泛，匹配时间快
缺点：代码复杂，不容易理解
### 演示
![bm算法.gif](/post/keyword-check/bm算法.gif)
### 代码解读
#### 坏字符规则
BM 算法是从后往前进行比较，我们来看一下具体过程，假设有原文为`"HERE IS A SIMPLE EXAMPLE"`，关键词为`"EXAMPLE`"：

![bm-1.png](/post/keyword-check/bm-1.png)

此时`"S"`与`"E"`不匹配，`"S"`就被称为 **"坏字符"** ，即不匹配的字符。我们还发现`"S"`不包含在关键词`"EXAMPLE"`之中，这意味着可以把关键词直接移到`"S"`的后一位。

![bm-2.png](/post/keyword-check/bm-2.png)

依然从尾部开始比较，发现`"P"`与`"E"`不匹配，所以`"P"`是 **"坏字符"** 。但是，`"P"`包含在搜索词`"EXAMPLE"`之中。所以将搜索词后移两位，两个`"P"`对齐。
因此不难得出 **"坏字符"** 的规则：`后移位数 = 坏字符的位置 - 搜索词中的上一次出现位置`
```java
// 坏字符规则表
private int[] buildBadCharacter(char[] keyword) {
    int m = keyword.length;
    final int CHARACTER_SIZE = 256; // 英文字符的种类，2^8
    int[] badChar = new int[CHARACTER_SIZE]; // 记录坏字符出现时后移位数

    // 默认后移整个模式串长度
    Arrays.fill(badChar, m);

    for (int i = 0; i < m - 1; i++) {
        int ascii = keyword[i];  // 当前字符对应的ASCII值
        badChar[ascii] = m - 1 - i;   // 对应的后移位数，若重复则以最右边为准
    }

    return badChar;
}
```
#### 好后缀规则

1. 依然从尾部开始比较，`"E"`与`"E"`匹配：

   ![bm-3.png](/post/keyword-check/bm-3.png)

2. 比较前面一位，`"LE"`与`"LE"`匹配：

   ![bm-4.png](/post/keyword-check/bm-4.png)

3. 比较前面一位，"PLE"与"PLE"匹配：

   ![bm-5.png](/post/keyword-check/bm-5.png)

4. 比较前面一位，"MPLE"与"MPLE"匹配：

   ![bm-6.png](/post/keyword-check/bm-6.png)

5. 我们把这种情况称为 **"好后缀"** ，`"MPLE"`、`"PLE"`、`"LE"`、`"E"`都是好后缀。
6. 所有的 **"好后缀"** 之中，只有`"E"`在`"EXAMPLE"`中还出现在头部，所以后移 6位：

   ![bm-7.png](/post/keyword-check/bm-7.png)

```java
// 好前缀规则表
private int[] buildGoodSuffix(char[] keyword) {
    int m = keyword.length;
    int[] goodSuffix = new int[m];   // 记录好后缀出现时后移位数
    int lastPrefixPos = m;   // 好后缀的首字符位置

    for (int i = m - 1; i >= 0; i--) {
        if (isPrefix(keyword, i + 1)) {
            //如果当前的位置存在前缀匹配，那么记录当前位置
            lastPrefixPos = i + 1;
        }
        // 如果是好后缀，则goodSuffix=m，否则依次为m+1、m+2、...
        goodSuffix[m - 1 - i] = lastPrefixPos - i - 1 + m;
    }

    for (int i = 0; i < m - 1; i++) {
        //计算出指定位置匹配的后缀的字符串长度
        int length = suffixLength(keyword, i);
        goodSuffix[length] = m - 1 - i + length;
    }

    return goodSuffix;
}

// 前缀匹配
private boolean isPrefix(char[] keyword, int start) {
    //这里j从关键词第一个字符开始，i从start位置开始，通过循环判断start之后的字符串是否匹配关键词前缀
    for (int i = start, j = 0; i < keyword.length; i++, j++) {
        if (keyword[i] != keyword[j]) {
            return false;
        }
    }
    return true;
}

// 后缀匹配
private int suffixLength(char[] keyword, int start) {
    int length = 0;

    int i = start;
    int j = keyword.length - 1;
    while (i >= 0 && keyword[i] == keyword[j]) {
        length++;
        i--;
        j--;
    }
    return length;
}
```
#### 匹配代码
```java
public int bm(char[] content, char[] keyword) {
    int n = content.length, m = keyword.length;

    if (n < m) {
        return -1;
    }
    if (m == 0) {
        return 0;
    }

    int[] badChar = buildBadCharacter(keyword);
    int[] goodSuffix = buildGoodSuffix(keyword);

    // 从尾部开始匹配
    for (int i = m - 1; i < n; ) {
        int j = m - 1;
        while (content[i] == keyword[j]) {
            if (j == 0) {
                // 匹配成功
                return i;
            }
            i--;
            j--;
        }
        // 每次后移"坏字符”和“好后缀” 
        i += Math.max(badChar[content[i]], goodSuffix[m - 1 - j]);
    }

    return -1;
}
```
### 时间复杂度
假设content长度为n，keyword长度为m，则：

- 匹配单个keyword平均时间复杂度为O(n)
- 最坏情况下的时间复杂度为O(m\*n)
## Sunday算法
Sunday算法借鉴了BM算法的坏字符规则，不过和BM算法不同的是，Sunday算法是从前往后匹配的。
### 特点
优点：代码简单容易理解，时间复杂度低
缺点：算法不稳定，最坏情况下时间复杂度和朴素算法一致
###  演示
![sunday算法.gif](/post/keyword-check/sunday算法.gif)
### 代码解读
Sunday算法**在匹配失败时重点关注的是关键词中参加匹配的最末位字符的下一位**：

- 如果该字符**没有在原文中出现则直接跳过**，即`移动位数 = 关键词长度 + 1`
- 否则，其`移动位数 = 原文长度 - 该字符最右出现的位置`
```java
public int sunday(char[] content, char[] keyword) {
    int n = content.length, m = keyword.length;
    if (n < m) {
        return -1;
    }
    if (m == 0) {
        return 0;
    }
    // 构造偏移表
    Map<Character, Integer> map = new HashMap<>();
    for (int i = 0; i < m; i++) {
        map.put(keyword[i], m - i);
    }

    for (int i = 0; i <= n - m; ) {
        int j = 0;
        while (j < m && content[i + j] == keyword[j]) {
            j++;
        }
        if (j == m) {
            return i;
        }
        if (i + m < n) {
            i += map.computeIfAbsent(content[i + m], key -> m + 1);
        } else {
            return -1;
        }
    }
    return -1;
}
```
### 时间复杂度
假设content长度为m，keyword长度为n，则：

- 匹配单个keyword平均时间复杂度：O(n/m)
- 匹配单个keyword最坏情况的时间复杂度为：O(m\*n)
## 总结
本文介绍了下常见几种关键词匹配算法，每种算法都有其适用的场景，比如朴素算法，因为代码简单，容易理解，因此被java的contains方法所采用；像关键词数量远大于原文的情况下，字段树就非常适合；如果关键词很小，而原文非常长，bm算法就非常适合。希望这边文章能对大家有所帮助。


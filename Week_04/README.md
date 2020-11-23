学习笔记
1 乔姆斯基谱系
乔姆斯基体系是计算机科学中刻画形式文法表达能力的一个分类谱系，是由语言学家诺姆·乔姆斯基于1956年提出的
文法	语言	            自动机	                产生式规则
0-型	递归可枚举语言	     图灵机	                α -> β（无限制）
1-型	上下文相关语言	     线性有界非确定图灵机	    αAβ -> αγβ
2-型	上下文无关语言	     非确定下推自动机	        A -> γ
3-型	正则语言	         有限状态自动机	            A -> aB
                                                     A -> a
自下而上为真包含关系
2 巴科斯范式(BNF: Backus-Naur Form 的缩写)是由 John Backus 和 Peter Naur 首先引入的用来描述计算机语言语法的符号集。现在，几乎每一位新编程语言书籍的作者都使用巴科斯范式来定义编程语言的语法规则。 

　　在BNF中，双引号中的字("word")代表着这些字符本身。而double_quote用来代表双引号。 

　　在双引号外的字（有可能有下划线）代表着语法部分。 

　　< > : 内包含的为必选项。 
　　[ ] : 内包含的为可选项。 
　　{ } : 内包含的为可重复0至无数次的项。 
　　|  : 表示在其左右两边任选一项，相当于"OR"的意思。 
　　::= : 是“被定义为”的意思 
　　"..." : 术语符号 
 　　[...] : 选项，最多出现一次 
　　{...} : 重复项，任意次数，包括 0 次 
　　(...) : 分组 
　　|   : 并列选项，只能选一个 
　　斜体字: 参数，在其它地方有解释 


    带括号的四则运算产生式：
        <BracketExpression>::=<Number>|"("<AddtiveExpression>")"
        <AddtiveExpression>::=<MultiplicativeExpression>|<AddtiveExpression>"+"<MultiplicativeExpression>|<AddtiveExpression>"-"<MultiplicativeExpression>

        <MultiplicativeExpression>::=<BracketExpression>|<MultiplicativeExpression>"*"<BracketExpression>|<MultiplicativeExpression>"/"<BracketExpression>
    常见语言的分类：
        形式语言-用途
            数据描述语言
            JSON、HTML，XAML，SQL、CSS、XML
            编程语言：
            C、C++、Java、C#、Python、Ruby、Perl、Lisp、T-SQL、Clojure、Haskell、JavaScript
        形式语言-表达方式
            声明式语言（只告诉这个结果是怎么样的）（声明式编程是一种编程范式，即构建计算机程序的结构和元素的一种风格，它表达了计算的逻辑而没有描述其控制流程。）
            JSON、HTML，XAML，SQL、CSS、XML、Lisp、Clojure、Haskell
            命令型语言（告诉你要达成这个结果过程是怎么样的）
            C、C++、Java、C#、Python、Ruby、Perl、JavaScript

    我们可以把对象分成几类。

4.对象的分类

宿主对象（host Objects）：由 JavaScript 宿主环境提供的对象，它们的行为完全由宿主环境决定。

内置对象（Built-in Objects）：由 JavaScript 语言提供的对象。  
　　　　固有对象（Intrinsic Objects ）：由标准规定，随着 JavaScript 运行时创建而自动创建的对象实例。

　　　　原生对象（Native Objects）：可以由用户通过 Array、RegExp 等内置构造器或者特殊语法创建的对象。

　　　　普通对象（Ordinary Objects）：由{}语法、Object 构造器或者 class 关键字定义类创建的对象，它能够被原型继承。




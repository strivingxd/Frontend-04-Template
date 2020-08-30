学习笔记
编程小技巧
1.两个数相互切换可以用两数之和减去当前数。
    1、2切换 3-1=2 3-2=1
2. Object.create(proto[, propertiesObject])
    该方法创建一个新对象，使用现有的对象来提供新创建的对象的_proto_.
    proto:新创建对象的原型对象。
    propertiesObject：要添加到新创建对象的不可枚举（默认）属性（即其自身定义的属性，而不是其原型链上的枚举属性）对象的属性描述符以及相应的属性名称。
    返回：一个新对象，带着指定的原型对象和属性。
3.element.addEventListener(type,fun,options)
    options{
        once:true;表示只执行一次
        capture:true,捕获阶段传播到该 EventTarget 时触发
        passive:true,listener 永远不会调用 preventDefault()。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告
    }
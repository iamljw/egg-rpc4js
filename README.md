# egg-rpc4js

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-rpc4js.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-rpc4js
[travis-image]: https://img.shields.io/travis/eggjs/egg-rpc4js.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-rpc4js
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-rpc4js.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-rpc4js?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-rpc4js.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-rpc4js
[snyk-image]: https://snyk.io/test/npm/egg-rpc4js/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-rpc4js
[download-image]: https://img.shields.io/npm/dm/egg-rpc4js.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-rpc4js

<!--
Description here.
-->

## 依赖说明

### 依赖的 egg 版本

egg-rpc4js 版本 | egg 1.x
--- | ---
1.x | 😁
0.x | ❌

### 依赖的插件
<!--

如果有依赖其它插件，请在这里特别说明。如

- security
- multipart

-->

## 安装插件

```bash
$ npm i egg-rpc4js
或者
$ yarn add egg-rpc4js
```

## 开启插件

```js
// config/plugin.js
exports.rpc4js = {
  enable: true,
  package: 'egg-rpc4js',
};
```

## 使用场景

- Why and What: 微服务架构一个主要的问题就是服务间通讯，传统的HttpClient方式性能低、过程复杂，因而采用[sofarpc的node版本](https://github.com/sofastack/sofa-rpc-node)替代传统方案，sofarpc实现了服务注册、发现、负载均衡、故障熔断等功能，本项目作为sofa-rpc-node的 egg 插件版本，帮助开发者更快的集成rpc功能。
- How: 本插件依赖 zookeeper 作为注册中心，应先在本地或服务器上部署 zookeeper，默认启动端口为 `2181`。

## 详细配置

```js
exports.rpc4js = {
    registry: {
        address: '127.0.0.1:2181' // zookeeper地址 根据实际情况配置
    },
    client: {
        services: [{
            namespace: 'account', // 服务命名空间
            modules: ['wallet', 'security'] // 选择消费该服务下的模块功能
        }],
        responseTimeout: 3000 // 响应超时（单位：ms）
    },
    server: {
        namespace: 'market', // 服务命名空间
        port: 12200 // 监听端口
    }
}
```

## 接口实现
rpc应用目录结构：
```js
egg-example
├── app
│   ├── controller // 普通接口实现目录
│   │   └── home.js
|   ├── rpc // RPC接口实现目录
|   |   └── m1.js
|   |   └── m2.js
│   └── router.js
├── config
│   └── config.default.js
└── package.json
```
实现类：
```js
// ${baseDir}/app/rpc/handler.js
'use strict';

class Handler {
    constructor(app, ctx) {
        this.app = app;
        this.ctx = ctx;
        this.getUser = this.getUser.bind(this); // 方法中需要引用上下文的务必加上
    }

    async getUser() {
        // ...
    }
    // ...
}

module.exports = Handler;
```

## 调用RPC服务

```js
// ...
await ctx.rpc.namespace.module.interfaceName(...args);
// 或者
await app.rpc.namespace.module.interfaceName(...args);
/**
 * 说明
 * namespace 为服务命名空间
 * module 为该服务提供的rpc模块
 * interfaceName 为该模块的接口
 * 
 * 请在使用中根据实际情况进行替换
 * /
```

## 单元测试

<!-- 描述如何在单元测试中使用此插件，例如 schedule 如何触发。无则省略。-->

## 提问交流

请到 [egg-rpc4js issues](https://github.com/iamljw/egg-rpc4js/issues) 异步交流。

## License

[MIT](LICENSE)

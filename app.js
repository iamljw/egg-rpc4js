'use strict';

const path = require('path');
const fs = require('fs');
const { RpcClient } = require('sofa-rpc-node').client;
const { RpcServer } = require('sofa-rpc-node').server;
const { ZookeeperRegistry } = require('sofa-rpc-node').registry;

class AppBootHook {
    constructor(app) {
        this.app = app;
    }

    async willReady() {
        const { app } = this;
        const { logger, config: { rpc4js: conf } } = app;
        app.rpc = {};
        // ------------ 创建 zk 注册中心客户端 ------------
        const registry = new ZookeeperRegistry({
            logger,
            address: conf.registry.address
        });
        // ------------ 创建 RPC Client 实例 ------------
        const client = new RpcClient({
            logger,
            registry
        });
        for (const elem of conf.client.services) {
            const { namespace, modules } = elem;
            app.rpc[namespace] = {};
            for (const mod of modules) {
                const interfaceName = `${namespace}.${mod}`;
                // ------------ 创建服务的 consumer ------------
                const consumer = client.createConsumer({
                    interfaceName
                });
                app.rpc[namespace][mod] = new Proxy({}, {
                    get: (target, key, receiver) => {
                        return async (...args) => await consumer.invoke(key, args, {
                            responseTimeout: conf.client.responseTimeout
                        });
                    }
                });
            }
        }
        // ------------ 发布服务 ------------
        if (conf.server) {
            const { namespace, port } = conf.server;
            // ------------ 创建 RPC Server 实例 ------------
            const server = new RpcServer({
                logger,
                registry,
                port
            });
            if (!fs.existsSync('app/rpc')) {
                fs.mkdirSync('app/rpc');
            }
            const classArr = fs.readdirSync('app/rpc').filter(fileName => fileName.endsWith('.js'));
            for (const cfn of classArr) {
                // ------------ 加载接口实现 ------------
                const HandlerClass = require(path.join(process.cwd(), path.join('/app/rpc/', cfn)));
                const handlerObj = new HandlerClass(app);

                const interfaceName = `${namespace}.${cfn.split('.')[0]}`;
                // ------------ 添加服务 ------------
                server.addService({
                    interfaceName
                }, handlerObj);
            }

            // ------------ 启动 Server 并发布服务 ------------
            server.start()
                .then(() => {
                    server.publish();
                });
        }
    }
}

module.exports = AppBootHook;

# n8n webhook to ai api

## 背景

使用n8n搭建完AI Agent工作流后，n8n提供的webhook api不具备通用性。不能作为业界常见的openai API格式去接入其他应用，所以需要开发一个应用来将n8n格式转换为标准的openai API格式

## 技术框架

1. 使用nuxt4作为基础框架，采用前后端分离的方式进行开发，不需要服务端渲染，ssr为false
2. tailwindcss实现页面样式，支持暗黑/明亮模式切换；支持移动端自适应。注意：通用组件需要封装，例如toast、confirm弹窗等
3. 使用 seald/nedb 作为数据存储方案
4. 使用jwt作为鉴权方案，需要实现管理员登录(不需要注册功能)

## 开发要求与实现

1. 管理员登录的默认用户名和密码admin，用户登录后可在设置中修改
2. 端口使用nuxt默认端口即可
3. OpenAI兼容API需要API Key认证，在key页面生成，支持生成多个
4. n8n webhook的sessionId使用uuid自动生成
5. 页面包含：n8n Hook管理（添加/编辑/删除webhook配置）、API Key管理、设置页面、日志
6. n8n Hook配置字段：是否启用、名称、模型名称（用于OpenAI API的model字段）、Webhook URL
7. 记录API调用日志，并且在前端显示，只需要保留500条
8. 日志记录字段: 调用IP 调用时间 使用的模型/Hook 请求内容（用户消息） 响应内容 响应时间/耗时 调用状态（成功/失败） 使用的API Key
9. API Key管理生成的key类似于openai key的格式：sk-xxxxxxxxxxxxxxxxxxx，生成后自动复制到剪贴板
10. 使用js开发，不需要ts
11. 页面简洁美观，配色合理

## API兼容具体实现

n8n hook api 对话示例
请求：
```js
fetch("https://8.555222.best/webhook/edca0f0a-77c3-43e5-8ece-e514a29446f5/chat", {
  "headers": {
    "accept": "text/plain",
    "accept-language": "zh-CN,zh;q=0.9",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-instance-id": "7d83025a1bd26c3ae5045af29cf582e259564d5a324e7343e98c2d6ea9f686a4"
  },
  "referrer": "https://8.555222.best/webhook/edca0f0a-77c3-43e5-8ece-e514a29446f5/chat",
  "body": "{\"action\":\"sendMessage\",\"sessionId\":\"1ccdeeb9-9295-407e-a7fa-76b47575cc09\",\"chatInput\":\"查询easynode作者主页\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
```

响应SSE：
```json
{
    "type": "begin",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836034476
    }
}{
    "type": "item",
    "content": "你好",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836036355
    }
}{
    "type": "item",
    "content": "！",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836036413
    }
}{
    "type": "item",
    "content": "我是",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836036413
    }
}{
    "type": "item",
    "content": "cha",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836036473
    }
}{
    "type": "item",
    "content": "os",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836036473
    }
}{
    "type": "item",
    "content": " AI",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836036533
    }
}{
    "type": "item",
    "content": "，",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836036533
    }
}{
    "type": "item",
    "content": "一个",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836036589
    }
}{
    "type": "item",
    "content": "智能",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836036648
    }
}{
    "type": "item",
    "content": "问答",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836036649
    }
}{
    "type": "item",
    "content": "助手",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836036709
    }
}{
    "type": "item",
    "content": "。",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836036710
    }
}{
    "type": "item",
    "content": "我是",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836036767
    }
}{
    "type": "item",
    "content": "由",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836036767
    }
}{
    "type": "item",
    "content": "cha",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836036826
    }
}{
    "type": "item",
    "content": "os",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836036827
    }
}{
    "type": "item",
    "content": "(",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836036896
    }
}{
    "type": "item",
    "content": "https",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836036897
    }
}{
    "type": "item",
    "content": "://",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836036943
    }
}{
    "type": "item",
    "content": "github",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836036944
    }
}{
    "type": "item",
    "content": ".com",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037002
    }
}{
    "type": "item",
    "content": "/",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037003
    }
}{
    "type": "item",
    "content": "cha",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037060
    }
}{
    "type": "item",
    "content": "os",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037061
    }
}{
    "type": "item",
    "content": "-z",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037118
    }
}{
    "type": "item",
    "content": "hu",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037119
    }
}{
    "type": "item",
    "content": "/e",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037177
    }
}{
    "type": "item",
    "content": "as",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037178
    }
}{
    "type": "item",
    "content": "yn",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037274
    }
}{
    "type": "item",
    "content": "ode",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037275
    }
}{
    "type": "item",
    "content": ")",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037312
    }
}{
    "type": "item",
    "content": "调试",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037313
    }
}{
    "type": "item",
    "content": "开发的",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037353
    }
}{
    "type": "item",
    "content": "，",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037354
    }
}{
    "type": "item",
    "content": "底层",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037413
    }
}{
    "type": "item",
    "content": "支持",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037413
    }
}{
    "type": "item",
    "content": "模型",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037474
    }
}{
    "type": "item",
    "content": "为",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037474
    }
}{
    "type": "item",
    "content": "deep",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037530
    }
}{
    "type": "item",
    "content": "Se",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037530
    }
}{
    "type": "item",
    "content": "ek",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037589
    }
}{
    "type": "item",
    "content": "3",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037590
    }
}{
    "type": "item",
    "content": ".",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037651
    }
}{
    "type": "item",
    "content": "2",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037707
    }
}{
    "type": "item",
    "content": "。\n\n",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037707
    }
}{
    "type": "item",
    "content": "我可以",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037765
    }
}{
    "type": "item",
    "content": "帮助你",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037825
    }
}{
    "type": "item",
    "content": "：\n",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037825
    }
}{
    "type": "item",
    "content": "-",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037826
    }
}{
    "type": "item",
    "content": " ",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037884
    }
}{
    "type": "item",
    "content": "回答",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037885
    }
}{
    "type": "item",
    "content": "各种",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836037942
    }
}{
    "type": "item",
    "content": "问题",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038012
    }
}{
    "type": "item",
    "content": "\n",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038013
    }
}{
    "type": "item",
    "content": "-",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038014
    }
}{
    "type": "item",
    "content": " ",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038059
    }
}{
    "type": "item",
    "content": "搜索",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038060
    }
}{
    "type": "item",
    "content": "网络",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038118
    }
}{
    "type": "item",
    "content": "信息",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038176
    }
}{
    "type": "item",
    "content": "\n",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038177
    }
}{
    "type": "item",
    "content": "-",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038178
    }
}{
    "type": "item",
    "content": " ",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038235
    }
}{
    "type": "item",
    "content": "获取",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038236
    }
}{
    "type": "item",
    "content": "网页",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038295
    }
}{
    "type": "item",
    "content": "内容",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038355
    }
}{
    "type": "item",
    "content": "\n",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038355
    }
}{
    "type": "item",
    "content": "-",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038356
    }
}{
    "type": "item",
    "content": " ",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038413
    }
}{
    "type": "item",
    "content": "提供",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038413
    }
}{
    "type": "item",
    "content": "技术",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038471
    }
}{
    "type": "item",
    "content": "咨询",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038530
    }
}{
    "type": "item",
    "content": "\n\n",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038530
    }
}{
    "type": "item",
    "content": "有什么",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038589
    }
}{
    "type": "item",
    "content": "我可以",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038590
    }
}{
    "type": "item",
    "content": "帮助",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038647
    }
}{
    "type": "item",
    "content": "你的",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038648
    }
}{
    "type": "item",
    "content": "吗",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038707
    }
}{
    "type": "item",
    "content": "？",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038708
    }
}{
    "type": "end",
    "metadata": {
        "nodeId": "44bfcdaf-9366-4791-a691-d9f1571f2e56",
        "nodeName": "Talk to Your Data",
        "itemIndex": 0,
        "runIndex": 0,
        "timestamp": 1766836038752
    }
}
```

需要转换为标准的openai api POST /v1/chat/completions

注意：未来可能需要兼容其他厂家的API格式，例如claude，实现功能时需注意可扩展性


由于会存在多个n8n hook api，所以需要一个数据库来保存这些hook api，并且可以给他们命名和定义模型名称。

同时支持openai API的 /v1/models 来获取这些模型列表

## 开发计划

### 第一阶段：项目基础搭建

1. **项目配置调整**
   - 修改 `nuxt.config.ts` 配置，关闭SSR
   - 配置 tailwindcss 支持暗黑/明亮模式
   - 添加必要的依赖包配置

2. **目录结构创建**
   ```
   server/
   ├── api/                    # API路由
   │   ├── auth/              # 认证相关
   │   │   └── login.post.js  # 登录接口
   │   ├── hooks/             # n8n Hook管理
   │   │   ├── index.get.js   # 获取列表
   │   │   ├── index.post.js  # 创建
   │   │   ├── [id].put.js    # 更新
   │   │   └── [id].delete.js # 删除
   │   ├── keys/              # API Key管理
   │   │   ├── index.get.js   # 获取列表
   │   │   ├── index.post.js  # 创建
   │   │   └── [id].delete.js # 删除
   │   ├── settings/          # 设置
   │   │   ├── index.get.js   # 获取设置
   │   │   └── index.put.js   # 更新设置
   │   ├── logs/              # 日志
   │   │   └── index.get.js   # 获取日志列表
   │   └── v1/                # OpenAI兼容API
   │       ├── models.get.js  # 模型列表
   │       └── chat/
   │           └── completions.post.js  # 对话补全
   ├── middleware/            # 中间件
   │   └── auth.js            # JWT认证中间件
   ├── utils/                 # 工具函数
   │   ├── db.js              # NeDB数据库封装
   │   ├── jwt.js             # JWT工具
   │   └── apiKey.js          # API Key生成工具
   └── plugins/               # 服务端插件
       └── init.js            # 初始化默认管理员

   pages/
   ├── index.vue              # 首页/仪表盘
   ├── login.vue              # 登录页
   ├── hooks.vue              # n8n Hook管理页
   ├── keys.vue               # API Key管理页
   ├── settings.vue           # 设置页
   └── logs.vue               # 日志页

   components/
   ├── layout/
   │   ├── Sidebar.vue        # 侧边栏导航
   │   ├── Header.vue         # 顶部栏
   │   └── ThemeToggle.vue    # 主题切换
   ├── ui/
   │   ├── Toast.vue          # Toast提示组件
   │   ├── Modal.vue          # 模态框组件
   │   ├── Confirm.vue        # 确认弹窗组件
   │   ├── Button.vue         # 按钮组件
   │   ├── Input.vue          # 输入框组件
   │   ├── Table.vue          # 表格组件
   │   └── Switch.vue         # 开关组件
   └── hooks/
       └── HookForm.vue       # Hook表单组件

   composables/
   ├── useAuth.js             # 认证状态管理
   ├── useToast.js            # Toast状态管理
   └── useTheme.js            # 主题状态管理

   data/                      # NeDB数据文件目录
   ├── admin.db               # 管理员数据
   ├── hooks.db               # Hook配置数据
   ├── keys.db                # API Key数据
   └── logs.db                # 日志数据
   ```

### 第二阶段：后端核心功能

3. **数据库模块实现**
   - 封装NeDB操作（增删改查）
   - 创建数据模型：Admin、Hook、ApiKey、Log

4. **认证模块实现**
   - JWT生成与验证工具
   - 登录API实现
   - 认证中间件实现
   - 初始化默认管理员（admin/admin）

5. **业务API实现**
   - n8n Hook CRUD API
   - API Key 生成与管理API
   - 设置（修改密码）API
   - 日志查询API（限制500条）

### 第三阶段：OpenAI兼容API

6. **模型列表API**
   - GET /v1/models
   - 返回所有启用的Hook作为模型

7. **对话补全API**
   - POST /v1/chat/completions
   - API Key认证
   - 根据model字段匹配Hook
   - 转发请求到n8n webhook
   - 解析n8n SSE响应
   - 转换为OpenAI SSE格式返回
   - 记录调用日志

### 第四阶段：前端页面

8. **通用组件开发**
   - Toast提示组件
   - Modal/Confirm弹窗组件
   - 表单组件（Input、Button、Switch等）
   - 表格组件
   - 布局组件（Sidebar、Header）
   - 主题切换组件

9. **页面开发**
   - 登录页面
   - n8n Hook管理页面（列表、添加、编辑、删除）
   - API Key管理页面（列表、生成、删除、复制）
   - 设置页面（修改密码）
   - 日志页面（列表展示、筛选）

### 第五阶段：优化与测试

10. **功能优化**
    - 移动端自适应
    - 暗黑/明亮模式完善
    - 错误处理优化
    - 用户体验优化

11. **测试验证**
    - API接口测试
    - 前端功能测试
    - OpenAI兼容性测试

## 数据模型设计

### Admin（管理员）
```js
{
  _id: String,           // 自动生成
  username: String,      // 用户名
  password: String,      // 密码（加密存储）
  createdAt: Date,       // 创建时间
  updatedAt: Date        // 更新时间
}
```

### Hook（n8n Webhook配置）
```js
{
  _id: String,           // 自动生成
  name: String,          // 名称
  modelName: String,     // 模型名称（用于OpenAI API的model字段）
  webhookUrl: String,    // n8n Webhook URL
  enabled: Boolean,      // 是否启用
  createdAt: Date,       // 创建时间
  updatedAt: Date        // 更新时间
}
```

### ApiKey（API密钥）
```js
{
  _id: String,           // 自动生成
  key: String,           // API Key (sk-xxxxxxxxxx格式)
  name: String,          // 名称/备注
  createdAt: Date,       // 创建时间
  lastUsedAt: Date       // 最后使用时间
}
```

### Log（调用日志）
```js
{
  _id: String,           // 自动生成
  ip: String,            // 调用IP
  timestamp: Date,       // 调用时间
  model: String,         // 使用的模型/Hook名称
  hookId: String,        // Hook ID
  request: String,       // 请求内容（用户消息）
  response: String,      // 响应内容
  duration: Number,      // 响应耗时（毫秒）
  status: String,        // 调用状态（success/failed）
  apiKeyId: String,      // 使用的API Key ID
  error: String          // 错误信息（如果失败）
}
```

## API接口设计

### 认证相关
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/auth/login | 管理员登录 | 否 |

### Hook管理
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/hooks | 获取Hook列表 | JWT |
| POST | /api/hooks | 创建Hook | JWT |
| PUT | /api/hooks/:id | 更新Hook | JWT |
| DELETE | /api/hooks/:id | 删除Hook | JWT |

### API Key管理
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/keys | 获取Key列表 | JWT |
| POST | /api/keys | 生成新Key | JWT |
| DELETE | /api/keys/:id | 删除Key | JWT |

### 设置
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/settings | 获取设置 | JWT |
| PUT | /api/settings | 更新设置（修改密码） | JWT |

### 日志
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/logs | 获取日志列表 | JWT |

### OpenAI兼容API
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /v1/models | 获取模型列表 | API Key |
| POST | /v1/chat/completions | 对话补全 | API Key |

## 依赖包

```json
{
  "dependencies": {
    "@seald-io/nedb": "^4.0.4",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "uuid": "^9.0.1"
  }
}
```
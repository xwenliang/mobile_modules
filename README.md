# mobile_modules
our commonly used modules based on fis-zoo

所有模块都需要用fis-zoo编译后才能查看demo，具体步骤（以countdown为例）：

1、安装fis-zoo ``npm install fis-zoo -g``

2、进入mobile_modules目录 执行 ``zoo release``

3、执行 ``zoo server start --type node --port 8080`` 打开fis-zoo提供的server

4、访问 ``http://127.0.0.1:8080/mobile_modules/modules/countdown/examples``
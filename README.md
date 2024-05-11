# 源码调试

## 文件内容

    - 1source  源码调试文件夹
      - react  react源码
      - demo  react源码调试demo

## 调试方案-准备工作

    1.切换react版本到 17.0.2
        git checkout v17.0.2
    2.安装依赖
        yarn
    3.生成依赖包
        yarn build react/index,react/jsx,react-dom/index,scheduler --type=NODE
    4.增加其他项目对生成包的引用
        cd build/node_modules/react
        # 申明react指向
        yarn link
        cd build/node_modules/react-dom
        # 申明react-dom指向
        yarn link
    4.5进入a-react-demo项目
        cd a-react-demo
    5.在项目中引用
        # 将项目内的react react-dom指向之前申明的包
        yarn link react react-dom
    6.启动a-react-demo项目
        yarn start
    注意：使用yarn安装的必须用yarn link；使用npm安装的使用npm link;

## 调试过程

    1.

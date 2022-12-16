# Riz PS
这是对于Rizline（律动轨迹）游戏港澳台版本的服务端重实现，不装了摊牌了，从名字就能看出来，PS = Private Server，这其实就是个律动轨迹的私服
# 开发计划
[√] 完整模拟雷霆SDK

[√] 账号登陆并去除区域、手机卡限制

[√] 正常存档/加载歌曲

[ ] 支持使用resources（将抓包下载到的歌曲assetbundle放入resources供用户下载，resources将由用户提供，Riz PS本体不提供

[ ] 内购全解锁（即使有了iOS也无缘）
# 如何使用
## Step 1: 克隆仓库并补全node_modules
Riz PS的运行依赖于npm、node、python3 以及python3的库mitmproxy（可以直接通过pip安装），请先安装好这些东西并配置好环境变量，再继续

使用以下命令克隆仓库：

`git clone https://github.com/Searchstars/RizPS`

不会有人的电脑没Git吧（小声bb

cd到克隆得到的文件夹里，然后用以下命令补全node_modules：

`npm install`
## Step 2：在你的设备上信任mitmproxy证书
### iOS
首先关闭所有占用8080端口的应用，然后安装http-server以共享文件：

`npm install -g http-server`

安装完成后，直接运行：

`http-server`

随后，在手机上的Safari浏览器中打开你电脑的ip加上端口8080（如192.168.1.7:8080），然后你就能得到一个文件列表。找到mitmproxy-ca-cert.cer，点一下，然后照着你平时信任描述文件的步骤去安装证书，安装完成后请不要忘记在设置 > 通用 > 关于本机 > 证书信任设置里开启这个新增的证书。

然后，大功告成！
### Android
由于本人没有安卓设备......等大佬们来补全罢！
## Step 3：启动私服
使用Ctrl+C结束掉刚才开的http-server，然后使用以下命令来开启Riz PS：

`node --tls-min-v1.2 index.js`

随后，你便能看到服务器输出的日志了，服务器成功启动了！
## Step 4：中转流量
再开一个命令行窗口（原来的那个不要关！！！）然后cd到原位。输入：

`mitmdump -s proxy.py -k`

来启动mitmproxy

然后，确保你手机跟电脑连的是同一个wifi，然后在手机上用你电脑的ip+8080端口来设置HTTP/HTTPS代理（具体方法自行百度），最后，启动Rizline，Enjoy it😊！
## 疑难解答
不行阿mitmdump那个窗口输出正常，node那个窗口没反应，进riz先更新错误100，然后网络错误10

> 在当前版本中，安装完成后进入首次rizline先不要在手机上开HTTP代理，裸连下载更新后，登陆账号时会弹出网络错误，这是正常的，退出游戏然后再打开HTTP代理，重开rizline

无法下载歌曲，进入歌曲点击开始一直未下载完成或卡加载

> 先使用拔卡+魔法大法下载完歌曲再使用私服，或等待私服更新支持resources（这应该不会太久）

能用fiddler classic代替mitmproxy吗？

> 不行，因为 fiddler.network.https> HTTPS handshake to 192.168.1.247 (for #96) failed. System.Security.Authentication.AuthenticationException 调用 SSPI 失败，请参见内部异常。 < 接收到的消息异常，或格式不正确。Win32 (SChannel) Native Error Code: 0x8009032615
## 特别感谢
特别感谢开源项目Grasscutters/Grasscutter提供的proxy.py及proxy_config.py，让我不用再大费周章写一个

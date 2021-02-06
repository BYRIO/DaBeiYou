# 排行榜后端

一个简单的后端排行榜demo

## 简要概述

1. 排行榜后端使用微信公众号提供的openid进行身份认证，使用 `md5(salt+openid)` 保证openid未被伪造。
2. 为了写起来快捷方便就用了`flask`与`sqlite`  ~~(其实是在摸鱼)~~
3. 使用 `score < 0` 代表被封禁，提交过于离谱的分数时自动封禁。
4. 为了避免排行榜重复计数，只保留个人最高分 ~~（因为懒得多写条件就直接把旧的删了）~~
5. 异常分数暂时只能人工封禁，前端加密未实现


## 使用

```bash
sqlite3 scores.db < scores.sql
python3 run.py
```

或 uwsgi 启动

```ini
[uwsgi]
socket=127.0.0.1:8080
listen=512
chdir = TODO
module  = run:app
processes = 4
threads = 2

stats=%(chdir)/uwsgi.status
daemonize=/var/log/uwsgi/name.log
pidfile=%(chdir)/uwsgi.pid
pid=www-data
uid=www-data
```

> PS: 其实第一次写的时候是没有做 `md5+salt` 防止伪造的，但是总有些调皮的同学乱玩，被迫加班补上
PPS: `salt`换过了，所以不用试着伪造openid了
import sqlite3
import json
import hashlib
from flask import Flask,request
from flask_api import status

app = Flask(__name__)

DATABASE = 'scores.db'

def get_db():
    db = getattr(Flask, '_database', None)
    if db is None:
        db = Flask._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(Flask, '_database', None)
    if db is not None:
        Flask._database = None
        db.close()

@app.route("/score", methods=['GET', 'POST'])
def get_score():
    if request.method == 'GET':
        con = get_db()
        cur = con.cursor()
        rres = cur.execute("SELECT name, score, img FROM SCORES ORDER BY score DESC LIMIT 20")
        res = []
        for i in rres:
            res.append(list(i))
        return json.dumps(res)
    else:
        msg = ""
        try:
            data = json.loads(request.get_data(as_text=True))
            if "name" not in data or "openid" not in data \
                or "score" not in data or "img" not in data \
                or "closeid" not in data:
                return "Need more param", status.HTTP_400_BAD_REQUEST

            md5 = hashlib.md5()
            md5.update("nM8qif$HBWL1w@Ur".encode("utf-8"))
            md5.update(data["openid"].encode("utf-8"))
            if md5.hexdigest() != data["closeid"]:
                return "错误的校验信息", status.HTTP_400_BAD_REQUEST

            if data["score"] > 100000:
                print("BAD TRY !", data["name"], data["openid"], data["score"])
                data["score"]=-1
                # return "分数异常，请重试",status.HTTP_500_INTERNAL_SERVER_ERROR

            con = get_db()
            cur = con.cursor()
            rres = cur.execute("SELECT score FROM SCORES  WHERE openid = ?", (data["openid"],) )
            for i in rres:
                if i[0] < 0:
                    return "YOU ARE IN BLACK LIST",status.HTTP_500_INTERNAL_SERVER_ERROR
                data["score"] = max(i[0], data["score"])
            cur.execute("DELETE FROM SCORES WHERE openid = ?", (data["openid"],) )
            cur.execute("INSERT INTO SCORES (name, openid, score, img) VALUES (?,?,?,?)",
                        (data["name"], data["openid"], data["score"], data["img"]))
            con.commit()
            return "分数提交成功",status.HTTP_201_CREATED
        except:
            con.rollback()
            return "系统异常",status.HTTP_500_INTERNAL_SERVER_ERROR

@app.route('/')
def hello_world():
    return('Hello, World!')

if __name__ == '__main__':
    app.run()
CREATE TABLE SCORES(
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    name           TEXT    ,
    openid       TEXT     NOT NULL,
    score        INTEGER,
    img          TEXT
);
CREATE INDEX score_index ON SCORES(score);
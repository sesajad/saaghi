
const sqlite = require('sqlite');

let db;

async function init() {
  db = await sqlite.open('data/sqlite.db');
  console.log('DB :: initiating db');
  if ((await db.get('PRAGMA user_version')).user_version == 0) {
    await db.run('CREATE TABLE IF NOT EXISTS reqs(id INT PRIMARY KEY, name TEXT)');
    await db.run('CREATE TABLE IF NOT EXISTS servs(id INT PRIMARY KEY, sry TEXT, valid DATE, number INT)');
    await db.run('PRAGMA user_version = 1');
  }
};

module.exports = {
  requests : {
    add : async function(id, name) {
      if (!db) await init();
      await db.run('INSERT INTO reqs(id, name) VALUES(?, ?)', [id, name]);
    },

    remove : async function(id) {
      if (!db) await init();
      await db.run('DELETE FROM reqs WHERE id = ?', [id]);
    },

    get : async function(id) {
      return await db.get('SELECT * FROM reqs WHERE id = ?', [id]);
    }
  },

  services : {
    add : async function(id, duration, password) {
      if (!db) await init();
      const ret = await db.get('SELECT (MIN(x.number) + 1) as m FROM servs AS x LEFT JOIN servs AS y ON x.number+1 = y.number WHERE y.number IS NULL');
      const number = (ret.m) ? ret.m : 0;
      await db.run('INSERT INTO servs(id, sry, valid, number) VALUES(?, ?, DATE(\'now\', ?), ?)', [id, password, duration, number]);
    },

    update : async function(id, duration) {
      if (!db) await init();
      await db.run('UPDATE servs SET valid = DATE(valid, ?) WHERE id = ?', [duration, id]);
    },

    get : async function(id) {
      if (!db) await init();
      return await db.get('SELECT * FROM servs WHERE id = ?', [id]);
    },

    remove : async function(id) {
      if (!db) await init();
      await db.run('DELETE FROM servs WHERE id = ?', [id]);
    },

    all : async function() {
      if (!db) await init();
      return await db.all('SELECT * FROM servs');
    }
  }
};

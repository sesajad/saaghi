const Telegraf = require('telegraf');
const bot = new Telegraf('682720905:AAE_quinvstBUSylFhHd1muiTzmwf3VdvSw');

const db = require('./db.js');

// TODO make it safe to use :)))
db.services.all().then(users => {
  console.log('u', users.map(x => x.id))
  users.map(x => x.id).forEach(id => {
    bot.telegram.sendMessage(id, process.argv[2]);
  });
});

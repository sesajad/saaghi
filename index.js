const config = require('./config.js');

const Telegraf = require('telegraf');
const bot = new Telegraf(config.bot_id);
const OWNER = config.owner;

const db = require('./db.js');

const services = [require('./services/shadowsocks-libev.js')]

bot.start((ctx) => ctx.reply('send a /request :)'));
bot.help((ctx) => ctx.reply('/request sends me a request\n'  +
  '/info gives you info about current service'));

bot.command('/request', async function(ctx) {
  try {
    await db.requests.add(ctx.from.id);
    ctx.reply('requested');
    ctx.telegram.sendMessage(OWNER, ctx.from.first_name + ' ' +
      ctx.from.last_name + ' (@' + ctx.from.username + ') requested\n ' +
      ['1d', '3d', '1w', '1m', '3m', '1y'].map(x => '/approve_' + ctx.from.id + '_' + x).join('\n') +
      '\n or /reject_' + ctx.from.id);
  } catch (err) {
    console.log('SAAGHI :: error on /request (bot) = ', err);
    ctx.reply('error 88912');
  }
});

bot.hears(/\/approve_(\d+)_(\d+)([wdmy])/, async function(ctx) {
  if (ctx.from.id == OWNER) {
    try {
      const id = ctx.match[1];
      const duration = '+' + ctx.match[2] + ' ' + ({d: 'day', m: 'month', w: 'week', y: 'year'})[ctx.match[3]]
      await db.requests.remove(id);
      if (await db.services.get(id)) {
        await db.services.update(id, duration);
      } else {
        const pass = (Math.random() + 1).toString(36).substring(2);
        await db.services.add(id, duration, pass);
      }
      ctx.reply('approved successfully');
      ctx.telegram.sendMessage(id, 'Your request approved, press /info for details. it takes up to an hour to be activated');
    } catch (err) {
      console.log('SAAGHI :: error on /approve (bot) = ', err);
      ctx.reply('error 12312')
    }
  }
});

bot.hears(/\/reject_(\d+)/, async function(ctx) {
  if (ctx.from.id == OWNER) {
    try {
      const id = ctx.match[1];
      await db.requests.remove(id);
      ctx.reply('rejected successfully');
    } catch (err) {
      console.log('SAAGHI :: error on /reject (bot) = ', err);
      ctx.reply('error 12312')
    }
  }

});

bot.command('/info', async function(ctx) {
  if (await db.requests.get(ctx.from.id)) {
    ctx.reply('you have a pending request');
  }
  const s = await db.services.get(ctx.from.id);
  if (s) {
    ctx.replyWithMarkdown(services.
      map(x => x.userInfo({'ip' : config.ip}, s)).join('\n\n') +
      'your service will be valid until *' + s.valid + '*');
/*    ctx.reply('beta\n' +
      'Protocol: L2TP\n' +
      'Username: dc' + s.id + '\n' +
      'Password: ' + s.sry);
    ctx.reply('beta\n' +
      'Protocol: OpenVPN\n' +
      'Profile: attached file\n' +
      'Username: dc' + s.id + '\n' +
      'Password: ' + s.sry);
    ctx.replyWithDocument({ source: 'OpenVPN.ovpn' }) */
  } else {
    ctx.reply('no active service');
  }
});

const cron = require('node-cron');

const warnerTask = cron.schedule('* 12 * * *', async function() {
  for (const r of await db.services.all()) {
    if (new Date(new Date().getTime() + 24 * 3 * 3600) > new Date(r.valid)) {
      bot.telegram.sendMessage(r.id, 'less than three days remaining from your ' +
        'service. please pay and then /request before your service ends');
    }
  }
});

controller = async function() {
  for (const r of await db.services.all()) {
    if (new Date() > new Date(r.valid)) {
      await db.services.remove(r.id);
      for (const service of services) {
        await service.remove(r)
      }
    } else {
      for (const service of services) {
        await service.add(r);
      }
    }
  }
};

controller();
const controllerTask = cron.schedule('0/5 * * * *', controller);

bot.startPolling()

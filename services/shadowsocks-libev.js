const unix = require('unix-dgram');
const fs = require('fs');
const { spawn } = require('child_process');

var process = null;
const MIN_PORT = 1085;

const BASE_CONFIG = {
  "port_password" : {},
  "mode": "tcp_and_udp",
  "method": "aes-128-cfb"
}

// TODO make this a class
function runManager() {
  if (process == null) {
    process = spawn('ss-manager', ['-u', '--manager-address', '/tmp/ss-manager.sock', '-c', './services/shadowsocks-libev/config.json']);
    process.stdout.on('data', function(data) {
      console.log('SS-MANAGER :: ', data.toString());
    });
  }
}

async function getCurrentStatus() {
  if (fs.existsSync('/tmp/ss-manager.sock')) {
    var buff = Buffer.from("ping\n", 'utf8');
    var client = unix.createSocket('unix_dgram', b => console.log("THEN " + b.toString()));

    var res = "";

    client.send(buff, 0, buff.length, '/tmp/ss-manager.sock');
    closing = new Promise((s, j) => {
      /*console.log('hiii');
      client.on("message", b => {
        console.log("SO " + b.toString());
        res += b.toString();
        if (res.endsWith("}"))
          s();
      });*/


    });

    //await closing;
    return res;
  }
}

function sendMessage(msg) {
  if (fs.existsSync('/tmp/ss-manager.sock')) {
    var buff = Buffer.from(msg, 'utf8');
    var client = unix.createSocket('unix_dgram');
    client.send(buff, 0, buff.length, '/tmp/ss-manager.sock');
    client.close();
  }
}

module.exports = {
  add : async function(info) {
    if (!fs.existsSync('./services/shadowsocks-libev/config.json')) {
      fs.writeFileSync('./services/shadowsocks-libev/config.json', JSON.stringify(BASE_CONFIG));
    }
    var c = JSON.parse(fs.readFileSync('./services/shadowsocks-libev/config.json').toString());
    c.port_password[(MIN_PORT + info.number).toString()] = info.sry;
    fs.writeFileSync('./services/shadowsocks-libev/config.json', JSON.stringify(c));

    runManager();
    //sendMessage("add: " + JSON.stringify({"server_port": MIN_PORT + info.number, "password":info.sry}));
  },

  remove : async function(info) {
    if (!fs.existsSync('./services/shadowsocks-libev/config.json')) {
      fs.writeFileSync('./services/shadowsocks-libev/config.json', JSON.stringify(BASE_CONFIG));
    }
    var c = JSON.parse(fs.readFileSync('./services/shadowsocks-libev/config.json').toString());
    delete c.port_password[info.port.toString()];
    fs.writeFileSync('./services/shadowsocks-libev/config.json', JSON.stringify(c));

    runManager();
    //sendMessage("remove: " + JSON.stringify({"server_port": MIN_PORT + info.number}));
  },

  userInfo : function(server, info) {
    const port = MIN_PORT + info.number;
    return 'Protocol: Shadowsocks\n' +
      'IP: ' + server.ip + '\n' +
      'PORT: `' + port  + '`\n' +
      'Password: `' + info.sry + '`\n' +
      'Encryption: AES-128-CFB\n' +
      'URI: `ss://' + Buffer.from('aes-128-cfb:' + info.sry + '@' + server.ip + ':' + port).toString('base64') + '#Gharb`\n';
  }
}

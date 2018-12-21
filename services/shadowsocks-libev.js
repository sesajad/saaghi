const fs = require('fs');
const { spawn } = require('child_process');

var process = null;
const MIN_PORT = 1085;

const BASE_CONFIG = {
  "port_password" : {},
  "mode": "tcp_and_udp",
  "method": "aes-128-cfb"
}

// init
if (!fs.existsSync('./services/shadowsocks-libev/config.json')) {
  fs.writeFileSync('./services/shadowsocks-libev/config.json', JSON.stringify(BASE_CONFIG));
}

function restart() {
  process.kill();
  if (!fs.existsSync('./services/shadowsocks-libev/config.json')) {
    fs.writeFileSync('./services/shadowsocks-libev/config.json', JSON.stringify(BASE_CONFIG));
  }

  process = spawn('ss-manager', ['-u', '--manager-address', '/tmp/ss-manager.sock', '-c', './services/shadowsocks-libev/config.json']);
  process.stdout.on('data', function(data) {
    console.log('SS-MANAGER :: ', data.toString());
  });
}

module.exports = {
  add : async function(info) {
    port = MIN_PORT + info.number;
    if (fs.existsSync('~/.shadowsocks/' + port + '.pid')) {
      return;
    }

    var c = JSON.parse(fs.readFileSync('./services/shadowsocks-libev/config.json').toString());
    c.port_password[(MIN_PORT + info.number).toString()] = info.sry;
    fs.writeFileSync('./services/shadowsocks-libev/config.json', JSON.stringify(c));

    restart();
  },

  remove : async function(info) {
    if (!fs.existsSync('~/.shadowsocks/' + port + '.pid')) {
      return;
    }

    var c = JSON.parse(fs.readFileSync('./services/shadowsocks-libev/config.json').toString());
    delete c.port_password[info.port.toString()];
    fs.writeFileSync('./services/shadowsocks-libev/config.json', JSON.stringify(c));

    restart();
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

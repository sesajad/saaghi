var fs = require('fs');

const Docker = require('dockerode');
const docker = new Docker();

CONTAINER = 'softether'
HPW = 'c1368c14c464eb24f'
CERT = 'MIIDpjCCAo6gAwIBAgIBADANBgkqhkiG9w0BAQsFADBSMRUwEwYDVQQDDAwwNDFmY2Uw' +
  'ZjMxN2YxFTATBgNVBAoMDDA0MWZjZTBmMzE3ZjEVMBMGA1UECwwMMDQxZmNlMGYzMTdmMQswC' +
  'QYDVQQGEwJVUzAeFw0xODEwMjAxOTMzMzFaFw0zNzEyMzExOTMzMzFaMFIxFTATBgNVBAMMDD' +
  'A0MWZjZTBmMzE3ZjEVMBMGA1UECgwMMDQxZmNlMGYzMTdmMRUwEwYDVQQLDAwwNDFmY2UwZjM' +
  'xN2YxCzAJBgNVBAYTAlVTMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApubG5Z8a' +
  'if9Do4yyc908SM2oXukpi9Jo1gsXpAdGjldyYDpdQlHh939h7GckBOOq+COgNeiaRdZW1O5R1' +
  '9tYh2YspigjqIcdoOtMNlKfN+f+W/3tvsyVLAu9UGplpRGqSe9tKtkpV7VbGy3KZweUjz7nyY' +
  'DJSSJ8hQ/pWHV0kll71fMV6h555/k5L2kEjU7agCJ8jY/zPN8CUjeL6zPANBv7YpPeBmD5Dp9' +
  'gl1KyvPHB9hHg6psRV1qdFY8A7yQVuqgEfm0mR056HLCozzQdsA4Joz+f/UctFKnixwy8TXlV' +
  'QMiPBosnuC2tpX8CBz2zZpSc7lX2d+CWT2H5mKljiwIDAQABo4GGMIGDMA8GA1UdEwEB/wQFM' +
  'AMBAf8wCwYDVR0PBAQDAgH2MGMGA1UdJQRcMFoGCCsGAQUFBwMBBggrBgEFBQcDAgYIKwYBBQ' +
  'UHAwMGCCsGAQUFBwMEBggrBgEFBQcDBQYIKwYBBQUHAwYGCCsGAQUFBwMHBggrBgEFBQcDCAY' +
  'IKwYBBQUHAwkwDQYJKoZIhvcNAQELBQADggEBAC3vm1ohz1AZzjZZKo03Ek4/vGcc3rnVLYmf' +
  'Rs+/fD2PHMBHx0H1tcaW158m0SHGtBirOsYVnX6QEKpVzSiw1Ja4Ulcicy7HZxiAhwWyH6t3J' +
  'rBVy5dztPRCANiFWgZYshUKVqaQKpMz4yLisUhKds5M9kSNkpoSItzR9YWi+xJdFMsoVl784F' +
  'VAp5zDKKcgaxYRpjflSdvCwXUPh95DkPrJVhVZZfjB1sJxzTL+MwoVXldeXsQ9rqzpGP2pCCg' +
  '6ankJ/OSlTGL1WQDfjt4IDwh7TSzc9SoWeWpS9nEqi3hotFv3j4q0DfegF3oEUBHXrI/Dyffx' +
  'KsMTOuu1gPEkhBI='
KEY = 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCm5sblnxqJ/0OjjLJz3' +
  'TxIzahe6SmL0mjWCxekB0aOV3JgOl1CUeH3f2HsZyQE46r4I6A16JpF1lbU7lHX21iHZiymKC' +
  'Oohx2g60w2Up835/5b/e2+zJUsC71QamWlEapJ720q2SlXtVsbLcpnB5SPPufJgMlJInyFD+l' +
  'YdXSSWXvV8xXqHnnn+TkvaQSNTtqAInyNj/M83wJSN4vrM8A0G/tik94GYPkOn2CXUrK88cH2' +
  'EeDqmxFXWp0VjwDvJBW6qAR+bSZHTnocsKjPNB2wDgmjP5/9Ry0UqeLHDLxNeVVAyI8Giye4L' +
  'a2lfwIHPbNmlJzuVfZ34JZPYfmYqWOLAgMBAAECggEAbLmn1kwIWN9ea7urQMldjTvUNEgGFZ' +
  'zzSISfWO6Yav/SdZdvy1VWNAnae8tQ7pJ1fQKQSq4FWftgQ4Qg8tJkYIgSDAfX+uBST9MYqca' +
  '3DA9oZvsLlqDliHT5VdqJ7reMTG/ZmPEw+n8dI5533RhWEd7z1hO8jJUXswMDiumxD+iHxbg1' +
  'SEH2EpYInADwgusjNutVWTKGefrRS9OfjvcDsICttaV7AgM+6fhb0QG698p393vaiU3yYeMhw' +
  'RS1CLpS35I/muI/XSwwn4N5xi2tmCM1bocs0Ym+Eetazv/F/Dr0lP46DUGFOyXOVrYy6AaOZa' +
  'HVhE268TjM9sjA6xDQIQKBgQDWHIn52lcLpVs7fRZpEGBIheAZ+2d3DryzMOJhOAggTmjjskt' +
  'fJiQqGnp/zMvQe4MLJKiZy9RhwSez8s77uQnaBZ7nNzRBplvjSZk0G+iDzgSv72EJuNVp6N/j' +
  '15Eo/CGjEWPoyqvoCqVKt2B+XX/mAxm16JqvkdCvu81Hm5ef2wKBgQDHjcsqxhVCvF2JHcXoO' +
  'TfCoA2/d+nA9fJqPdoAIO3h/cpeb96rQ3mKFDLZyo9BOlSKr39LzWjQ0bcNo9Laoo+3EdVmts' +
  '7puqHneHgN9LNCr5W4aOTknFjFrGzTtL7Xj8U4NW69qJTfrFC2wVwOfngnGqXMj1VIz9FAD87' +
  'QLM0yEQKBgQCxFGVgyR2YuiecKbYxKqQXFvHjSzOlGgEiyllQQoEmBvNk7f68MNVUJRYPQJeI' +
  'U75rpuPyXsvGFXP6teRN+BmXwXJMlDGZ4ja44hPdLv+8ktT5lSdSXRXURA93Zr/df7lqHmXdE' +
  'FHg1X0jMEqT+ExhNUs8UaYtcpF/5fi/MoXSZQKBgQDBVUjO6hZTD7f3Thcdg8HYF8T6Ca04u4' +
  '/fComYsk6GMqHLmMq8VqT799HEW5Eq+t5Jdvn3cMzp8yRMXLm+BN0D2o1L9DTHEYAmh/qYWsk' +
  'KBJ8jiMyqCCehbAoLmgODSNEkQfBGY3vIsGOKjA8qI7E5AYI8i2lvH5h1XltaKO2sYQKBgGVw' +
  'yzliFFwXydDMemJIWM9/7AqN2NuXs96jygzUYCsJWwfHvLKqlTeCLuCJ5iOpwcgVmr78gpr3u' +
  '5vbMzpJe2q48H7CNJhQJp0CCjbhXed4pGZivFCum2GHvOQDZyumsCPSNLE7Rj5S8ZiZe5TDgb' +
  'NuWKlemkyQAZmy5J8vo8om'


async function initiateContainer() {
  console.log('SOFTETHER :: init container');

  await docker.pull('siomiz/softethervpn');

  console.log('SOFTETHER :: pulling completed');

  const container = await docker.createContainer({
    name: CONTAINER,
    Image: 'siomiz/softethervpn',
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
    Env: [
      "PSK=AzghadiTheGreat",
      "SPW=0b67cb14f499e1b6",
      "HPW=" + HPW,
      "USERS=admin:c2fbb0e6224fd1af9",
      "CERT=" + CERT,
      "KEY=" + KEY,
    ],
    ExposedPorts: {
    '500/udp': {},
    '4500/udp': {},
    '1701/tcp': {},
    '1194/udp': {},
    '443/tcp': {},
    '5555/tcp': {},
    '992/tcp': {}
    },
    HostConfig: {
      RestartPolicy: {Name : 'always'},
      PortBindings: {
        '500/udp': [{ HostIP: '0.0.0.0', HostPort: '500' }],
        '4500/udp': [{ HostIP: '0.0.0.0', HostPort: '4500' }],
        '1701/tcp': [{ HostIP: '0.0.0.0', HostPort: '1701' }],
        '1194/udp': [{ HostIP: '0.0.0.0', HostPort: '1194' }],
        '443/tcp': [{ HostIP: '0.0.0.0', HostPort: '443' }],
        '5555/tcp': [{ HostIP: '0.0.0.0', HostPort: '5555' }],
        '992/tcp': [{ HostIP: '0.0.0.0', HostPort: '992' }]
      },
      CapAdd: ['NET_ADMIN']
    }
  });

  const stream = await container.attach({
    stream: true,
    stdout: true,
    stderr: true
  });

  await container.start();

  var stdout = '';
  const ovpnData = await new Promise((s, j) => {
    stream.on('data', async c => {
      stdout += c.toString();
      if (stdout.includes('# [initial setup OK]')) {
        s(stdout);
      }
    });
    stream.on('end', j);
  });

  console.log('SOFTETHER :: ovpn data catched');

  await fs.writeFile('OpenVPN.ovpn', ovpnData);

  console.log('SOFTETHER :: ovpn file is written');
}

async function execute(args) {
  console.log('SOFTETHER :: launching ' + args);

  const exec = await docker.getContainer(CONTAINER).
    exec({
      Cmd : ['/usr/bin/vpncmd', 'localhost', '/SERVER', '/CSV',
       '/HUB:DEFAULT', '/CMD'].concat(args),
      AttachStdin: true,
      AttachStderr: true,
      AttachStdout: true,
      Tty: true
    });

  const proc = await exec.start({
    Tty: true,
    stream: true,
    stdin: true,
    stdout: true,
    stderr: true
  });

  proc.stdout = '';
  proc.output.on('data', async c => {
    proc.stdout += c.toString();
    if (proc.stdout.endsWith(': ')) {
      await proc.output.write(HPW + '\n');
    }
  });

  await new Promise((s, j) =>
    proc.output.on('end', s)
  );
  console.log('SOFTETHER :: stdout: ' + proc.stdout);
  return proc.stdout;
}

module.exports = {
  add : async function(info) {
    const cs = await docker.listContainers();
    if (!cs.some(c => c.Names.some(n => n == '/' + CONTAINER))) {
      await initiateContainer();
    }
    await execute(['UserCreate' , ('dc' + info.id), '/GROUP:none',
      '/REALNAME:none', '/NOTE:none']);
    await execute(['UserPasswordSet' , ('dc' + info.id), ('/PASSWORD:' + info.sry)]);
  },

  remove : async function g(info) {
    const cs = await docker.listContainers();
    if (!cs.some(c => c.Names.some(n => n == '/' + CONTAINER))) {
      console.log('SOFTETHER :: WARN - what should i remove?')
    } else {
      await execute(['UserDelete' , ('dc' + info.id)]);
    }
  }
}

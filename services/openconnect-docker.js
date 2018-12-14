const {Readable} = require('stream');

Readable.prototype.toString = async function() {
  var chunks = [];
  this.on('data', c => chunks.push(c));
  return await new Promise((s, j) =>
    this.on('end', () => s(Buffer.concat(chunks).toString('utf8')))
  );
}

const Docker = require('dockerode');
const docker = new Docker();

CONTAINER = 'openconnect'

async function initiateContainer() {
  await docker.pull('tommylau/ocserv');
  await docker.run('tommylau/ocserv', null, null,
    {
      name: CONTAINER,
      ExposedPorts: {
      '443/tcp': {},
      '443/udp': {}
      },
      HostConfig: {
        RestartPolicy: {Name : 'always'},
        PortBindings: {
          '443/tcp': [{ HostIP: '0.0.0.0', HostPort: '443' }],
          '443/udp': [{ HostIP: '0.0.0.0', HostPort: '443' }]
        },
        Privileged: true
      }
    });
}

module.exports = {
  add : async function(info) {
    const cs = await docker.listContainers();
    if (!cs.some(c => c.Names.some(n => n == '/' + CONTAINER))) {
      await initiateContainer();
    }
    execRet = await docker.getContainer(CONTAINER).
      exec({Cmd : ['ocpasswd', ('dc' + info.id)], AttachStdin: true, AttachStderr: true, AttachStdout: true, Tty: true});
    procRet = await execRet.start({Tty: true, Detach: false, stream: true, stdin: true, stdout: true, stderr: true});
    console.log('started')
    procRet.stdout = '';
    procRet.output.on('data', async c => {
      procRet.stdout += c.toString();
      if (procRet.stdout.endsWith(': ')) {
        await procRet.output.write(info.sry + '\n');
      }
    });
    await new Promise((s, j) =>
      procRet.output.on('end', s)
    );
    console.log('ocwpasswd output : ' + procRet.stdout);
  },

  remove : async function g(info) {
    const cs = await docker.listContainers();
    if (!cs.some(c => c.Names.some(n => n == '/' + CONTAINER))) {
      console.log('what should i remove?')
    } else {
      execRet = await docker.getContainer(CONTAINER).
        exec({Cmd : ['ocpasswd', '-d',  ('dc' + info.id)]});
      console.log('starting start')
      procRet = await execRet.start({Detach : false});
      await new Promise((s, j) =>
        procRet.output.on('end', s)
      );
      console.log('removing done')
    }
  }
}

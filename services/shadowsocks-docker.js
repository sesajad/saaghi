
const Docker = require('dockerode');
const docker = new Docker();
const MIN_PORT = 1085;

module.exports = {
  add : async function(info) {
    const cs = await docker.listContainers();
    if (!cs.some(c => c.Names.some(n => n == '/dc' + info.id))) {

      var createConf = {
        name: 'dc' + info.id,
        Image: 'oddrationale/docker-shadowsocks',
        Cmd: ['-p', String(info.port), '-k', info.sry, '-m', 'aes-256-cfb'],
        ExposedPorts : {},
        HostConfig : {
          RestartPolicy : {
            Name : 'always'
          },
          PortBindings : {}
        }
      };
      createConf.ExposedPorts[String(info.port) + '/tcp'] = {};
      createConf.ExposedPorts[String(info.port) + '/udp'] = {};
      createConf.HostConfig.PortBindings[String(info.port) + '/tcp'] = [{ HostIP: '0.0.0.0', HostPort: String(info.port) }];
      createConf.HostConfig.PortBindings[String(info.port) + '/udp'] = [{ HostIP: '0.0.0.0', HostPort: String(info.port) }];

      const container = await docker.createContainer(createConf);
      await container.start();
      console.log('SHADOWSOCKS :: adding ', info);
    }
  },

  remove : async function(info) {
    const c = docker.getContainer('dc' + info.id)
    await c.kill();
    await c.remove();
  }
}

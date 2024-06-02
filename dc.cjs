const { exec } = require('child_process')

const args = process.argv.slice(2);

const PROD = 'prod'
const DEV = 'dev'

function main() {
  let cmd = null
  switch(args[0]){
    case PROD:
    case DEV:
        cmd = exec(`docker-compose -f docker-compose.${args[0]}.yml ${args[1]}`)
        cmd.stdout.pipe(process.stdout);
        cmd.stderr.pipe(process.stderr);
        break
  }
}

main();
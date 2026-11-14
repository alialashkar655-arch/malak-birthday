import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure System32 is present in PATH for Windows so cmd.exe can be spawned
const sysDirs = ['C:\\Windows\\System32', 'C:\\Windows', 'C:\\Windows\\System32\\Wbem'];
const currentPath = process.env.PATH || '';
const pathSeparator = path.delimiter;
const missingDirs = sysDirs.filter(d => !currentPath.toLowerCase().includes(d.toLowerCase()));
const updatedPath = [...missingDirs, currentPath].join(pathSeparator);

const env = { ...process.env, PATH: updatedPath };

console.log('✨ Starting Romantic Universe (Server + Client)...\n');

const isWin = process.platform === 'win32';
const shellCmd = isWin ? 'C:\\Windows\\System32\\cmd.exe' : 'sh';
const flag = isWin ? '/c' : '-c';

const server = spawn(shellCmd, [flag, 'npm --prefix server run dev'], {
  cwd: __dirname,
  env,
  stdio: 'inherit'
});

const client = spawn(shellCmd, [flag, 'npm --prefix client run dev'], {
  cwd: __dirname,
  env,
  stdio: 'inherit'
});

const cleanup = () => {
  try { server.kill(); } catch {}
  try { client.kill(); } catch {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
server.on('exit', (code) => { if (code && code !== 0) console.log(`Server exited with code ${code}`); });
client.on('exit', (code) => { if (code && code !== 0) console.log(`Client exited with code ${code}`); });

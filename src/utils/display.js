import chalk from 'chalk';

export const ORANGE = chalk.hex('#f5a623');
export const DIM = chalk.dim;
export const BOLD = chalk.bold;
export const GREEN = chalk.green;
export const RED = chalk.red;
export const CYAN = chalk.cyan;

export function banner() {
  console.log('');
  console.log(ORANGE('┌─────────────────────────────────────────┐'));
  console.log(ORANGE('│') + '  Welcome to UnconstrainED AI Setup  ✨  ' + ORANGE('│'));
  console.log(ORANGE('│') + '  Let\'s build your personal assistant.   ' + ORANGE('│'));
  console.log(ORANGE('└─────────────────────────────────────────┘'));
  console.log('');
}

export function section(title) {
  console.log('');
  console.log(ORANGE(`── ${title} ──`));
}

export function success(msg) {
  console.log(GREEN('✓ ') + msg);
}

export function info(msg) {
  console.log(CYAN('→ ') + msg);
}

export function warn(msg) {
  console.log(RED('✗ ') + msg);
}

export function completionBanner(config) {
  const { name, emoji, connections = [], command } = config;

  const lines = [];
  lines.push('');
  lines.push(GREEN('┌─────────────────────────────────────────┐'));
  lines.push(GREEN('│') + BOLD(`  ${emoji}  ${name} is ready!`) + ' '.repeat(Math.max(0, 38 - name.length - emoji.length - 4)) + GREEN('│'));
  lines.push(GREEN('│') + ' '.repeat(41) + GREEN('│'));

  if (connections.length > 0) {
    lines.push(GREEN('│') + '  Connections:' + ' '.repeat(27) + GREEN('│'));
    for (const conn of connections) {
      const line = `    • ${conn}`;
      lines.push(GREEN('│') + line + ' '.repeat(Math.max(0, 41 - line.length)) + GREEN('│'));
    }
    lines.push(GREEN('│') + ' '.repeat(41) + GREEN('│'));
  }

  if (command) {
    const cmdLine = `  Run: ${command}`;
    lines.push(GREEN('│') + CYAN(cmdLine) + ' '.repeat(Math.max(0, 41 - cmdLine.length)) + GREEN('│'));
  }

  lines.push(GREEN('└─────────────────────────────────────────┘'));
  lines.push('');

  console.log(lines.join('\n'));
}

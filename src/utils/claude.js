import { spawn } from "child_process";
import ora from "ora";

function runSingleCommand(command, { cwd } = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn("claude", ["-p", command], {
      cwd: cwd || process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
      shell: true,
      timeout: 60000,
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(stderr || `Process exited with code ${code}`));
      }
    });

    proc.on("error", (err) => {
      reject(err);
    });
  });
}

export async function runClaudeCommands(commands, { cwd } = {}) {
  const results = [];

  for (const cmd of commands) {
    const spinner = ora(`Running: ${cmd}`).start();
    try {
      const output = await runSingleCommand(cmd, { cwd });
      spinner.succeed(`Done: ${cmd}`);
      results.push({ cmd, success: true, output });
    } catch (err) {
      spinner.fail(`Failed: ${cmd}`);
      results.push({ cmd, success: false, error: err.message });
    }
  }

  return results;
}

export function launchClaude({ cwd, channels = true } = {}) {
  const args = channels
    ? ["--channels", "plugin:telegram@claude-plugins-official"]
    : [];
  return spawn("claude", args, {
    cwd: cwd || process.cwd(),
    stdio: "inherit",
    shell: true,
  });
}

export async function checkClaudeAuth() {
  try {
    await runSingleCommand("echo ok");
    return true;
  } catch {
    return false;
  }
}

import { spawn } from "node:child_process";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Usage: node scripts/with-system-certs.mjs <command> [...args]");
  process.exit(1);
}

const env = { ...process.env };
delete env.SSL_CERT_FILE;
delete env.SSL_CERT_DIR;
delete env.NODE_EXTRA_CA_CERTS;
delete env.CURL_CA_BUNDLE;

const child = spawn(args[0], args.slice(1), {
  stdio: "inherit",
  env,
  shell: false,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

child.on("error", (error) => {
  console.error(error.message);
  process.exit(1);
});

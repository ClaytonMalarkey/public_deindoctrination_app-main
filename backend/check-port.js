const { exec } = require('child_process');

const checkPort = (port) => {
  return new Promise((resolve) => {
    exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
      if (error || !stdout) {
        resolve({ available: true, port });
      } else {
        const lines = stdout.trim().split('\n');
        const processes = lines.map(line => {
          const parts = line.trim().split(/\s+/);
          return {
            protocol: parts[0],
            localAddress: parts[1],
            foreignAddress: parts[2],
            state: parts[3],
            pid: parts[4]
          };
        });
        resolve({ available: false, port, processes });
      }
    });
  });
};

const killProcess = (pid) => {
  return new Promise((resolve) => {
    exec(`taskkill /PID ${pid} /F`, (error, stdout) => {
      if (error) {
        resolve({ success: false, error: error.message });
      } else {
        resolve({ success: true, message: stdout });
      }
    });
  });
};

const main = async () => {
  const port = process.argv[2] || 5000;
  console.log(`🔍 Checking port ${port}...`);
  
  const result = await checkPort(port);
  
  if (result.available) {
    console.log(`✅ Port ${port} is available!`);
  } else {
    console.log(`❌ Port ${port} is in use by:`);
    result.processes.forEach((proc, index) => {
      console.log(`   ${index + 1}. PID ${proc.pid} - ${proc.protocol} ${proc.localAddress} (${proc.state})`);
    });
    
    // Ask if user wants to kill the processes
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('Do you want to kill these processes? (y/N): ', async (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        const uniquePids = [...new Set(result.processes.map(p => p.pid))];
        
        for (const pid of uniquePids) {
          console.log(`🔪 Killing process ${pid}...`);
          const killResult = await killProcess(pid);
          if (killResult.success) {
            console.log(`✅ Process ${pid} killed successfully`);
          } else {
            console.log(`❌ Failed to kill process ${pid}: ${killResult.error}`);
          }
        }
        
        // Check again
        const recheckResult = await checkPort(port);
        if (recheckResult.available) {
          console.log(`✅ Port ${port} is now available!`);
        } else {
          console.log(`❌ Port ${port} is still in use`);
        }
      }
      rl.close();
    });
  }
};

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkPort, killProcess };
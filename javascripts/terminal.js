import files from '/json/filetree.json' assert { type: 'json' };
let userInput, terminalOutput , curDir;
let lastCommands = [];

var click = new Audio('/audio/key_click.mp3');

let startDirectory = "C:/";
let directory = startDirectory;

let filePath = [];

let dirConsole = directory + ">"

const app = () => {
  userInput = document.getElementById("userInput");
  terminalOutput = document.getElementById("terminalOutput");
  curDir = document.getElementById("directory");
  curDir.innerHTML = dirConsole;
  document.getElementById("keyboard").focus();
};

const execute = function executeCommand(command) {
  let args = command.split(" ");
  let input = args[0].toLowerCase();
  lastCommands.push(input);
  let output, res;
  output = `<div>${directory}>${command}</div>`;
  terminalOutput.innerHTML = `${terminalOutput.innerHTML}${output}`;
  if (input.length === 0) {
    return;
  }
  if (input.indexOf("sudo") >= 0) {
    input = "sudo";
  }

  if (input == "home") {
    open("/");
  } else if (input === "cd" || input === "cd..") {
    if(args.length == 1) {
      changeDirectory(args[0], null, null, directory);
    }
    if(args.length == 2) {
      changeDirectory(args[0], args[1], null, directory);
    }
    if(args.length == 3) {
      changeDirectory(args[0], args[1], args[2], directory);
    }
  } else if (input === "cat") {
    if(args.length == 2) {
      openFile(args[1], null, directory);
    }
    if(args.length == 3) {
      openFile(args[1], args[2], directory);
    }
  } else if (input === "ls") {
    showFiles(directory);
  } else if (input === "history") {
    showHist();
  } else if (input === "github") {
    open("https://github.com/TankadiN");
  } else {
    if (!COMMANDS.hasOwnProperty(input)) {
      res = `<div>command not found: ${args[0]}</div>`;
    } else {
      res = COMMANDS[input];
    }
    terminalOutput.innerHTML = `${terminalOutput.innerHTML} ${res}`;
  }
};

const key = (e) => {
  const input = userInput.innerHTML;

  click.play()

  if (e.key === "Enter") {
    execute(input);
    userInput.innerHTML = "";
    return;
  }

  userInput.innerHTML = input + e.key;
};

const backspace = (e) => {
  if (e.keyCode !== 8 && e.keyCode !== 46) {
    return;
  }
  userInput.innerHTML = userInput.innerHTML.slice(
    0,
    userInput.innerHTML.length - 1
  );
};

function showHist() {
  terminalOutput.innerHTML = `${
    terminalOutput.innerHTML
  }<div>Last commands:</div><div>${lastCommands.join(", ")}</div>`;
}

function changeDirectory(action, loc, pass, dir) {
  if(action === "cd") {
    if(hasValueDeep(files[dir], loc)) {
      var index = files[dir].findIndex(item => item.name === loc);
      if(index != -1) {
        filePath.push(directory);
        updateDirectory(files[dir][index].path); 
        return;
      }
    }
    terminalOutput.innerHTML = `${
      terminalOutput.innerHTML
    }<div class="red">ERROR: Folder '${loc}' not found.</div>`;
    return;
  }
  if(action === "cd..") {
    if(filePath.length == 0) {

    }
    else {
      updateDirectory(filePath.pop());
    }

  }
}

function openFile(file, pass, dir) {
  if(hasValueDeep(files[dir], file)) {
    var index = files[dir].findIndex(item => item.name === file);
    if(index != -1) {
      if(files[dir][index].type === "file") {
        if(files[dir][index].hasOwnProperty("password")) {
          if(pass === null) {
            terminalOutput.innerHTML = `${
              terminalOutput.innerHTML
            }<div class="red">ERROR: File encrypted. Decrypt it using a password.</div>
            <div class="green">Usage: cat ${files[dir][index].name} &lt;PASSWORD&gt;</div>`;
            return;
          }
          if(files[dir][index].password === pass) {
            terminalOutput.innerHTML = `${
              terminalOutput.innerHTML
            }${files[dir][index].content}`;
            return;
          }
          else {
            terminalOutput.innerHTML = `${
              terminalOutput.innerHTML
            }<div class="red">ERROR: Invalid password.</div>`;
            return;
          }
        }
        terminalOutput.innerHTML = `${
          terminalOutput.innerHTML
        }${files[dir][index].content}`;
        return;
      }
    }
    terminalOutput.innerHTML = `${
      terminalOutput.innerHTML
    }<div class="red">ERROR: Cannot open '${file}' (Invalid file type.)</div>`;
    return;
  }
  terminalOutput.innerHTML = `${
    terminalOutput.innerHTML
  }<div class="red">ERROR: File '${file}' not found.</div>`;
  return;
}

function updateDirectory(loc) {
  directory = loc;
  dirConsole = directory + ">";
  curDir.innerHTML = `${dirConsole}`;
  console.log(filePath);
}

function showFiles(dir) {
  console.log(dir);
  for(var i = 0; i < files[dir].length; i++) {
    console.log(files[dir][i].name);
    terminalOutput.innerHTML = `${
      terminalOutput.innerHTML
    }<div style="display: flex"><div style="width: 10vw">${files[dir][i].name}</div><div style="width: 5vw">${files[dir][i].type.toUpperCase()}</div><div>${files[dir][i].size}</div></div>`;
  }
}

function hasValueDeep(json, findValue) {
  const values = Object.values(json);
  let hasValue = values.includes(findValue);
  values.forEach(function(value) {
      if (typeof value === "object") {
          hasValue = hasValue || hasValueDeep(value, findValue);
      }
  })
  return hasValue;
}

let iter = 0;
const up = (e) => {
  if (e.key === "ArrowUp") {
    if (lastCommands.length > 0 && iter < lastCommands.length) {
      iter += 1;
      userInput.innerHTML = lastCommands[lastCommands.length - iter];
    }
  }

  if (e.key === "ArrowDown") {
    if (lastCommands.length > 0 && iter > 1) {
      iter -= 1;
      userInput.innerHTML = lastCommands[lastCommands.length - iter];
    }
  }
};

document.addEventListener("keydown", up);

document.addEventListener("keydown", backspace);
document.addEventListener("keypress", key);
document.addEventListener("DOMContentLoaded", app);

var audio = new Audio('/audio/mystery.mp3');
audio.volume = 0.1;
audio.loop = true;

let ascii = String.raw`__          __   _  __  ____   _____ 
\ \        / /  | |/ _|/ __ \ / ____|
 \ \  /\  / /__ | | |_| |  | | (___  
  \ \/  \/ / _ \| |  _| |  | |\___ \ 
   \  /\  / (_) | | | | |__| |____) |
    \/  \/ \___/|_|_|  \____/|_____/ `;
class Terminal extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=VT323">
    <script src="https://kit.fontawesome.com/3f2db6afb6.js" crossorigin="anonymous"></script>
        <div class="wrapper" style="height: 723px; width: 50%; opacity: 1;">
            <div class="overlay-wrapper1"></div>
            <div class="wrapper-padding" onclick="document.getElementById('dummyKeyboard').focus();">
                <div class="text" id="terminalOutput">
                    <pre class="ascii">
`+ ascii +`<span style="font-size: 1.2vw;">0.0.1</span>
                        </pre>
                    <div>Type <span class="green">help</span> for a list of commands.</br></div>
                </div>
                <div class="user-text">
                <div class="user-display">
                    <div id="directory"></div>
                    <div class="user-input" id="userInput"></div>
                    <div class="blinking">_</div>
                    <input type="text" id="keyboard" class="dummy-keyboard" />
                </div>
                </div>
            </div>
        </div>
    </div>
  `
  }
}


$(".overlay-text").on('click',function(){
  $(".overlay-text").css({"pointer-events": "none"});
  $( ".overlay-text-inner" ).animate({
     opacity: 0,
   }, 1000, function() {
     // Animation complete.
     audio.play();
     $( ".overlay-text" ).animate({
        opacity: 0
      }, 3000, function() {
        // Animation complete.
      });
   });
});

customElements.define("terminal-js", Terminal);
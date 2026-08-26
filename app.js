(() => {
  "use strict";

  const STORAGE_KEY = "command-line-beginner-simulator-progress";
  const COMMANDS = [
    "pwd",
    "ls",
    "cd",
    "mkdir",
    "touch",
    "cat",
    "echo",
    "cp",
    "mv",
    "rm",
    "grep",
    "clear",
    "help",
  ];

  const COMMAND_DESCRIPTIONS = {
    pwd: "今いる場所",
    ls: "中身を見る",
    cd: "移動",
    mkdir: "フォルダ作成",
    touch: "ファイル作成",
    cat: "中身表示",
    echo: "文字を出す・書く",
    cp: "コピー",
    mv: "移動・名前変更",
    rm: "削除",
    grep: "文字検索",
    clear: "画面を消す",
    help: "ヘルプ",
  };

  const LESSONS = [
    {
      slug: "pwd",
      title: "今いる場所を知る",
      explanation: "pwd は、ターミナルが今どのフォルダを見ているかを表示します。",
      task: "pwd",
      suggestions: ["pwd"],
      validate: (command) => command === "pwd",
    },
    {
      slug: "ls",
      title: "中身を見る",
      explanation: "ls は、今いるフォルダにあるファイルやフォルダを一覧で表示します。",
      task: "ls",
      suggestions: ["ls"],
      validate: (command) => command === "ls",
    },
    {
      slug: "mkdir",
      title: "フォルダを作る",
      explanation: "mkdir の後ろに名前を続けると、新しいフォルダを作成できます。",
      task: "mkdir projects",
      suggestions: ["mkdir projects"],
      validate: (command) => command === "mkdir projects",
    },
    {
      slug: "cd",
      title: "フォルダへ移動する",
      explanation: "cd は作業するフォルダを切り替えるコマンドです。移動後の入力位置も変わります。",
      task: "cd projects",
      suggestions: ["cd projects", "pwd"],
      validate: (command) => command === "cd projects",
    },
    {
      slug: "touch",
      title: "ファイルを作る",
      explanation: "touch を使うと、指定した名前の空ファイルを作成できます。",
      task: "touch note.txt",
      suggestions: ["touch note.txt", "ls"],
      validate: (command) => command === "touch note.txt",
    },
    {
      slug: "redirect",
      title: "ファイルへ文字を書く",
      explanation: "echo の出力を > でつなぐと、表示する代わりにファイルへ保存できます。",
      task: "echo こんにちは > note.txt",
      suggestions: ["echo こんにちは > note.txt"],
      validate: (command) => /^echo\s+こんにちは\s*>\s*note\.txt$/.test(command),
    },
    {
      slug: "cat",
      title: "ファイルを読む",
      explanation: "cat は、テキストファイルの中身をターミナルへ表示します。",
      task: "cat note.txt",
      suggestions: ["cat note.txt"],
      validate: (command) => command === "cat note.txt",
    },
    {
      slug: "cp",
      title: "ファイルをコピーする",
      explanation: "cp は、元のファイルを残したまま別の名前で複製します。",
      task: "cp note.txt backup.txt",
      suggestions: ["cp note.txt backup.txt", "ls"],
      validate: (command) => command === "cp note.txt backup.txt",
    },
    {
      slug: "mv",
      title: "名前を変更する",
      explanation: "mv はファイルの移動と名前変更に使います。ここでは backup.txt の名前を変えます。",
      task: "mv backup.txt memo.txt",
      suggestions: ["mv backup.txt memo.txt", "ls"],
      validate: (command) => command === "mv backup.txt memo.txt",
    },
    {
      slug: "rm",
      title: "ファイルを削除する",
      explanation: "rm はファイルを削除します。実機では元に戻せないことがあるため、対象をよく確認します。",
      task: "rm memo.txt",
      suggestions: ["rm memo.txt", "ls"],
      validate: (command) => command === "rm memo.txt",
    },
    {
      slug: "parent",
      title: "ひとつ上へ戻る",
      explanation: ".. は、今いるフォルダのひとつ上を表す特別な書き方です。",
      task: "cd ..",
      suggestions: ["cd ..", "pwd"],
      validate: (command) => command === "cd ..",
    },
    {
      slug: "hidden",
      title: "隠しファイルを見る",
      explanation: "-a オプションを付けると、名前が . で始まる隠しファイルも表示できます。",
      task: "ls -a",
      suggestions: ["ls -a"],
      validate: (command) => command === "ls -a",
    },
    {
      slug: "paths",
      title: "パスを理解する",
      explanation: "/ から始まる絶対パス、現在地を基準にした相対パス、ホームを表す ~ を使い分けます。",
      task: "cd /home/user/projects",
      suggestions: ["cd /home/user/projects", "pwd"],
      validate: (command) => command === "cd /home/user/projects",
    },
    {
      slug: "help",
      title: "ヘルプで調べる",
      explanation: "多くのコマンドは --help を付けると、使い方の手がかりを確認できます。",
      task: "ls --help",
      suggestions: ["ls --help"],
      validate: (command) => command === "ls --help",
    },
    {
      slug: "quotes",
      title: "スペースを含む名前",
      explanation: "スペースを含む名前は、ひとつの名前だと伝わるよう引用符で囲みます。",
      task: 'touch "my notes.txt"',
      suggestions: ['touch "my notes.txt"', "ls"],
      validate: (command) => /^touch\s+(["'])my notes\.txt\1$/.test(command),
    },
    {
      slug: "append",
      title: "文字を追記する",
      explanation: "> は上書き、>> は今ある内容を残したまま末尾へ追記します。",
      task: "echo 追加メモ >> note.txt",
      suggestions: ["echo 追加メモ >> note.txt", "cat note.txt"],
      validate: (command) => /^echo\s+追加メモ\s*>>\s*note\.txt$/.test(command),
    },
    {
      slug: "grep",
      title: "文字を探す",
      explanation: "grep は、指定した文字を含む行だけを見つけて表示します。",
      task: "grep 追加 note.txt",
      suggestions: ["grep 追加 note.txt"],
      validate: (command) => command === "grep 追加 note.txt",
    },
    {
      slug: "pipe",
      title: "コマンドをつなぐ",
      explanation: "| は左側のコマンドの出力を、右側のコマンドへ入力として渡します。",
      task: "cat note.txt | grep こんにちは",
      suggestions: ["cat note.txt | grep こんにちは"],
      validate: (command) => /^cat\s+note\.txt\s*\|\s*grep\s+こんにちは$/.test(command),
    },
    {
      slug: "practice",
      title: "総合演習",
      explanation: "最後は入力候補を使わず、ここまでの基本操作を組み合わせて完成させます。",
      task: "projects の中に practice を作って移動し、result.txt に「できた」と保存。cat result.txt で確認してください。",
      suggestions: [],
      validate: (command) =>
        command === "cat result.txt" &&
        currentWorkingDirectory() === "/home/user/projects/practice" &&
        getNode(["home", "user", "projects", "practice"])?.children?.["result.txt"]?.content === "できた",
    },
  ];

  const elements = {
    lessonPath: document.getElementById("lessonPath"),
    currentStep: document.getElementById("currentStep"),
    totalSteps: document.getElementById("totalSteps"),
    progressTrack: document.getElementById("progressTrack"),
    progressBar: document.getElementById("progressBar"),
    lessonRail: document.getElementById("lessonRail"),
    lessonTitle: document.getElementById("lessonTitle"),
    explain: document.getElementById("explain"),
    hint: document.getElementById("hint"),
    chips: document.getElementById("chips"),
    retryStep: document.getElementById("retryStep"),
    restartCourse: document.getElementById("restartCourse"),
    terminalPath: document.getElementById("terminalPath"),
    promptPath: document.getElementById("promptPath"),
    screen: document.getElementById("screen"),
    commandForm: document.getElementById("commandForm"),
    input: document.getElementById("input"),
    completeInput: document.getElementById("completeInput"),
    historyPrev: document.getElementById("historyPrev"),
    historyNext: document.getElementById("historyNext"),
    commandGrid: document.getElementById("commandGrid"),
  };

  function createFileSystem() {
    return {
      type: "dir",
      children: {
        home: {
          type: "dir",
          children: {
            user: {
              type: "dir",
              children: {
                welcome: { type: "file", content: "コマンドライン練習へようこそ！" },
                ".profile": { type: "file", content: "これは隠し設定ファイルの例です" },
              },
            },
          },
        },
      },
    };
  }

  let virtualFs = createFileSystem();
  let currentPath = ["home", "user"];
  let lessonIndex = 0;
  let lessonSnapshot = null;
  let commandHistory = [];
  let historyIndex = 0;

  function getNode(pathParts) {
    let current = virtualFs;
    for (const part of pathParts) {
      if (!current.children?.[part]) return null;
      current = current.children[part];
    }
    return current;
  }

  function resolvePath(target, base = currentPath) {
    let input = String(target ?? "");
    let resolved;

    if (input === "~") {
      resolved = ["home", "user"];
      input = "";
    } else if (input.startsWith("~/")) {
      resolved = ["home", "user"];
      input = input.slice(2);
    } else if (input.startsWith("/")) {
      resolved = [];
      input = input.slice(1);
    } else {
      resolved = [...base];
    }

    for (const part of input.split("/")) {
      if (!part || part === ".") continue;
      if (part === "..") resolved.pop();
      else resolved.push(part);
    }

    return resolved;
  }

  function getEntry(target) {
    return getNode(resolvePath(target));
  }

  function getEntryInfo(target) {
    const path = resolvePath(target);
    return {
      path,
      name: path.at(-1),
      parent: getNode(path.slice(0, -1)),
      node: getNode(path),
    };
  }

  function currentWorkingDirectory() {
    return `/${currentPath.join("/")}`;
  }

  function compactPath(path = currentWorkingDirectory()) {
    if (path === "/home/user") return "~";
    if (path.startsWith("/home/user/")) return `~${path.slice("/home/user".length)}`;
    return path || "/";
  }

  function cloneState() {
    return {
      fs: JSON.parse(JSON.stringify(virtualFs)),
      path: [...currentPath],
    };
  }

  function saveState() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          lesson: lessonIndex,
          fs: virtualFs,
          path: currentPath,
          snap: lessonSnapshot,
        }),
      );
    } catch {
      // The simulator remains usable when storage is unavailable.
    }
  }

  function restoreState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved) return false;

      lessonIndex = Math.max(0, Math.min(Number(saved.lesson) || 0, LESSONS.length));
      virtualFs = saved.fs || virtualFs;
      currentPath = Array.isArray(saved.path) ? saved.path : currentPath;
      lessonSnapshot = saved.snap || cloneState();
      return true;
    } catch {
      return false;
    }
  }

  function tokenize(command) {
    return command.match(/"[^"]*"|'[^']*'|\S+/g)?.map((token) => token.replace(/^["']|["']$/g, "")) || [];
  }

  function appendOutput(text, type = "") {
    const line = document.createElement("div");
    line.className = `output-line${type ? ` is-${type}` : ""}`;
    line.textContent = String(text);
    elements.screen.append(line);
    elements.screen.scrollTop = elements.screen.scrollHeight;
  }

  function appendCommand(command, pathBeforeCommand) {
    const line = document.createElement("div");
    line.className = "output-line is-command";

    const path = document.createElement("span");
    path.className = "command-path";
    path.textContent = compactPath(pathBeforeCommand);

    const symbol = document.createElement("span");
    symbol.className = "command-symbol";
    symbol.textContent = "$";

    const value = document.createElement("span");
    value.textContent = command;

    line.append(path, symbol, value);
    elements.screen.append(line);
    elements.screen.scrollTop = elements.screen.scrollHeight;
  }

  function editDistance(a, b) {
    const matrix = Array.from({ length: b.length + 1 }, (_, row) => [row]);
    for (let column = 0; column <= a.length; column += 1) matrix[0][column] = column;

    for (let row = 1; row <= b.length; row += 1) {
      for (let column = 1; column <= a.length; column += 1) {
        matrix[row][column] = b[row - 1] === a[column - 1]
          ? matrix[row - 1][column - 1]
          : Math.min(matrix[row - 1][column - 1], matrix[row][column - 1], matrix[row - 1][column]) + 1;
      }
    }

    return matrix[b.length][a.length];
  }

  function closestCommand(input) {
    return COMMANDS
      .map((command) => ({ command, distance: editDistance(input, command) }))
      .sort((a, b) => a.distance - b.distance)[0];
  }

  function executeSingle(rawCommand, stdin = null) {
    const args = tokenize(rawCommand);
    const command = args[0];
    const output = [];
    const write = (text, type = "") => output.push({ text, type });

    if (!command) return output;

    if (args.includes("--help") && COMMANDS.includes(command)) {
      write(`${command}: このシミュレータで ${command} の基本的な使い方を練習できます`);
    } else if (command === "pwd") {
      write(currentWorkingDirectory());
    } else if (command === "ls") {
      const target = args.find((argument, index) => index > 0 && !argument.startsWith("-")) || ".";
      const directory = getEntry(target);
      if (directory?.type !== "dir") {
        write("ls: 場所がありません", "danger");
      } else {
        const names = Object.keys(directory.children || {}).filter((name) => args.includes("-a") || !name.startsWith("."));
        write(names.join("  ") || "(空です)");
      }
    } else if (command === "cd") {
      const nextPath = args[1] ? resolvePath(args[1]) : ["home", "user"];
      if (getNode(nextPath)?.type === "dir") currentPath = nextPath;
      else write("cd: フォルダがありません", "danger");
    } else if (command === "mkdir") {
      const target = getEntryInfo(args[1]);
      if (args[1] && target.parent?.type === "dir" && !target.node) {
        target.parent.children[target.name] = { type: "dir", children: {} };
      } else {
        write("mkdir: フォルダを作れません", "danger");
      }
    } else if (command === "touch") {
      const target = getEntryInfo(args[1]);
      if (args[1] && target.parent?.type === "dir" && !target.node) {
        target.parent.children[target.name] = { type: "file", content: "" };
      } else {
        write("touch: ファイルを作れません", "danger");
      }
    } else if (command === "cat") {
      const file = getEntry(args[1]);
      if (file?.type === "file") write(file.content);
      else write("cat: ファイルがありません", "danger");
    } else if (command === "echo") {
      write(args.slice(1).join(" "));
    } else if (command === "cp") {
      const source = getEntry(args[1]);
      const target = getEntryInfo(args[2]);
      if (source?.type === "file" && target.parent?.type === "dir" && target.name) {
        target.parent.children[target.name] = { type: "file", content: source.content };
      } else {
        write("cp: コピー元とコピー先を確認してください", "danger");
      }
    } else if (command === "mv") {
      const source = getEntryInfo(args[1]);
      const target = getEntryInfo(args[2]);
      if (source.node && source.parent && target.parent?.type === "dir" && target.name) {
        target.parent.children[target.name] = source.node;
        delete source.parent.children[source.name];
      } else {
        write("mv: 移動元と移動先を確認してください", "danger");
      }
    } else if (command === "rm") {
      const target = getEntryInfo(args[1]);
      if (target.node?.type === "file" && target.parent) delete target.parent.children[target.name];
      else write("rm: ファイルがありません", "danger");
    } else if (command === "grep") {
      const source = args[2] ? getEntry(args[2])?.content : stdin;
      if (source == null) {
        write("grep: 入力がありません", "danger");
      } else {
        const matches = String(source).split("\n").filter((line) => line.includes(args[1] || ""));
        if (matches.length) write(matches.join("\n"));
      }
    } else if (command === "clear") {
      elements.screen.replaceChildren();
    } else if (command === "help") {
      write(`${COMMANDS.join("  ")}\n\n↑↓ 履歴 / Tab 補完 / 相対・絶対パス・~ / パイプに対応`);
    } else {
      const suggestion = closestCommand(command);
      const suffix = suggestion?.distance <= 3 ? `。「${suggestion.command}」ですか？` : "";
      write(`${command}: コマンドが見つかりません${suffix}`, "danger");
    }

    return output;
  }

  function runCommand(rawValue) {
    const command = rawValue.trim();
    if (!command) return;

    const pathBeforeCommand = currentWorkingDirectory();
    commandHistory.push(command);
    historyIndex = commandHistory.length;
    appendCommand(command, pathBeforeCommand);

    let succeeded = true;
    const redirect = command.match(/^echo\s+(.+?)\s*(>>|>)\s*(.+)$/);

    if (redirect) {
      const targetName = tokenize(redirect[3])[0];
      const target = getEntryInfo(targetName);
      const text = redirect[1].replace(/^(?:"(.*)"|'(.*)')$/, "$1$2");

      if (!targetName || target.parent?.type !== "dir") {
        appendOutput("echo: 保存先を確認してください", "danger");
        succeeded = false;
      } else if (redirect[2] === ">>" && target.node?.type === "file") {
        target.node.content += `${target.node.content ? "\n" : ""}${text}`;
      } else {
        target.parent.children[target.name] = { type: "file", content: text };
      }
    } else {
      const pipeline = command.split("|").map((part) => part.trim());
      let stdin = null;
      let lastOutput = [];

      for (const part of pipeline) {
        lastOutput = executeSingle(part, stdin);
        if (lastOutput.some((item) => item.type === "danger")) {
          succeeded = false;
          break;
        }
        stdin = lastOutput.map((item) => item.text).join("\n");
      }

      lastOutput.forEach((item) => appendOutput(item.text, item.type));
    }

    if (succeeded && LESSONS[lessonIndex]?.validate(command)) {
      appendOutput("✓ レッスン完了 — 次へ進みます", "success");
      lessonIndex += 1;
      lessonSnapshot = cloneState();
      renderLesson();
    }

    renderShellPath();
    saveState();
    updateHistoryButtons();
  }

  function lessonPathFor(index) {
    if (index >= LESSONS.length) return "~/learn/complete";
    const number = String(index + 1).padStart(2, "0");
    return `~/learn/${number}-${LESSONS[index].slug}`;
  }

  function renderLessonRail() {
    elements.lessonRail.replaceChildren();
    LESSONS.forEach((_, index) => {
      const segment = document.createElement("i");
      if (index < lessonIndex) segment.className = "is-complete";
      if (index === lessonIndex) segment.className = "is-current";
      elements.lessonRail.append(segment);
    });
  }

  function renderSuggestions(suggestions) {
    elements.chips.replaceChildren();
    suggestions.forEach((command) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "suggestion-button";
      button.textContent = command;
      button.addEventListener("click", () => {
        elements.input.value = command;
        elements.input.focus();
        elements.input.setSelectionRange(command.length, command.length);
      });
      elements.chips.append(button);
    });
  }

  function renderLesson() {
    const isComplete = lessonIndex >= LESSONS.length;
    const shownStep = isComplete ? LESSONS.length : lessonIndex + 1;
    const progress = (shownStep / LESSONS.length) * 100;
    const lesson = LESSONS[lessonIndex];

    elements.lessonPath.textContent = lessonPathFor(lessonIndex);
    elements.currentStep.textContent = String(shownStep).padStart(2, "0");
    elements.totalSteps.textContent = String(LESSONS.length).padStart(2, "0");
    elements.progressTrack.setAttribute("aria-valuemax", String(LESSONS.length));
    elements.progressTrack.setAttribute("aria-valuenow", String(shownStep));
    elements.progressBar.style.width = `${progress}%`;
    elements.retryStep.disabled = isComplete;

    if (isComplete) {
      elements.lessonTitle.textContent = "基本編を完了しました";
      elements.explain.textContent = "19のレッスンを完了しました。ターミナルでは、学んだコマンドを引き続き自由に試せます。";
      elements.hint.textContent = "help";
      renderSuggestions(["help"]);
    } else {
      elements.lessonTitle.textContent = lesson.title;
      elements.explain.textContent = lesson.explanation;
      elements.hint.textContent = lesson.task;
      renderSuggestions(lesson.suggestions);
    }

    renderLessonRail();
  }

  function renderShellPath() {
    const path = compactPath();
    elements.terminalPath.textContent = path;
    elements.promptPath.textContent = path;
  }

  function renderCommandReference() {
    const fragment = document.createDocumentFragment();
    COMMANDS.forEach((command) => {
      const item = document.createElement("div");
      item.className = "command-item";

      const code = document.createElement("code");
      code.textContent = command;

      const description = document.createElement("span");
      description.textContent = COMMAND_DESCRIPTIONS[command];

      item.append(code, description);
      fragment.append(item);
    });
    elements.commandGrid.append(fragment);
  }

  function updateHistoryButtons() {
    elements.historyPrev.disabled = !commandHistory.length || historyIndex <= 0;
    elements.historyNext.disabled = !commandHistory.length || historyIndex >= commandHistory.length;
  }

  function moveThroughHistory(direction) {
    historyIndex = Math.max(0, Math.min(commandHistory.length, historyIndex + direction));
    elements.input.value = historyIndex === commandHistory.length ? "" : commandHistory[historyIndex];
    elements.input.setSelectionRange(elements.input.value.length, elements.input.value.length);
    elements.input.focus();
    updateHistoryButtons();
  }

  function sharedPrefix(values) {
    if (!values.length) return "";
    let prefix = values[0];
    for (const value of values.slice(1)) {
      while (prefix && !value.startsWith(prefix)) prefix = prefix.slice(0, -1);
    }
    return prefix;
  }

  function completionCandidates(token, isFirstToken) {
    if (isFirstToken) return COMMANDS.filter((command) => command.startsWith(token));

    const slashIndex = token.lastIndexOf("/");
    const directoryText = slashIndex >= 0 ? token.slice(0, slashIndex + 1) : "";
    const namePrefix = slashIndex >= 0 ? token.slice(slashIndex + 1) : token;
    const directoryTarget = directoryText || ".";
    const directory = getNode(resolvePath(directoryTarget));

    if (directory?.type !== "dir") return [];
    return Object.entries(directory.children || {})
      .filter(([name]) => name.startsWith(namePrefix))
      .map(([name, node]) => `${directoryText}${name}${node.type === "dir" ? "/" : ""}`);
  }

  function completeInput() {
    const value = elements.input.value;
    const cursor = elements.input.selectionStart ?? value.length;
    const beforeCursor = value.slice(0, cursor);
    const tokenMatch = beforeCursor.match(/(?:^|\s)([^\s]*)$/);
    if (!tokenMatch) return;

    const token = tokenMatch[1];
    const tokenStart = cursor - token.length;
    const precedingText = beforeCursor.slice(0, tokenStart);
    const isFirstToken = precedingText.trim() === "";
    const candidates = completionCandidates(token, isFirstToken);

    if (!candidates.length) return;

    const replacement = candidates.length === 1 ? candidates[0] : sharedPrefix(candidates);
    if (replacement && replacement !== token) {
      const nextValue = `${value.slice(0, tokenStart)}${replacement}${value.slice(cursor)}`;
      const nextCursor = tokenStart + replacement.length;
      elements.input.value = nextValue;
      elements.input.setSelectionRange(nextCursor, nextCursor);
    } else if (candidates.length > 1) {
      appendOutput(candidates.join("  "), "muted");
    }

    elements.input.focus();
  }

  function resetCurrentLesson() {
    if (!lessonSnapshot) return;
    virtualFs = JSON.parse(JSON.stringify(lessonSnapshot.fs));
    currentPath = [...lessonSnapshot.path];
    elements.screen.replaceChildren();
    appendOutput("このレッスンの開始状態に戻しました。", "muted");
    renderShellPath();
    saveState();
  }

  function restartCourse() {
    if (!window.confirm("進捗と練習用ファイルを消して、最初からやり直しますか？")) return;

    virtualFs = createFileSystem();
    currentPath = ["home", "user"];
    lessonIndex = 0;
    lessonSnapshot = cloneState();
    commandHistory = [];
    historyIndex = 0;
    elements.screen.replaceChildren();
    localStorage.removeItem(STORAGE_KEY);
    appendOutput("新しい練習セッションを開始しました。最初のコマンドを入力してください。", "muted");
    renderLesson();
    renderShellPath();
    updateHistoryButtons();
    saveState();
  }

  function bindEvents() {
    elements.commandForm.addEventListener("submit", (event) => {
      event.preventDefault();
      runCommand(elements.input.value);
      elements.input.value = "";
      elements.input.focus();
    });

    elements.input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveThroughHistory(-1);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        moveThroughHistory(1);
      } else if (event.key === "Tab") {
        event.preventDefault();
        completeInput();
      }
    });

    elements.completeInput.addEventListener("click", completeInput);
    elements.historyPrev.addEventListener("click", () => moveThroughHistory(-1));
    elements.historyNext.addEventListener("click", () => moveThroughHistory(1));
    elements.retryStep.addEventListener("click", resetCurrentLesson);
    elements.restartCourse.addEventListener("click", restartCourse);
    elements.screen.addEventListener("click", (event) => {
      if (event.target === elements.screen) elements.input.focus();
    });
  }

  function initialize() {
    const restored = restoreState();
    if (!lessonSnapshot) lessonSnapshot = cloneState();

    renderCommandReference();
    renderLesson();
    renderShellPath();
    updateHistoryButtons();
    bindEvents();

    appendOutput(
      restored && lessonIndex < LESSONS.length
        ? `保存されていたレッスン ${String(lessonIndex + 1).padStart(2, "0")} から再開しました。`
        : lessonIndex >= LESSONS.length
          ? "コースは完了済みです。自由にコマンドを試せます。"
          : "準備できました。左の課題をターミナルで実行してください。",
      "muted",
    );
    saveState();
  }

  initialize();
})();

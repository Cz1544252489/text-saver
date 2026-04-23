// background.js

// 创建右键菜单
chrome.contextMenus.create({
  id: "add-word",
  title: "添加词汇",
  contexts: ["selection"]
});

// 点击右键菜单事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "add-word" && info.selectionText) {
    const entry = {
      word: info.selectionText.trim(),
      url: tab.url,
      time: new Date().toISOString()
    };

    // 保存到 storage.local
    chrome.storage.local.get({ logs: [] }, (result) => {
      const logs = result.logs;
      logs.push(entry);
      chrome.storage.local.set({ logs }, () => {
        console.log("已保存:", entry);

        // 生成 JSON 并下载到本地
        const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        chrome.downloads.download({
          url: url,
          filename: "word_logs.json",
          conflictAction: "overwrite",
          saveAs: false
        });
      });
    });
  }
});
import { Plugin, Menu } from "obsidian";

export default class CJKSpacingPlugin extends Plugin {
  async onload() {
    console.log("✅ CJKSpacingPlugin loaded!");

    this.addCommand({
      id: "add-space-between-cjk-and-en",
      name: "整理中英與運算符空格",
      editorCallback: (editor) => {
        const selectedText = editor.getSelection();
        const replaced = addSpaceBetweenCJKAndEn(selectedText);
        console.log("🎯 Replaced text:", replaced);
        editor.replaceSelection(replaced);
      },
    });

    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu: Menu, editor) => {
        menu.addItem((item) => {
          item.setTitle("中英與運算符空格整理")
              .setIcon("text-cursor-input")
              .onClick(() => {
                const selectedText = editor.getSelection();
                const replaced = addSpaceBetweenCJKAndEn(selectedText);
                editor.replaceSelection(replaced);
              });
        });
      })
    );
  }
}

function addSpaceBetweenCJKAndEn(text: string): string {
  return text
    // 中英文之間加空格
    .replace(/([\u4e00-\u9fa5])([a-zA-Z0-9])/g, "$1 $2")
    .replace(/([a-zA-Z0-9])([\u4e00-\u9fa5])/g, "$1 $2")

    // 單一運算符號左右加空格
    .replace(/([^\s])([+\-*\/=×÷])(?!\s)/g, "$1 $2")
    .replace(/(?!\s)([+\-*\/=×÷])([^\s])/g, "$1 $2")

    // 雙等號以上視為一組
    .replace(/([^\s])([=]{2,})([^\s])/g, "$1 $2 $3")

    // LaTeX ($...$) 前後補空格
    .replace(/([^\s])(\$[^$]+\$)/g, "$1 $2")
    .replace(/(\$[^$]+\$)([^\s])/g, "$1 $2")

    // 🔥 整理 {1,3,5,7} 成為 { 1 , 3 , 5 , 7 }
  .replace(/\{([0-9,\s]+)\}/g, (match, p1) => {
  const numbers = p1.split(",").map((s: string) => s.trim()).join(" , ");
  return `{ ${numbers} }`;
})

    // 清除重複空格
    .replace(/ +/g, " ")
    .trim();
}



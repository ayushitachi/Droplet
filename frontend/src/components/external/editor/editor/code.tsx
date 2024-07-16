import Editor from "@monaco-editor/react";
import { File } from "../utils/file-manager";
import { Socket } from "socket.io-client";
// import { diff_match_patch } from "diff-match-patch";

// const dmp = new diff_match_patch();

export const Code = ({
  selectedFile,
  socket,
}: {
  selectedFile: File | undefined;
  socket: Socket;
}) => {
  if (!selectedFile) return null;

  const code: any = selectedFile.content;
  let language = selectedFile.name.split(".").pop();

  if (language === "js" || language === "jsx") language = "javascript";
  else if (language === "ts" || language === "tsx") language = "typescript";
  else if (language === "py") language = "python";

  function debounce(func: (value: string) => void, wait: number) {
    let timeout: number;
    return (value: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(value);
      }, wait);
    };
  }

  // const handleChange = debounce((newCode: any) => {
  //   // const previousCode = code;

  //   // Calculate diffs
  //   const diffs = dmp.diff_main(code, newCode);
  //   dmp.diff_cleanupSemantic(diffs);

  //   // Convert diffs to patches
  //   const patches = dmp.patch_make(code, diffs);
  //   const patchText = dmp.patch_toText(patches);

  //   // Send patches to the server
  //   socket.emit("updateContent", {
  //     path: selectedFile.path,
  //     content: patchText,
  //   });

  //   // Update the previous code reference
  //   // previousCodeRef.current = newCode;
  // }, 500);

  return (
    <Editor
      height="100vh"
      language={language}
      value={code}
      theme="vs-dark"
      onChange={debounce((value) => {
        // Should send diffs, for now sending the whole file
        socket.emit("updateContent", {
          path: selectedFile.path,
          content: value,
        });
      }, 500)}
    />
  );

  // debounce((value) => {
  //   // Should send diffs, for now sending the whole file
  //   socket.emit("updateContent", {
  //     path: selectedFile.path,
  //     content: value,
  //   });
  // }, 500);
};

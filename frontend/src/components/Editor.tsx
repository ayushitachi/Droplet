import { useEffect, useMemo } from "react";
import Sidebar from "./external/editor/components/sidebar";
import { Code } from "./external/editor/editor/code";
import styled from "@emotion/styled";
import {
  File,
  buildFileTree,
  RemoteFile,
} from "./external/editor/utils/file-manager";
import { FileTree } from "./external/editor/components/file-tree";
import { Socket } from "socket.io-client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

// credits - https://codesandbox.io/s/monaco-tree-pec7u
export const Editor = ({
  files,
  onSelect,
  selectedFile,
  socket,
}: {
  files: RemoteFile[];
  onSelect: (file: File) => void;
  selectedFile: File | undefined;
  socket: Socket;
}) => {
  const rootDir = useMemo(() => {
    return buildFileTree(files);
  }, [files]);

  useEffect(() => {
    if (!selectedFile) {
      onSelect(rootDir.files[0]);
    }
  }, [selectedFile]);

  return (
    <div>
      <Main>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>
            <Sidebar>
              <FileTree
                rootDir={rootDir}
                selectedFile={selectedFile}
                onSelect={onSelect}
              />
            </Sidebar>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80}>
            <Code socket={socket} selectedFile={selectedFile} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </Main>
    </div>
  );
};

const Main = styled.main`
  display: flex;
`;

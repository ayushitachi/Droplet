import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { saveToS3 } from "./aws";
import path from "path";
import { fetchDir, fetchFileContent, saveFile } from "./fs";
import { TerminalManager } from "./pty";
import { fetchS3Folder } from "./aws";
import { deleteResources } from "./kube";

const terminalManager = new TerminalManager();
let disconnectTimeout: any;

export function initWs(httpServer: HttpServer) {
    const io = new Server(httpServer, {
        cors: {
            // Should restrict this more!
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
      
    io.on("connection", async (socket) => {
        // Auth checks should happen here
        clearTimeout(disconnectTimeout);
        const host = socket.handshake.headers.host;
        console.log(`host is ${host}`);
        console.log("env" , process.env.S3_BUCKET)
        // Split the host by '.' and take the first part as replId
        const replId = host?.split('.')[0];
        console.log("repl id is" , replId)
    
        if (!replId) {
            socket.disconnect();
            terminalManager.clear(socket.id);
            return;
        }

        try{
            await fetchS3Folder(`code/${replId}`, "/workspace");

            socket.emit("loaded", {
                rootContent: await fetchDir("/workspace", "")
            });

           initHandlers(socket, replId);
        } catch(err){
            console.log("ayush first err",err)
        }
    });
}

function initHandlers(socket: Socket, replId: string) {

    socket.on("disconnect", () => {
        disconnectTimeout = setTimeout(() => {
            console.log('User did not reconnect within 1 minute. Performing cleanup.');
            // Perform any necessary cleanup here
            deleteResources(replId);
        }, 120000); 
        console.log("user disconnected");
    });

    socket.on("fetchDir", async (dir: string, callback) => {
        const dirPath = `/workspace/${dir}`;
        const contents = await fetchDir(dirPath, dir);
        callback(contents);
    });

    socket.on("fetchContent", async ({ path: filePath }: { path: string }, callback) => {
        const fullPath = `/workspace/${filePath}`;
        const data = await fetchFileContent(fullPath);
        callback(data);
    });

    // TODO: contents should be diff, not full file
    // Should be validated for size
    // Should be throttled before updating S3 (or use an S3 mount)
    socket.on("updateContent", async ({ path: filePath, content }: { path: string, content: string }) => {
        const fullPath =  `/workspace/${filePath}`;
        await saveFile(fullPath, content);
        await saveToS3(`code/${replId}`, filePath, content);
    });

    socket.on("requestTerminal", async () => {
        terminalManager.createPty(socket.id, replId, (data, id) => {
            socket.emit('terminal', {
                data: Buffer.from(data,"utf-8")
            });
        });
    });
    
    socket.on("terminalData", async ({ data }: { data: string, terminalId: number }) => {
        terminalManager.write(socket.id, data);
    });

}
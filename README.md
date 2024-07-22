🚀 Droplet: Cloud-Based Online IDE🚀

🌟 Key Features:\
𝐏𝐮𝐛𝐥𝐢𝐜 𝐔𝐑𝐋 𝐃𝐞𝐩𝐥𝐨𝐲𝐦𝐞𝐧𝐭:\
Users can easily share their work as it is deployed over a public URL.\
𝐏𝐫𝐢𝐯𝐚𝐭𝐞 𝐕𝐢𝐫𝐭𝐮𝐚𝐥 𝐌𝐚𝐜𝐡𝐢𝐧𝐞𝐬:\
Each user has a private virtual machine with dedicated compute and memory resources.\
𝐂𝐨𝐦𝐩𝐫𝐞𝐡𝐞𝐧𝐬𝐢𝐯𝐞 𝐓𝐨𝐨𝐥𝐬𝐞𝐭:\
Users can access a file system, code editor, and terminal for their VMs.\
𝐏𝐞𝐫𝐬𝐢𝐬𝐭𝐞𝐧𝐭 𝐋𝐨𝐧𝐠-𝐑𝐮𝐧𝐧𝐢𝐧𝐠 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐞𝐬:\
Supports long-running backend/frontend processes.\
𝐏𝐞𝐫𝐬𝐢𝐬𝐭𝐞𝐧𝐭 𝐂𝐨𝐝𝐞 𝐂𝐡𝐚𝐧𝐠𝐞𝐬:\
Users' code changes are saved with their unique IDs.

🛠️ Tech Stack:\
- Frontend: React, Xterm\
- Backend: Node.js, node-pty\
- Deployment: Docker and Kubernetes

🔍 Deep Dive: System Design and Architecture of the Online IDE 🔍

Here's a closer look at my online IDE project's system design and architecture.

🛠️Working Flow:\
𝟏. 𝐔𝐬𝐞𝐫 𝐈𝐧𝐭𝐞𝐫𝐟𝐚𝐜𝐞:\
The frontend communicates with the Kubernetes cluster through a '/start endpoint'.

𝟐. 𝐈𝐧𝐠𝐫𝐞𝐬𝐬 𝐋𝐨𝐚𝐝 𝐁𝐚𝐥𝐚𝐧𝐜𝐞𝐫:\
Handles incoming traffic and routes requests to appropriate services.

𝟑. 𝐎𝐫𝐜𝐡𝐞𝐬𝐭𝐫𝐚𝐭𝐨𝐫 𝐒𝐞𝐫𝐯𝐢𝐜𝐞 𝐏𝐨𝐝:\
Manages the lifecycle of user environments.\
- Receives 'start service' command\
- Initiates the Runner Service Pod\
- Notifies completion to the Ingress Load Balancer

𝟒. 𝐈𝐧𝐢𝐭 𝐒𝐞𝐫𝐯𝐢𝐜𝐞 𝐏𝐨𝐝:\
Handles '/project endpoint' requests and initializes user environments.

𝟓. 𝐑𝐮𝐧𝐧𝐞𝐫 𝐒𝐞𝐫𝐯𝐢𝐜𝐞 𝐏𝐨𝐝:\
The core of the user's development environment.\
- Execution Container: Runs user code and exposes executed output.\
- WebSocket Container: Maintains persistent connection for real-time updates.

𝟔. 𝐂𝐥𝐮𝐬𝐭𝐞𝐫 𝐈𝐏 𝐒𝐞𝐫𝐯𝐢𝐜𝐞:\
Acts as an internal load balancer, facilitating communication between pods.

𝟕. 𝐒𝟑 𝐈𝐧𝐭𝐞𝐠𝐫𝐚𝐭𝐢𝐨𝐧:\
Persists user changes by copying from '/base to /code/userid'.

𝟖. 𝐖𝐞𝐛𝐒𝐨𝐜𝐤𝐞𝐭 𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐨𝐧:\
Enables real-time communication between the front-end and the Runner Service Pod.

![droplet design](https://github.com/user-attachments/assets/e2d8b53a-9f69-4add-9aa4-296c6331144a)



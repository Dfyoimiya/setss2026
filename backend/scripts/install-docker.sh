#!/bin/bash
set -e

echo "=== Docker 安装脚本 (Ubuntu 24.04 + AMD64 + 国内镜像源) ==="

# 1. 卸载旧版本
echo "[1/7] 卸载旧版本 Docker（如有）..."
sudo apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

# 2. 安装依赖
echo "[2/7] 安装依赖..."
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release

# 3. 添加 Docker 官方 GPG 密钥和仓库
echo "[3/7] 添加 Docker 仓库..."
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. 安装 Docker Engine
echo "[4/7] 安装 Docker Engine..."
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 5. 配置国内镜像源
echo "[5/7] 配置国内镜像源..."
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json > /dev/null <<'EOF'
{
  "registry-mirrors": [
    "https://docker.1panel.live",
    "https://hub.rat.dev",
    "https://docker.m.daocloud.io",
    "https://docker.mirrors.ustc.edu.cn",
    "https://docker.mirrors.tuna.tsinghua.edu.cn"
  ]
}
EOF

# 6. 启动 Docker 并设置开机自启
echo "[6/7] 启动 Docker 服务..."
sudo systemctl daemon-reload
sudo systemctl enable docker
sudo systemctl restart docker

# 7. 配置用户权限
echo "[7/7] 配置用户权限..."
sudo usermod -aG docker "$USER"

echo ""
echo "=== 安装完成 ==="
echo "Docker 版本:"
sudo docker version --format 'Client: {{.Client.Version}} | Server: {{.Server.Version}}'
echo ""
echo "Docker Compose 版本:"
docker compose version
echo ""
echo "⚠️  请执行以下命令刷新用户组，或重新登录/重启终端："
echo "    newgrp docker"
echo ""
echo "验证 Docker 是否正常工作："
echo "    docker run hello-world"
echo ""
echo "镜像源配置已写入 /etc/docker/daemon.json"

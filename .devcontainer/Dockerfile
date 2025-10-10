FROM mcr.microsoft.com/devcontainers/base:2-trixie

# Install dependencies required for Bun
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Bun as vscode user
USER vscode
ENV BUN_INSTALL="/home/vscode/.bun"
ENV PATH="${BUN_INSTALL}/bin:${PATH}"

RUN curl -fsSL https://bun.sh/install | bash

# Switch back to root for any additional setup
USER root

WORKDIR /workspace/main
FROM mcr.microsoft.com/devcontainers/base:2-trixie

# Install dependencies required for Bun and Python/uv
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Install Bun as vscode user
USER vscode
ENV BUN_INSTALL="/home/vscode/.bun"
ENV PATH="${BUN_INSTALL}/bin:${PATH}"

RUN curl -fsSL https://bun.sh/install | bash -s "bun-v1.3.0"

# Install uv (Python package installer and resolver)
ENV UV_HOME="/home/vscode/.local/share/uv"
ENV PATH="${UV_HOME}/bin:${PATH}"

RUN curl -LsSf https://astral.sh/uv/install.sh | sh

# Install spec-kit (Spec-Driven Development toolkit)
RUN /home/vscode/.local/bin/uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# Switch back to root for any additional setup
USER root

WORKDIR /workspace/main
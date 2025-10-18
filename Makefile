.PHONY: cp worktree
cp:
	cp /workspace/main/.devcontainer/compose.override.yaml.sample /workspace/main/.devcontainer/compose.override.yaml
worktree:
	sudo chown -R vscode:vscode $(shell pwd)
	bun ci
	bun run db:migrate:deploy
	bun run db:generate
	bun run 
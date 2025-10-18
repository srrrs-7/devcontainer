.PHONY: cp worktree del-worktree worktree-list
cp:
	cp /workspace/main/.devcontainer/compose.override.yaml.sample /workspace/main/.devcontainer/compose.override.yaml

BRANCH = worktree-feat
WORKTREE_PATH = ../$(BRANCH)

worktree: del-worktree
	sudo git worktree add -b $(BRANCH) $(WORKTREE_PATH) origin/main
	sudo chown -R vscode:vscode $(WORKTREE_PATH)
	cd $(WORKTREE_PATH) && bun ci && bun run db:generate && bun run db:migrate:deploy && bun run check && bun run test:run
	cd $(WORKTREE_PATH) && claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context ide-assistant --project $(PWD)/$(WORKTREE_PATH) || true
	make worktree-list

del-worktree:
	sudo git worktree remove $(WORKTREE_PATH) || true
	sudo git branch -D $(BRANCH) || true
	git worktree prune
	make worktree-list

worktree-list:	
	git worktree list
	git branch
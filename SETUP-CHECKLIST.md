# Setup Checklist

Use this to verify each step of your setup. Check off each item as you go.

---

## Installation

- [ ] Claude Desktop app is installed and I can open it
- [ ] I'm signed in with my company Claude account
- [ ] I selected the team organization
- [ ] Bun is installed (`bun --version` shows a version number)
- [ ] Claude Code CLI is installed (`claude --version` shows a version number)
- [ ] Claude Code is authenticated (`claude auth login` completed successfully)

## Repository

- [ ] I cloned the repository to `~/Documents/my-assistant`
- [ ] I can see `CLAUDE.md`, `my-identity.md`, `my-soul.md` in the folder

## Personalization

- [ ] I filled in `my-identity.md` — no `[brackets]` remaining
- [ ] I chose a name for my assistant
- [ ] I described the personality I want
- [ ] I filled in `my-soul.md` — no `[brackets]` remaining
- [ ] I saved both files

## Telegram Bot

- [ ] I created a bot with @BotFather on Telegram
- [ ] I have my bot token copied (numbers:letters format)

## Connection

- [ ] I installed the Telegram plugin (`/plugin install telegram@claude-plugins-official`)
- [ ] I configured my token (`/telegram:configure TOKEN`)
- [ ] I restarted Claude Code with `--channels plugin:telegram@claude-plugins-official`
- [ ] No errors appeared at startup

## Pairing

- [ ] I sent a message to my bot on Telegram
- [ ] I received a pairing code back
- [ ] I ran `/telegram:access pair CODE` successfully
- [ ] I ran `/telegram:access policy allowlist`

## Testing

- [ ] I sent "Hi, who are you?" to my bot — it responded in character
- [ ] I sent a follow-up question — it maintained personality
- [ ] I asked it to search the web for something — it returned results

---

## All Done!

If everything is checked, you're good to go. Your assistant will be available anytime your Mac is on and Claude Code is running in Terminal.

**To start it each day:**
```
cd ~/Documents/my-assistant && claude --channels plugin:telegram@claude-plugins-official
```

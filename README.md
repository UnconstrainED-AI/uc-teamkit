# Your Personal AI Assistant

## Quick Start

Open Terminal and run:

```
curl -fsSL https://raw.githubusercontent.com/alex-unconstrained/uc_teamkit/main/bootstrap.sh | bash
```

That's it. The setup wizard handles everything:
- Installs all prerequisites (Node.js, Bun, Claude Code)
- Walks you through designing your assistant's personality
- Connects Telegram so you can message it from your phone
- Optionally hooks up email, calendar, and more
- Opens your assistant's profile in the browser for final review
- Launches your assistant

The whole process takes about 15 minutes.

## Day-to-Day

Start your assistant each morning:

```
cd ~/Documents/my-assistant
npm start
```

Leave Terminal open. Your assistant is available as long as Claude Code is running.

Your Mac needs to be awake for the bot to respond.

## Reconfigure

Want to change your assistant's personality or add new connections?

```
cd ~/Documents/my-assistant
npm run setup
```

## Edit Your Assistant's Profile

Open the profile dashboard anytime:

```
cd ~/Documents/my-assistant
npm run dashboard
```

This opens a web page in your browser where you can view and edit your assistant's personality, voice, focus areas, quirks, boundaries, and more. Changes save directly — just restart Claude Code to apply them.

You can also ask your assistant: "Open my profile page" and it will launch the dashboard for you.

## Need Help?

- Ask your assistant — it can troubleshoot most issues
- Check `docs/manual-setup.md` for detailed step-by-step instructions
- Reach out to Alex

## Troubleshooting

See `docs/manual-setup.md` for detailed troubleshooting, or ask your assistant:
"Hey, Telegram isn't working — help me debug"

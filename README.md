# Tracker for Windows and Mac

Tracker is a private study tracker that runs on your own computer: a timer and log, goals and stats, notes with a graph, a
library of books and articles, flashcards, and an AI tab that uses a model on your own machine or your own key. Your data
stays on your computer. There is no account.

**Home page: https://cliteka-cell.github.io/tracker-releases/**
&nbsp;|&nbsp; [Getting started in ten minutes](https://cliteka-cell.github.io/tracker-releases/guide.html)
&nbsp;|&nbsp; [The full manual](https://cliteka-cell.github.io/tracker-releases/manual.html)

Tracker is free to download and use. It is not open source. [Terms of use](https://cliteka-cell.github.io/tracker-releases/terms.html).

Questions, problems or ideas: open an issue here, or write to clite.ka@gmail.com.

This repository only holds the downloads and that page. **[Download the newest Tracker-Setup.exe](https://github.com/cliteka-cell/tracker-releases/releases/latest/download/Tracker-Setup.exe)**
for Windows 10 and 11 (about 45 MB), **[the newest Tracker-Mac.dmg](https://github.com/cliteka-cell/tracker-releases/releases/latest/download/Tracker-Mac.dmg)**
for macOS 13.5 or newer (Apple Silicon and Intel), or open the **Releases** page for older versions and checksums.

## Installing

1. Download the Setup file and open it. If Windows says "Windows protected your PC", choose "More info" and then "Run anyway".
   It appears because the program is not signed with a paid certificate.
2. Click Next and Install. No administrator rights are needed.
3. Tracker opens in your browser. A small icon near the clock opens or quits it.

## Installing on a Mac

1. Open the disk image and drag Tracker onto the Applications folder.
2. The first time, macOS stops it, because it is not signed with a paid Apple certificate. On macOS 15 and newer: open it once,
   then System Settings, Privacy & Security, "Open Anyway". On macOS 13 and 14: Control-click Tracker, Open, then Open.
3. Tracker opens in your browser. A small clock icon in the menu bar opens it; Control-click it to quit.

## Updating

From version 0.3.0 on (and on a Mac, from the first Mac version), Tracker can update itself: Settings, About, Check now, then Update now. Updates are signed, and
Tracker only installs one that carries its own signature. You can also run a newer Setup by hand; it installs over the old
version and keeps your data, and a copy of your data is saved before anything is changed.

## Checking a download

Each release lists the SHA-256 checksum of its Setup file (it is also in the `.sha256` file next to it). In PowerShell:

```powershell
Get-FileHash .\Tracker-Setup-x.y.z.exe
```

On a Mac, in Terminal:

```bash
shasum -a 256 Tracker-x.y.z-mac.dmg
```

## Privacy

Tracker sends nothing anywhere unless you turn something on: book search, an online AI that you set up yourself, or the update
check (off by default), which only asks this repository for a small file called `version.json` (`version-mac.json` on a Mac). Inside Tracker, Settings,
Privacy lists everything that can leave the computer, when, and how to stop it.

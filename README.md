# Tracker for Windows

Tracker is a private study tracker that runs on your own computer: a timer and log, goals and stats, notes with a graph, a
library of books and articles, flashcards, and an AI tab that uses a model on your own machine or your own key. Your data
stays on your computer. There is no account.

This repository only holds the downloads. Open the **Releases** page and download the newest `Tracker-Setup-x.y.z.exe`.

## Installing

1. Download the Setup file and open it. If Windows says "Windows protected your PC", choose "More info" and then "Run anyway".
   It appears because the program is not signed with a paid certificate.
2. Click Next and Install. No administrator rights are needed.
3. Tracker opens in your browser. A small icon near the clock opens or quits it.

## Updating

Run the newer Setup. It installs over the old version and keeps your data, and a copy of your data is saved before anything is
changed. In Tracker, Settings, About can check whether a newer version exists.

## Checking a download

Each release lists the SHA-256 checksum of its Setup file (it is also in the `.sha256` file next to it). In PowerShell:

```powershell
Get-FileHash .\Tracker-Setup-0.2.0.exe
```

## Privacy

Tracker sends nothing anywhere unless you turn something on: book search, an online AI that you set up yourself, or the update
check (off by default), which only asks this repository for a small file called `version.json`.

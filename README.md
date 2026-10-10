<table align="center" border="0" cellpadding="0" cellspacing="10">
    <tr>
        <td width="33%"><img src="./public/images/home.png" width="100%"></td>
        <td width="33%"><img src="./public/images/menu.png" width="100%"></td>
        <td width="33%"><img src="./public/images/game.png" width="100%"></td>
    </tr>
    <tr>
        <td>Home</td>
        <td>Menu</td>
        <td>Game</td>
    </tr>
</table>

<h1 align="center"><b><font size="18">
    <a href="https://klhrd.github.io/ah-roll-rah/">
        AH-ROLL-RAH
    </a>
</font></b></h1>

<p align="center">
    <img src="https://github.com/klhrd/ah-roll-rah/actions/workflows/static.yml/badge.svg" alt="Deploy static content to Pages">
    <img src="https://hackatime.hackclub.com/api/v1/badge/U0BAZK90H1S/klhrd/ah-roll-rah" alt="Hackatime Stats">
    <br>
    <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=flat-square&logo=html5&logoColor=white" alt="HTML5">
    <img src="https://img.shields.io/badge/css-%23663399.svg?style=flat-square&logo=css&logoColor=white" alt="CSS">
    <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=flat-square&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript">
    <img src="https://img.shields.io/badge/JSON-000?logo=json&logoColor=fff" alt="JSON">
    <img src="https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff" alt="Python">
    <img src="https://img.shields.io/badge/Markdown-%23000000.svg?logo=markdown&logoColor=white" alt="Markdown">
</p>

An action-packed 3D ball-rolling platformer where you steer a high-speed ball through narrow, suspended tracks to reach the finish line. This project was originally created for **Tagless**, a Hack Club event.

---

## Project Architecture

```text
*/
├── js/
│   ├── scenes/
│   │   ├── gameScene.js
│   │   ├── homeScene.js
│   │   ├── infoScene.js
│   │   ├── menuScene.js
│   │   └── resultScene.js
│   │   
│   ├── app.js
│   ├── auroraBackground.js
│   ├── config.js
│   ├── levelManager.js
│   ├── progressManager.js
│   └── router.js
│
├── levels/
│   ├── build_index_json.py
│   ├── build_levels.py
│   ├── index.js
│   ├── level_1.json...
│
├── index.html
└── README.md

```

## Getting Started

You can run this project in two ways:

1. Direct Link
    - [Github Page](https://klhrd.github.io/ah-roll-rah/)
2. Run Locally
    -  Clone or download the repository, then host it using a local development server (like VS Code's Live Server) to run it locally via ES6 modules.

#!/usr/bin/env node

const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const program = new Command();

program
  .version("1.0.0")
  .description("CLI pour générer un projet Express avec TypeScript")
  .argument("<projectName>", "Nom du projet")
  .action((projectName) => {
    const projectPath = path.join(process.cwd(), projectName);
    console.log(`Création du projet dans ${projectPath}...`);

    // Crée les dossiers de base
    fs.mkdirSync(projectPath);
    fs.mkdirSync(path.join(projectPath, "src"));

    // Crée les fichiers de base
    fs.writeFileSync(
      path.join(projectPath, "src", "index.ts"),
      `
import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(\`Serveur lancé sur http://localhost:\${port}\`);
});
    `
    );

    // Creer dossier base de test
    fs.mkdirSync(path.join(projectPath, "test"));

    // Crée les fichiers de base
    fs.writeFileSync(
      path.join(projectPath, "test", "main.test.ts"),
      `
import { describe } from "node:test";

describe("Basic Jest test", () => {
  it("should return true", () => {
    expect(true).toBe(true);
  });
});

    `
    );

    // Crée le package.json
    fs.writeFileSync(
      path.join(projectPath, "package.json"),
      `
{
  "name": "${projectName}",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node-dev src/index.ts",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "typescript": "^4.0.0",
    "@types/express": "^4.17.0",
    "ts-node-dev": "^1.0.0"
  }
}
    `
    );

    // Copier le fichier tsconfig.json à partir du dossier template
    const jestconfigSource = path.join(__dirname, "config", "jest.config.js");
    const jestconfigDest = path.join(projectPath, "jest.config.js");

    fs.copyFileSync(jestconfigSource, jestconfigDest);
    console.log("tsconfig.json copié avec succès !");

    // Copier le fichier tsconfig.json à partir du dossier template
    const tsconfigSource = path.join(__dirname, "config", "tsconfig.json");
    const tsconfigDest = path.join(projectPath, "tsconfig.json");

    fs.copyFileSync(tsconfigSource, tsconfigDest);
    console.log("tsconfig.json copié avec succès !");

    // Init  projet
    console.log("Initialisation du projet ...");
    execSync("npm init -y", { stdio: "inherit", cwd: projectPath });

    // Installer les dépendances
    console.log("Installation des dépendances...");
    execSync("npm install express dotenv", {
      stdio: "inherit",
      cwd: projectPath,
    });

    // Installer les dépendances Typescript
    console.log("Installation des dépendances typeScript...");

    execSync("npm install typescript@latest ts-node-dev@latest ", {
      stdio: "inherit",
      cwd: projectPath,
    });
    execSync("npm i -D typescript @types/express @types/node ", {
      stdio: "inherit",
      cwd: projectPath,
    });

    // Installer les dépendances jest
    console.log("Installation des dépendances typeScript...");

    execSync(
      "npm i -D babel-jest @babel/core @babel/preset-env @babel/preset-typescript jest @types/jest ts-jest",
      {
        stdio: "inherit",
        cwd: projectPath,
      }
    );
    console.log("Projet Express avec TypeScript généré avec succès !");
    console.log(`Pour démarrer : \ncd ${projectName} \nnpm run dev`);
  });

program.parse(process.argv);

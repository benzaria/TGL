import { exit, stdout } from 'node:process'
import { readdir } from 'node:fs/promises'
import { keypress, cleanup } from './utils/helper'
import * as inq from '@inquirer/prompts'
import { clear } from 'node:console'
import { lookupGame } from './core'
import { resolve } from 'node:path'
import { Command } from 'commander'
import { homedir } from 'node:os'
import { exec } from 'child_process'
import { display } from './ui'
import ms from '@benzn/to-ms'
import 'string.chalk'

const gameDir = resolve(homedir(), 'Games')
const games = await readdir(gameDir)
const GL: GLType = {}
const GLdate: number[] = []

export const __dirname = import.meta.dirname
export { GL, GLdate, gameDir, games, main }

stdout.write('\x1b]2;Game Launcher\x07')
stdout.write(''.enableAlternativeBuffer)

main()
keypress()
setTimeout(() => cleanup(), ms('30s'))

async function main() {
    clear()
    exec(`"C:\\Program Files\\PowerShell\\7\\pwsh.exe" -noprofile -nologo -File "C:\\Users\\benz\\commands\\VBScript\\TGL\\src\\utils\\getIcon2.ps1" "${gameDir}"`)
    for (const game of games)
        GL[game] = await lookupGame(gameDir, game)

    display(GL)
}

import { exit, stdout } from 'node:process'
import { readdir } from 'node:fs/promises'
import { keypress, cleanup } from './utils/helper'
import * as inq from '@inquirer/prompts'
import { clear } from 'node:console'
import { lookupGame } from './core'
import { resolve } from 'node:path'
import { Command } from 'commander'
import { homedir } from 'node:os'
import { display } from './ui'
import ms from '@benzn/to-ms'
import 'string.chalk'

const gameDir = resolve(homedir(), 'Games')
const games = await readdir(gameDir)
const GL: GLType = {}
const GLdate: number[] = []

export { GL, GLdate, gameDir, games, main }

stdout.write('\x1b]2;Game Launcher\x07')
stdout.write('\x1b[?1049h')

main()
keypress()
setTimeout(() => cleanup(), ms('30s'))

async function main() {
    clear()
    for (const game of games)
        GL[game] = await lookupGame(gameDir, game)

    display(GL)
}

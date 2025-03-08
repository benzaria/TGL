import { join, extname, basename } from 'path'
import { stat, readdir } from 'fs/promises'
import { GLdate } from '.'
import { argv } from 'process'

const skipReg = /(?:handler|unity|crash)/ig

async function lookupGame(gameDir: string, game: string, depth = 0) {
    const obj: GLType[0] = {}

    if (depth > 2) return obj

    const path = join(gameDir, game)
    const stats = await stat(path)

    if (stats.isDirectory()) {
        const files = await readdir(path)
        for (const file of files)
            Object.assign(obj, await lookupGame(path, file, depth + 1))

    } else if (extname(path) === '.exe') {
        GLdate.push(stats.mtimeMs)
        if (skipReg.test(path) && !argv.includes('--all')) return obj
        obj[basename(path)] = { path, date: stats.mtime, short: stats.mtime.toISOString().slice(0, 10) }
    }

    return obj
}

export { lookupGame, skipReg }
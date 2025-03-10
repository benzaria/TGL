import { dateColor, randColor } from './utils/helper'
import { existsSync, exists, readFileSync } from 'fs'
import { dirname, basename, resolve, join } from 'path'
import { exec, spawn, execSync } from 'child_process'
import { GLdate, __dirname } from '.'
import { log as echo } from 'console'

function display(GL: GLType) {
    const minDate = Math.min(...GLdate)
    const maxDate = Math.max(...GLdate)
    const output = [], stdout = (...args) => output.push(...args) 

    for (const game in GL) {
        if (Object.keys(GL[game]).length === 0) continue
        stdout('', `${game}`.bold) // ;${randColor()}

        const gl = GL[game]
        for (const exe in gl) {
            if (exe === 'x32') continue
            const color = dateColor(gl[exe].date, minDate, maxDate)
            stdout(`  - ${getIcon(gl[exe].path)}${exe.up(2).rt(8)._link(gl[exe].path)[color]}${(gl.x32 ?? '').red.x(35)}${GL[game][exe].short.grey.x(40)}`)
        }
    }

    stdout('')
    echo(boxit(output))
}

function getIcon(exePath) {
    const sixelPath = exePath.replace('.exe', '.six')

    if (existsSync(sixelPath))
        return readFileSync(sixelPath, 'utf8')

    return ''
}

function fzf(data: any[]) {

    const fzfArgs = ['--preview', 'type {}.six'];
    const fzf = spawn('fzf', fzfArgs, { stdio: ['pipe', process.stdout, process.stderr] });

    data.forEach(file => {
        fzf.stdin.write(file + '\n');
    });

    fzf.stdin.end();

}
 
function arch(GL: GLType[0]) {
    Object.keys(GL).forEach(val => val.includes('32') ? GL[val].arch = 'x32'._link(GL[val].path) : null)
    return GL
}

function boxit(strings) {
    const color = 'cyanBright'  //randColor()
    const maxLength = Math.max(...strings.map(str => str.strip.length))
    const border = ('╭' + '─'.repeat(58) + '╮')[color]
    const bottom = ('╰' + '─'.repeat(58) + '╯')[color]

    const content = strings.join('\n').split('\n').map(str => '│'[color] + ` ${str} ` + '│'[color].x(60)).join('\n')

    return `${border}\n${content}\n${bottom}`
}

export { display, arch }

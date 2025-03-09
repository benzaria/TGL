import { dateColor } from './utils/helper'
import { log as echo } from 'console'
import { GLdate } from '.'

function display(GL: GLType) {
    const minDate = Math.min(...GLdate)
    const maxDate = Math.max(...GLdate)

    for (const game in GL) {
        if (Object.keys(GL[game]).length === 0) continue
        echo(`\n${game}`.bold) // ;${randColor()}

        const gl = GL[game]
        for (const exe in gl) {
            if (exe === 'x32') continue
            const color = dateColor(gl[exe].date, minDate, maxDate)
            echo(`  - ${exe._link(gl[exe].path)[color]}${(gl.x32 ?? '').red.x(35)}${GL[game][exe].short.grey.x(40)}`)
        }
    }
}

function arch(GL: GLType[0]) {
    Object.keys(GL).forEach(val => val.includes('32') ? GL[val].arch = 'x32'._link(GL[val].path) : null)
    return GL
}

export { display, arch }

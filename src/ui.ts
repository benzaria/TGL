import { dateColor } from './utils/helper'
import { log as echo } from 'console'
import { GLdate } from '.'

export function display(GL: GLType) {
    const minDate = Math.min(...GLdate)
    const maxDate = Math.max(...GLdate)

    for (const game in GL) {
        if (Object.keys(GL[game]).length === 0) continue
        echo(`\n\x1b[1m${game}\x1b[0m`) // ;${randColor()}

        for (const exe in GL[game]) {
            let sp = 40 - exe.length
            const color = dateColor(GL[game][exe].date, minDate, maxDate)
            echo(`  - \x1b[${color}m${exe._link(GL[game][exe].path)}\x1b[90m${' '.repeat(sp < 0 ? 1 : sp)}${GL[game][exe].short}\x1b[0m`)
        }
    }
}

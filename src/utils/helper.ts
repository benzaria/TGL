import { clear, log as echo } from 'console'
import { stdin, stdout, exit } from 'process'
import { main } from '..'

function dateColor(date: Date, minDate: number, maxDate: number) {
    const dateValue = new Date(date).getTime()
    const ratio = (dateValue - minDate) / (maxDate - minDate)
    const obj: { [key: number]: AnsiStyles } = { 
        0: 'redBright', 1: 'yellowBright', 2: 'greenBright', 3: 'cyanBright', 4: 'blueBright' 
    }
    return obj[Math.round(4 * ratio) as keyof typeof obj]
}

function randColor(min: number = 91, max: number = 97) {
    return Math.floor(Math.random() * (max - min) + min)
}

function keypress() {
    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding('utf8')
    stdout.write('\x1b[?1000h')
    stdin.on('data', (buf) => {
        //@ts-ignore
        if (buf === 'q' || buf === '\u0003')
            cleanup()
        //@ts-ignore
        if (buf === 'r') {
            clear()
            main()
        }
    })

}

function cleanup() {
    echo('Exiting...')
    stdout.write('\x1b[?1000l')
    stdout.write('\x1b[?1049l')
    exit()
}


export { dateColor, randColor, keypress, cleanup }

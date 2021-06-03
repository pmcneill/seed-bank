export function to_ms(time: string) {
  time = time.trim().toLowerCase()

  if ( time === "dnf" ) {
    return -1
  }

  time = time.replace(/[^0-9.:]/g, '')

  let parts = time.split(':').reverse().map((v) => parseFloat(v) || 0),
    result = 0

  result = parts[0]

  if ( parts[1] ) {
    result += parts[1] * 60
  }

  if ( parts[2] ) {
    result += parts[2] * 3600
  }

  return Math.floor(result * 1000)
}

export function from_ms(time: number) {
  if ( time < 0 ) return "DNF"
  if ( time === 0 ) return ""

  let parts : Array<string> = []

  time = Math.floor(time / 1000)
  let ms : string | number = Math.floor((time % 1000) / 100)

  parts[0] = "" + Math.floor(time / 3600)
  time = time % 3600

  let mins = Math.floor(time / 60)

  if ( mins < 10 ) {
    parts[1] = "0" + mins
  } else {
    parts[1] = "" + mins
  }
  time = time % 60

  if ( time < 10 ) {
    parts[2] = `0${time}.${ms}`
  } else {
    parts[2] = `${time}.${ms}`
  }

  return parts.join(':')
}

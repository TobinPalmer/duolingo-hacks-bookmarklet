const logger = document.createElement('div')

export function addLogger() {
  document.body.appendChild(logger)
  const { style } = logger
  logger.id = 'logger'
  style.position = 'fixed'
  style.bottom = '0'
  style.top = '0'
  style.backgroundColor = 'white'
  style.padding = '10px'
  style.border = '1px solid black'
  style.zIndex = '1000'
  style.maxHeight = '250px'
  style.overflow = 'auto'
  style.width = '300px'
  style.display = 'flex'
  style.flexDirection = 'column-reverse'
}

export function log(...data: unknown[]) {
  logger.innerHTML += `${data.join(' ')}<br>`
}

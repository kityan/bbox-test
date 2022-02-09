const gm = require('gm').subClass({ imageMagick: true })

/**
 * Чтение метанданных изображения, расчёт геометрических размеров
 * @param {string} image Путь к файлу
 * @returns {Promise}
 */
module.exports = async image => {
  return new Promise((resolve, reject) => {
    gm(image)
      .identify(
        (error, data) => {
          if (error) {
            reject(error)
          } else {
            const { size: { width: widthPx, height: heighPx }, Resolution } = data
            if (!widthPx || !heighPx || !Resolution || !Resolution.match(/\d+x\d+/)) {
              reject(new Error('Incorrect metadata'))
            }
            const [dpiX, dpiY] = Resolution.split('x').map(item => +item)
            const cmInch = 2.54
            const widthMeters = widthPx / (dpiX / cmInch) / 100
            const heightMeters = heighPx / (dpiY / cmInch) / 100
            resolve({ widthPx, heighPx, widthMeters, heightMeters, dpiX, dpiY })
          }
        }
      )
  })
}


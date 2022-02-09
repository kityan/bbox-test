const getImageSizeData = require('./getImageSizeData')
const turf = require('turf')

module.exports = async (imageFilePath, viewerParams) => {

  const { scaleFactor, center: { lat, lng }, precision } = viewerParams

  // используемый в getImageSizeData модуль gm медленно работает с большими данными, поскольку вызывает `imagemagick -verbose`
  // следует рассмотреть другие варианты получения пиксельных размеров и разрешений изображения

  const { widthMeters, heightMeters } = await getImageSizeData(imageFilePath)

  // bbox в географических координатах, полученный с учётом геометрических размеров изображения на основе пиксельных размеров и dpi,
  // а также заданного географическими координатами центра планшета, в который помещается центр изображения

  const halfHeightMeters = heightMeters / 2
  const halfWidthMeters = widthMeters / 2

  const [southLat, northLat, westLng, eastLng] =
    [
      [180, halfHeightMeters],
      [0, halfHeightMeters],
      [270, halfWidthMeters],
      [90, halfWidthMeters],
    ]
      .map(([bearing, distance]) => turf.destination([lng, lat], distance, bearing, 'meters'))
      .map((feature, index) => +feature.geometry.coordinates[index < 2 ? 1 : 0].toFixed(precision.bboxGeo))

  const bboxGeo = { southLat, northLat, westLng, eastLng }

  // bbox в см относительно центра планшета (берётся за начало координат)

  const halfHeightCm = halfHeightMeters * 100
  const halfWidthCm = halfWidthMeters * 100

  const [bottomDiff, topDiff, leftDiff, rightDiff] =
    [
      [halfHeightCm, 1],
      [halfHeightCm, -1],
      [halfWidthCm, -1],
      [halfWidthCm, 1],
    ]
      .map(([dist, dir]) => {
        return dir * (dist / scaleFactor).toFixed(precision.bboxDiffCm)
      })

  const bboxDiffCm = { bottomDiff, topDiff, leftDiff, rightDiff }

  return {
    bboxGeo,
    bboxDiffCm
  }
}


(async () => {

  const calc = require('./modules/calc')

  const viewerParams = {
    scaleFactor: 10000,
    center: {
      lat: 55,
      lng: 37
    },
    precision: {
      bboxGeo: 8,
      bboxDiffCm: 8,
    }
  }


  const name = './10000x1000x10dpi.jpg'
  console.log(await calc(name, viewerParams))

})()

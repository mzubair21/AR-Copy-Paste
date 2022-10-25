function pasteImage(filename, layerName, x, y) {
  var fileRef = new File(filename)
  var doc = app.activeDocument

  doc.artLayers.add()
  var curr_file = app.open(fileRef)
  curr_file.selection.selectAll()
  curr_file.selection.copy()
  curr_file.close()

  doc.paste()
  doc.activeLayer.name = layerName
  if (x < -12) {
    x = -12
  }
  if (y > -5) {
    y = -5
  }
  doc.activeLayer.translate(0, 0)
  try {
    doc.activeLayer.move(
      doc.layers[doc.layers.length - 1],
      ElementPlacement.PLACEBEFORE,
    )
  } catch (e) {
    alert(e)
  }
}

function getTopLeft() {
  try {
    var r = new ActionReference()
    executeActionGet(r)
      .getObjectValue(stringIDToTypeID('viewInfo'))
      .getObjectValue(stringIDToTypeID('activeView'))
      .getObjectValue(stringIDToTypeID('globalBounds'))
    alert(t)
  } catch (e) {
    alert(e)
  }
}

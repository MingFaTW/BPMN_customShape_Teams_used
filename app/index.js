/* eslint-env browser */

import pizzaDiagram from '../resources/pizza-collaboration.bpmn';

//import customElements from './custom-elements.json';

import CustomModeler from './custom-modeler';

var modeler = new CustomModeler({
  container: '#canvas',
  keyboard: {
    bindTo: document
  }
});

modeler.importXML(pizzaDiagram).then(() => {
  modeler.get('canvas').zoom('fit-viewport');

  //modeler.addCustomElements(customElements);
}).catch(err => {
  console.error('something went wrong:', err);
});

var downloadButton = document.getElementById('downloadButton');

downloadButton.addEventListener('click', function() {
  var custom = modeler.getCustomElements();
  custom = JSON.stringify(custom);
  console.log(custom);
  download(custom, 'classroom.txt', 'text/plain');
});

function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

var downloadXMLbtn = document.getElementById('downloadxml');




// expose bpmnjs to window for debugging purposes
//window.bpmnjs = modeler;

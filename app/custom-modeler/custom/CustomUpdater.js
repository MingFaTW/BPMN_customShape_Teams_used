import inherits from 'inherits-browser';

import {
  pick,
  assign
} from 'min-dash';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import {
  add as collectionAdd,
  remove as collectionRemove
} from 'diagram-js/lib/util/Collections';


/**
 * A handler responsible for updating the custom element's businessObject
 * once changes on the diagram happen.
 */
export default function CustomUpdater(eventBus, modeling, bpmnjs) {

  CommandInterceptor.call(this, eventBus);

  function updateCustomElement(e) {
    var context = e.context,
        shape = context.shape,
        businessObject = shape.businessObject;

    if (!isCustom(shape)) {
      return;
    }

    var parent = shape.parent;

    var customElements = bpmnjs._customElements;

    // make sure element is added / removed from bpmnjs.customElements
    if (!parent) {
      collectionRemove(customElements, businessObject);
    } else {
      collectionAdd(customElements, businessObject);
    }

    // save custom element position
    assign(businessObject, pick(shape, [ 'x', 'y' ]));
    assign(businessObject, {id : businessObject.id});
    assign(businessObject, { MacAddress: '1A-2B-3C-4D-5E-6F' });
    assign(businessObject, {stuNumber: 'CBB111000'});
    assign(businessObject, {stuName: '王小明'});

    // Update ID based on shape type
    var id = getType(shape);
    businessObject.id = id + ('00' + getId(id)).slice(-2);
  }

// Function to get the shape type
  function getType(shape) {
    // Define a mapping of shape type to type
    var typeMap = {
      'custom:circle': 'Leftseat_',
      'custom:triangle': 'Rightseat_',
      'custom:rectangle': 'door_',
      // test :)
      'custom:TestForType': 'Desk'
    };

    // Get the type based on the shape type
    var type = typeMap[shape.type];

    return type;
  }

// Function to get the current shape for the ID
  function getId(id) {
    // Initialize the counter if it doesn't exist
    getId.counter = getId.counter || {};
    // Initialize the counter for the specific prefix if it doesn't exist
    getId.counter[id] = getId.counter[id] || 0;
    // Increment the counter
    getId.counter[id]++;
    // Return the counter value
    return getId.counter[id];
  }



  function updateCustomConnection(e) {

    var context = e.context,
        connection = context.connection,
        source = connection.source,
        target = connection.target,
        businessObject = connection.businessObject;

    var parent = connection.parent;

    var customElements = bpmnjs._customElements;

    // make sure element is added / removed from bpmnjs.customElements
    if (!parent) {
      collectionRemove(customElements, businessObject);
    } else {
      collectionAdd(customElements, businessObject);
    }

    // update waypoints
    assign(businessObject, {
      waypoints: copyWaypoints(connection)
    });

    if (source && target) {
      assign(businessObject, {
        source: source.id,
        target: target.id
      });
    }

  }

  this.executed([
    'shape.create',
    'shape.move',
    'shape.delete'
  ], ifCustomElement(updateCustomElement));

  this.reverted([
    'shape.create',
    'shape.move',
    'shape.delete'
  ], ifCustomElement(updateCustomElement));

  this.executed([
    'connection.create',
    'connection.reconnectStart',
    'connection.reconnectEnd',
    'connection.updateWaypoints',
    'connection.delete',
    'connection.layout',
    'connection.move'
  ], ifCustomElement(updateCustomConnection));

  this.reverted([
    'connection.create',
    'connection.reconnectStart',
    'connection.reconnectEnd',
    'connection.updateWaypoints',
    'connection.delete',
    'connection.layout',
    'connection.move'
  ], ifCustomElement(updateCustomConnection));


  /**
   * When morphing a Process into a Collaboration or vice-versa,
   * make sure that the existing custom elements get their parents updated.
   */
  function updateCustomElementsRoot(event) {
    var context = event.context,
        oldRoot = context.oldRoot,
        newRoot = context.newRoot,
        children = oldRoot.children;

    var customChildren = children.filter(isCustom);

    if (customChildren.length) {
      modeling.moveElements(customChildren, { x: 0, y: 0 }, newRoot);
    }
  }

  this.postExecute('canvas.updateRoot', updateCustomElementsRoot);
}

inherits(CustomUpdater, CommandInterceptor);

CustomUpdater.$inject = [ 'eventBus', 'modeling', 'bpmnjs' ];


// helpers ///////////////////////////////////

function copyWaypoints(connection) {
  return connection.waypoints.map(function(p) {
    return { x: p.x, y: p.y };
  });
}

function isCustom(element) {
  return element && /custom:/.test(element.type);
}

function ifCustomElement(fn) {
  return function(event) {
    var context = event.context,
        element = context.shape || context.connection;

    if (isCustom(element)) {
      fn(event);
    }
  };
}
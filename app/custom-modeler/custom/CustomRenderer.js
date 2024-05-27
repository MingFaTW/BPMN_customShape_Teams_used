import inherits from 'inherits-browser';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  componentsToPath,
  createLine
} from 'diagram-js/lib/util/RenderUtil';

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg';

var COLOR_GREEN = '#52B415',
    COLOR_RED = '#cc0000',
    COLOR_YELLOW = '#ffc800',
    COLOR_BLACK = '#000000';

/**
 * A renderer that knows how to render custom elements.
 */
export default function CustomRenderer(eventBus, styles) {

  BaseRenderer.call(this, eventBus, 2000);

  var computeStyle = styles.computeStyle;

  this.drawRightSeat = function(p, width, height) {
    var cx = width / 2,
        cy = height / 2;

    var attrs = computeStyle(attrs, {
      stroke: COLOR_BLACK,
      strokeWidth: 1,
      fill: 'none'
    });

    var circle = svgCreate('circle');

    svgAttr(circle, {
      cx: cx,
      cy: cy,
      r: Math.round((width + height) / 4)
    });

    svgAttr(circle, attrs);

    svgAppend(p, circle);

    var rect = svgCreate('rect');

    svgAttr(rect, {
      x: width-130,
      y: -10,
      width: width+50,
      height: height+20,
      stroke: COLOR_BLACK,
      strokeWidth: 1,
      fill: 'none'
    });

    svgAppend(p, rect);

    return circle;
  };

  this.getRightSeatPath = function(shape) {
    var cx = shape.x + shape.width / 2,
        cy = shape.y + shape.height / 2,
        radius = shape.width / 2;

    var circlePath = [
      [ 'M', cx, cy ],
      [ 'm', 0, -radius ],
      [ 'a', radius, radius, 0, 1, 1, 0, 2 * radius ],
      [ 'a', radius, radius, 0, 1, 1, 0, -2 * radius ],
      [ 'z' ]
    ];

    return componentsToPath(circlePath);
  };

  this.drawLeftSeat = function(p, width, height) {
    var cx = width / 2,
        cy = height / 2;

    var attrs = computeStyle(attrs, {
      stroke: COLOR_BLACK,
      strokeWidth: 1,
      fill: 'none'
    });

    var circle = svgCreate('circle');

    svgAttr(circle, {
      cx: cx,
      cy: cy,
      r: Math.round((width + height) / 4)
    });

    svgAttr(circle, attrs);

    svgAppend(p, circle);

    var rect = svgCreate('rect');

    svgAttr(rect, {
      x: width,
      y: -10,
      width: width+50,
      height: height+20,
      stroke: COLOR_BLACK,
      strokeWidth: 1,
      fill: 'none'
    });

    svgAppend(p, rect);

    return circle;
  };

  this.getLeftSeatPath = function(shape) {
    var cx = shape.x + shape.width / 2,
        cy = shape.y + shape.height / 2,
        radius = shape.width / 2;

    var circlePath = [
      [ 'M', cx, cy ],
      [ 'm', 0, -radius ],
      [ 'a', radius, radius, 0, 1, 1, 0, 2 * radius ],
      [ 'a', radius, radius, 0, 1, 1, 0, -2 * radius ],
      [ 'z' ]
    ];

    return componentsToPath(circlePath);
  };

  this.drawTestForType = function(p, width, height){
    var attrs = computeStyle(attrs, {
      stroke: COLOR_BLACK,
      strokeWidth: 2,
      fill: 'none'
  });

  var rect = svgCreate('rect');

  svgAttr(rect, {
      x: 0,
      y: 0,
      width: width,
      height: height,
      stroke: COLOR_BLACK,
  });

  svgAttr(rect, attrs);

  svgAppend(p, rect);

  return rect;
};

this.getTestForType = function(shape){
  var cx = shape.x + shape.width / 2,
  cy = shape.y + shape.height / 2,
  radius = shape.width / 2;

    var circlePath = [
    [ 'M', cx, cy ],
    [ 'm', 0, -radius ],
    [ 'a', radius, radius, 0, 1, 1, 0, 2 * radius ],
    [ 'a', radius, radius, 0, 1, 1, 0, -2 * radius ],
    [ 'z' ]
    ];

  return componentsToPath(circlePath);
};

this.drawCustomConnection = function(p, element) {
  var attrs = computeStyle(attrs, {
    stroke: COLOR_BLACK,
    strokeWidth: 2
  });

  return svgAppend(p, createLine(element.waypoints, attrs));
};


  this.drawRectangle = function(p, width, height) {
    var attrs = computeStyle(attrs, {
        stroke: COLOR_BLACK,
        strokeWidth: 1,
        fill: 'none'
    });

    var rect = svgCreate('rect');

    svgAttr(rect, {
        x: 0,
        y: 0,
        width: width,
        height: height
    });

    svgAttr(rect, attrs);

    svgAppend(p, rect);

    return rect;
  };

  this.getRectengle = function(shape){
    var cx = shape.x + shape.width / 2,
    cy = shape.y + shape.height / 2,
    radius = shape.width / 2;
  
      var circlePath = [
      [ 'M', cx, cy ],
      [ 'm', 0, -radius ],
      [ 'a', radius, radius, 0, 1, 1, 0, 2 * radius ],
      [ 'a', radius, radius, 0, 1, 1, 0, -2 * radius ],
      [ 'z' ]
      ];
  
    return componentsToPath(circlePath);
  }


  this.drawCustomConnection = function(p, element) {
    var attrs = computeStyle(attrs, {
      stroke: COLOR_BLACK,
      strokeWidth: 2
    });

    return svgAppend(p, createLine(element.waypoints, attrs));
  };

  this.getCustomConnectionPath = function(connection) {
    var waypoints = connection.waypoints.map(function(p) {
      return p.original || p;
    });

    var connectionPath = [
      [ 'M', waypoints[0].x, waypoints[0].y ]
    ];

    waypoints.forEach(function(waypoint, index) {
      if (index !== 0) {
        connectionPath.push([ 'L', waypoint.x, waypoint.y ]);
      }
    });

    return componentsToPath(connectionPath);
  };
}

inherits(CustomRenderer, BaseRenderer);

CustomRenderer.$inject = [ 'eventBus', 'styles' ];


CustomRenderer.prototype.canRender = function(element) {
  return /^custom:/.test(element.type);
};

CustomRenderer.prototype.drawShape = function(p, element) {
  var type = element.type;

  if (type === 'custom:triangle') {
    return this.drawRightSeat(p, element.width, element.height);
  }

  if (type === 'custom:circle') {
    return this.drawLeftSeat(p, element.width, element.height);
  }

  if (type === 'custom:rectangle') {
    return this.drawRectangle(p, element.width, element.height);
  }

  if (type === 'custom:TypeForTest'){
    return this.drawTestForType(p, element.width, element.height);
  }
};

CustomRenderer.prototype.getShapePath = function(shape) {
  var type = shape.type;

  if (type === 'custom:triangle') {
    return this.getRightSeatPath(shape);
  }

  if (type === 'custom:circle') {
    return this.getLeftSeatPath(shape);
  }

  if (type === 'custom:rectangle') {
    return this.getRectengle(shape);
  }

  if (type === 'custom:TypeForTest'){
    return this.getTestForType(shape);
  }
};

CustomRenderer.prototype.drawConnection = function(p, element) {

  var type = element.type;

  if (type === 'custom:connection') {
    return this.drawCustomConnection(p, element);
  }
};


CustomRenderer.prototype.getConnectionPath = function(connection) {

  var type = connection.type;

  if (type === 'custom:connection') {
    return this.getCustomConnectionPath(connection);
  }
};

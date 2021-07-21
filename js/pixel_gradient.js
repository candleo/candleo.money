/* -------------- POINT.JS ------------*/
var Point = function (x, y) {
  this.x = x;
  this.y = y;
};

Point.prototype = {
  x: 0,
  y: 0,
  subtract: function (p) {
    return new Point(this.x - p.x, this.y - p.y);
  },

  add: function (p) {
    return new Point(this.x + p.x, this.y + p.y);
  },

  clone: function () {
    return new Point(this.x, this.y);
  },

  getNormal: function () {
    return new Point(-this.y, this.x);
  },

  angle: function () {
    return Math.atan2(this.y, this.x);
  },

  fromPolar: function (angle, length) {
    var l = length || 1;
    return new Point(l * Math.cos(angle), l * Math.sin(angle));
  },

  lerp: function (a, b, pi) {
    this.x = pi * b.x + (1 - pi) * a.x;
    this.y = pi * b.y + (1 - pi) * a.y;
    return this;
  },

  scaleBy: function (amt) {
    this.x *= amt;
    this.y *= amt;
    return this;
  },

  length: function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },
  dot: function (b) {
    return this.x * b.x + this.y * b.y;
  },

  normalize: function (len) {
    var mag = len || 1;
    var curLen = this.length();
    this.x /= curLen / mag;
    this.y /= curLen / mag;
    return this;
  },

  mean: function (pointList) {
    var x = 0;
    var y = 0;
    for (var i = 0; i < pointList.length; i++) {
      x += pointList[i].x;
      y += pointList[i].y;
    }
    x /= pointList.length;
    y /= pointList.length;
    return new Point(x, y);
  },
};

/*------------UTIL.JS------------*/

var Util = {
  STANDARD: 0,
  REQUIRES_POSITIVE_T: 1,
  REQUIRES_POSITIVE_U: 2,
  REQUIRES_POSITIVE_BOTH: 3,
  scalePoints: function (pts, amount, origin) {
    var outPoints = [];
    if (origin == null) {
      origin = new Point().mean(pts);
    }

    for (var i = 0; i < pts.length; i++) {
      var pIn = pts[i];
      var pOut = pts[i].subtract(origin).scaleBy(amount).add(origin);
      outPoints.push(pOut);
    }

    return outPoints;
  },
  reflect: function (ray, normal) {
    var v = ray.clone();
    var l = normal.clone();
    v.normalize();
    l.normalize();
    var reflection = l.scaleBy((2 * v.dot(l)) / l.dot(l)).subtract(v);
    return reflection;
  },

  intersectPolygon: function (a_p1, a_r1, polygon, mode) {
    //let's look for the one with the lowest positive t-value...
    // x("checking...",a_p1,a_r1,polygon);
    if (mode == undefined) mode == 1;

    var points = polygon.points;
    var collisionCandidates = [];
    var sideLength = points[0].subtract(points[1]).length();

    for (var i = 0; i < points.length; i++) {
      var p2 = points[i];
      var pNext = points[(i + 1) % points.length];
      var r2 = points[i].subtract(pNext);
      r2.normalize();
      var colSet = Util.intersect(a_p1, a_r1, points[i], r2);
      colSet.a = p2;
      colSet.b = pNext;

      if (Math.abs(colSet.tValue) > 1e-5) {
        if (mode == 1 && colSet.tValue > 0) collisionCandidates.push(colSet);
        if (mode == 2 && colSet.uValue > 0) collisionCandidates.push(colSet);
        if (mode == 0) {
          colSet.tValue = Math.abs(colSet.tValue);

          collisionCandidates.push(colSet);
        }
        if (
          mode == 3 &&
          colSet.tValue > 0 &&
          colSet.uValue > 0 &&
          colSet.uValue < sideLength
        ) {
          collisionCandidates.push(colSet);
        }
      }
    }
    if (collisionCandidates.length == 0) {
      return null;
    }
    collisionCandidates.sort(function (a, b) {
      return a.tValue - b.tValue;
    });

    var best = collisionCandidates[0];
    // console.log(best);
    var pt = new Point(best.xIntercept, best.yIntercept);
    pt.tValue = best.tValue;
    pt.uValue = best.uValue;
    console.log("adding an a and b - ", best.a, best.b);
    pt.a = best.a;
    pt.b = best.b;
    return pt;
  },

  intersect: function (a_p1, a_r1, a_p2, a_r2) {
    a_r1.normalize(1);
    a_r2.normalize(1);
    var returner = new Object();
    try {
      var ta = a_r1.y / a_r1.x;
      var tb = a_p1.y - ta * a_p1.x;

      var tc = a_r2.y / a_r2.x;
      var td = a_p2.y - tc * a_p2.x;
      /*trace("Intermediaries:\n-----------");
				we have y = ax+b
				and y=cx+d.
				if c
				
				*/

      /*trace("a:"+ta);
				trace("b:"+tb);
				trace("c:"+tc);
				trace("d:"+td);
				*/
      returner.xIntercept = (td - tb) / (ta - tc);
      returner.yIntercept = ta * returner.xIntercept + tb;

      if (Math.abs(ta) == Infinity) {
        //r1 is vertical
        returner.xIntercept = a_p1.x;
        returner.yIntercept = tc * returner.xIntercept + td;
      } else if (Math.abs(tc) == Infinity) {
        //r2 is vertical
        returner.xIntercept = a_p2.x;
        returner.yIntercept = returner.xIntercept * ta + tb;
      } else if (Math.abs(ta) == 0) {
        //r1 is horizontal
        returner.yIntercept = a_p2.y; //
        returner.xIntercept = (returner.yIntercept - td) / tc;
      }
      var m = returner.xIntercept;
      var p = a_p1.x;
      var q = a_r1.x;
      /*
       * The approach that seems to work more robustly is
       * that we have the x-intercept.
       * if we divide the difference between the origin, a_p1.x, by the
       * ray's x magnitude, a_p1.x-a_r1.x,
       * */

      // returner.tValue  = (returner.xIntercept - a_p1.x) / (a_r1.x);
      if (returner.xIntercept == a_p1.x) {
        //we'll use yIntercept.
        // returner.tValue = (returner.yIntercept - a_p1.y) / (a_r1.y);
      }

      returner.tValue = (a_p1.x - returner.xIntercept) / a_r1.x;
      returner.uValue = (a_p2.x - returner.xIntercept) / a_r2.x;
      // if (returner.xIntercept == a_r2.x) {
      // we'll use yIntercept.
      // returner.uValue = (returner.yIntercept - a_r2.y) / (a_r2.y);
      // }

      returner.mirrorPi = (returner.xIntercept - a_r2.x) / (a_p2.x - a_r2.x);
    } catch (e) {}
    returner.point = new Point(returner.xIntercept, returner.yIntercept);
    return returner;
  },
  drawSketchStroke: function (a, b, g, extension, innerAlpha, jitter) {
    if (extension == null) extension = 100;
    if (innerAlpha == null) innerAlpha = 1;
    if (jitter == null) jitter = 0;
    var len = a.subtract(b).length();
    var overshootAmount = (len + extension) / len;
    var overshoot = Util.scalePoints([a, b], overshootAmount);

    g.beginPath();

    // var grad = g.createLinearGradient(mousePoint.x,mousePoint.y, os.points[i].x,os.points[i].y);
    var grad = g.createLinearGradient(
      overshoot[0].x,
      overshoot[0].y,
      overshoot[1].x,
      overshoot[1].y
    );
    grad.addColorStop(0, "rgba(20,0,0,0)");
    grad.addColorStop(0.1, "rgba(20,0,0," + innerAlpha + ")");
    grad.addColorStop(0.9, "rgba(20,0,0," + innerAlpha + ")");
    grad.addColorStop(1, "rgba(20,0,0,0)");
    g.strokeStyle = grad;
    // this.drawRay(os.points[i], ray, g);
    g.moveTo(overshoot[0].x, overshoot[0].y);
    var segments = 10;
    var normal = a.subtract(b).normalize().getNormal();
    for (var i = 0; i < segments; i++) {
      var normalOffset = normal.clone().scaleBy((Math.random() - 0.5) * jitter);
      var pInternal = new Point().lerp(a, b, i / segments).add(normalOffset);
      g.lineTo(pInternal.x, pInternal.y);
    }

    g.lineTo(overshoot[1].x, overshoot[1].y);

    g.stroke();
  },

  drawRay: function (p, r, g, drawHead) {
    if (drawHead == null) drawHead = false;
    g.moveTo(p.x, p.y);

    var headSize = 10;
    var tangent = r;
    tangent.normalize();
    normal = tangent.getNormal();

    var head = new Point(p.x + 100 * r.x, p.y + 100 * r.y);

    g.lineTo(p.x + 1000 * r.x, p.y + 1000 * r.y);
    if (drawHead) {
      g.moveTo(head.x, head.y);
      g.lineTo(
        head.x + headSize * normal.x - headSize * tangent.x,
        head.y + headSize * normal.y - headSize * tangent.y
      );
      g.moveTo(head.x, head.y);
      g.lineTo(
        head.x - headSize * normal.x - headSize * tangent.x,
        head.y - headSize * normal.y - headSize * tangent.y
      );
    }
  },
};

/*-------REGULARPOLYGON.JS--------*/

var RegularPolygon = function (center, radius, sides, angleOffset) {
  this.init(center, radius, sides, angleOffset);
};
RegularPolygon.prototype = {
  points: [],
  fillColor: null,
  init: function (center, radius, sides, angleOffset) {
    angleOffset = angleOffset || 0;
    sides = sides || 3;
    var theta = (2 * Math.PI) / sides;
    this.points = [];
    for (var i = 0; i < sides; i++) {
      var pt = new Point(
        center.x + radius * Math.sin(angleOffset + i * theta),
        center.y - radius * Math.cos(angleOffset + i * theta)
      );
      this.points.push(pt);
    }
  },

  isInside: function isInside(p) {
    //first, we generate a ray that enters from the left and passes through the polygon through the point in question. Then we count the number of intersections
    //- if it's odd, it's inside
    //- if it's even, it's outside.

    //generate the ray origin

    var rayOrigin = new Point(p.x - 1000, p.y + 10);

    for (var i = 0; i < this.points.length; i++) {
      var pI = this.points[(i + this.points.length + 0) % this.points.length];
      var pN = this.points[(i + this.points.length + 1) % this.points.length];

      var rN = pI.subtract(pN).normalize();
      var r2 = rayOrigin.subtract(p);
      var ii = Util.intersect(rayOrigin, r2, pI, rN);

      if (ii) {
        g.beginPath();
        g.fillStyle = "rgba(255,255,255,0.5)";
        g.arc(ii.point.x, ii.point.y, 4, 0, 7);
        g.fill();
      }
    }
  },

  draw: function (g) {
    g.beginPath();
    if (this.fillColor) g.fillStyle = this.fillColor;
    if (this.strokeStyle) g.strokeStyle = this.strokeStyle;
    if (this.lineWidth) g.lineWidth = this.lineWidth;
    g.moveTo(this.points[0].x, this.points[0].y);
    for (var i = 0; i < this.points.length; i++) {
      g.lineTo(this.points[i].x, this.points[i].y);
    }
    g.lineTo(this.points[0].x, this.points[0].y);
    if (this.fillColor) {
      // console.log("finishing?");
      g.fill();
    }
    if (this.strokeStyle) g.stroke();
  },

  drawRounded: function (radius, g, offset) {
    // radius =1;
    if (this.lineWidth != null) g.lineWidth = this.lineWidth;
    if (this.fillColor) g.fillStyle = this.fillColor;
    if (this.strokeStyle) g.strokeStyle = this.strokeStyle;
    g.beginPath();

    var polyPoints = [];

    //we need to be able to shift the points in and out...
    var pts = this.points;

    var newPts = [];

    var p = this.points;
    g.beginPath();

    //----PATH OFFSET

    for (var i = 0; i < this.points.length; i++) {
      //TODO resolve this to compensate for acute angles! There needs to be a feature of this that includes the sin of the angle, or maybe 1/sin, since offsets have to be pushed out further if we're working on mitre offsets.

      var pI = p[i];
      var pL = p[(i + p.length - 1) % p.length];
      var pN = p[(i + p.length + 1) % p.length];

      var rL = pL.subtract(pI).normalize(); //.add(pI);
      var rN = pN.subtract(pI).normalize(); //.add(pI);
      var nL = rL.getNormal();
      var nN = rN.getNormal();
      var thisAngle = rL.angle() - rN.angle();
      var concave = thisAngle > 0 || Math.abs(thisAngle) > Math.PI;
      var thisOffset = offset / Math.sin(thisAngle);
      var avgN = new Point().lerp(rL, rN, 0.5);
      avgN.scaleBy(concave ? thisOffset : thisOffset);
      newPts.push(pI.subtract(avgN));
      // lt(pI.subtract(avgN),g);
    }
    // lt(newPts[0],g);
    // g.stroke();

    pts = newPts;

    //CORNER ROUNDING

    for (var i = 0; i < pts.length; i++) // for(var i =0;i<;i++)
    {
      var pI = pts[i];
      var pL = pts[(i + pts.length - 1) % pts.length];
      var pN = pts[(i + pts.length + 1) % pts.length];

      var rL = pL.subtract(pI).normalize(); //.add(pI);
      var rN = pN.subtract(pI).normalize(); //.add(pI);

      var thisAngle = rL.angle() - rN.angle();
      var concave = thisAngle > 0 || Math.abs(thisAngle) > Math.PI;
      if (thisAngle > Math.PI && thisAngle < Math.PI * 2) concave = false;
      var sign = concave ? 1 : -1;
      var theta = thisAngle / 1;
      var radiusI = Math.max(1, radius + offset * sign);
      var radInset = radiusI / Math.sin(theta);
      //next, the relative points:
      g.fillStyle = "white";
      //so we have the inset, which is where to cast back  from.
      // g.fillText(radInset.toFixed(2),pI.x,pI.y+20);
      // g.fillText((thisAngle*57).toFixed(1)+", "+ concave,pI.x,pI.y+30);

      var avgN = new Point().lerp(rL, rN, 0.5);
      avgN.scaleBy(concave ? radInset : -radInset);
      // g.beginPath();
      // mt(pI,g);
      // lt(pI.add(avgN),g);
      // g.stroke();

      // rL.scaleBy(radiusI);
      // rN.scaleBy(radiusI);
      var nL = rL.getNormal();
      var nN = rN.getNormal();

      nL.scaleBy((radiusI / 2) * sign);
      nN.scaleBy((radiusI / 2) * sign);

      rL = rL.add(pI);
      var insetPoint = pI.add(avgN);

      var oldStroke = g.strokeStyle;
      // g.strokeStyle = "red";
      g.beginPath();

      // g.arc(insetPoint.x,insetPoint.y,4,0,7);

      g.stroke();
      g.strokeStyle = oldStroke;

      g.beginPath();
      // g.arc(insetPoint.x,insetPoint.y,Math.abs(radiusI)/2,0,7);

      g.stroke();

      g.beginPath();
      // g.arc(insetPoint.x,insetPoint.y,4,0,7);

      g.stroke();

      rL = insetPoint.add(nL);
      rN = insetPoint.subtract(nN);
      // g.beginPath();
      // g.arc(rL.x,rL.y,2,0,7);

      // g.stroke();
      // g.beginPath();
      // g.arc(rN.x,rN.y,2,0,7);

      // g.stroke();

      //then the two corners are actually radiusI*nL+insetPoint and radiusI*nR+insetPoint.

      // var insetPoint =  rL.add(rN);
      //now maybe we can get the circle
      // rN = rN.add(pI);

      polyPoints.push(rL);
      polyPoints.push(rN);

      //then we need to cast that back to r from the

      var rI = insetPoint;
      // .subtract(pI);
      // rI.normalize();
      // rI.scaleBy(radius);
      // rI = rI.add(pI);

      // g.stroke();
      // g.lineWidth = 1;
      // g.fillStyle = "green";
      // g.beginPath();
      // g.arc(rN.x,rN.y,5,0,7);
      // g.fill();

      // g.fillStyle = "blue";
      // g.beginPath();
      // g.arc(rL.x,rL.y,5,0,7);
      // g.fill();

      // g.fillStyle = "black";
      // g.beginPath();
      // g.arc(insetPoint.x,insetPoint.y,5,0,7);
      // g.fill();

      var theta1 = Math.atan2(rN.y - insetPoint.y, rN.x - insetPoint.x);
      var theta2 = Math.atan2(rL.y - insetPoint.y, rL.x - insetPoint.x);

      //maybe we should try a quadraticcurveto...

      // g.lineWidth = 1;
      if (false && new Date().getTime() % 2000 > 1000) {
        g.moveTo(rL.x, rL.y);
        // g.quadraticCurveTo(pI.x,pI.y,rN.x,rN.y);
      } else {
        g.beginPath();
        if (concave) g.arc(rI.x, rI.y, radiusI / 2, theta2, theta1);
        else g.arc(rI.x, rI.y, radiusI / 2, theta1, theta2);
      }
      g.stroke();

      //so that's good. we have the points and we have the radii we'll need to grab the points for:
    }

    g.lineWidth = this.lineWidth;

    //---LINE SEGMENTS

    g.beginPath();
    if (polyPoints.length < 1) return;
    g.moveTo(polyPoints[0].x, polyPoints[0].y);
    for (var i = 1; i < polyPoints.length - 1; i += 2) {
      g.moveTo(polyPoints[i].x, polyPoints[i].y);
      g.lineTo(polyPoints[i + 1].x, polyPoints[i + 1].y);
    }
    g.moveTo(
      polyPoints[polyPoints.length - 1].x,
      polyPoints[polyPoints.length - 1].y
    );
    g.lineTo(polyPoints[0].x, polyPoints[0].y);

    if (this.fillColor) {
      g.fill();
    }

    if (this.strokeStyle) g.stroke();
  },

  end: null,
};

var c = document.createElement("canvas");
document.body.appendChild(c);
var g = c.getContext("2d");
c.width = window.innerWidth;

function update() {
  c.height = window.innerHeight;
  var count = c.width / 17;
  for (var y = 0; y < 43; y++) {
    for (var i = 0; i < count; i++) {
      var even = (i + y) % 2 == 0;

      var rpI = new RegularPolygon(
        new Point(50 + 17 * i, 30 * y + (even ? 200 : 190) - 200),
        20.2,
        3,
        even ? 0 : Math.PI
      );
      rpI.fillColor =
        "rgba(0,0,0," +
        (i / count +
          0.1 *
            (0.5 +
              0.45 *
                Math.sin(
                  (((y / 323.62) * i) / 5) * new Date().getTime() * 0.01
                ))) +
        ")";
      rpI.draw(g);
    }
  }
  requestAnimationFrame(update);
}

update();

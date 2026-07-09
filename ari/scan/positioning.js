/*
 * positioning.js
 *
 * Small reusable positioning API for the Null Zone scan page.
 * It contains no UI code and no DOM access.
 *
 * Coordinate conventions:
 * - Local world frame is ENU: east, north, up, in meters.
 * - Phone/device axes follow DeviceOrientationEvent:
 *   x = right side of screen, y = top edge of screen, z = out of screen.
 * - Screen angles are clockwise degrees, with 0 deg at the top edge of the screen.
 */

export const DEFAULT_TARGET = Object.freeze({
  latitude: 48.174407212691555,
  longitude: 11.553772632411054,
  altitudeM: 810
});

export const DEFAULT_POSITIONING_OPTIONS = Object.freeze({
  fallbackAltitudeAccuracyM: 30,
  assumedOrientationErrorDeg: 15
});

const R_EARTH_M = 6371008.8;

export function degToRad(deg) {
  return deg * Math.PI / 180;
}

export function radToDeg(rad) {
  return rad * 180 / Math.PI;
}

export function normalizeDeg(deg) {
  return ((deg % 360) + 360) % 360;
}

export function normalizeSignedDeg(deg) {
  const normalized = normalizeDeg(deg);
  return normalized > 180 ? normalized - 360 : normalized;
}

export function vectorLength(v) {
  return Math.hypot(v.e, v.n, v.u);
}

export function horizontalLength(v) {
  return Math.hypot(v.e, v.n);
}

export function dot(a, b) {
  return a.e * b.e + a.n * b.n + a.u * b.u;
}

export function scale(v, factor) {
  return { e: v.e * factor, n: v.n * factor, u: v.u * factor };
}

export function subtract(a, b) {
  return { e: a.e - b.e, n: a.n - b.n, u: a.u - b.u };
}

export function normalizeVector(v) {
  const length = vectorLength(v);
  if (length <= 0) return { e: 0, n: 0, u: 0 };
  return scale(v, 1 / length);
}

export function bearingDegFromENU(v) {
  return normalizeDeg(radToDeg(Math.atan2(v.e, v.n)));
}

export function elevationDegFromENU(v) {
  const length = vectorLength(v);
  return length > 0 ? radToDeg(Math.asin(v.u / length)) : 0;
}

export function targetVectorENU(current, target) {
  const lat1 = degToRad(current.latitude);
  const lat2 = degToRad(target.latitude);
  const dLat = lat2 - lat1;
  const dLon = degToRad(target.longitude - current.longitude);
  const avgLat = (lat1 + lat2) / 2;

  return {
    e: dLon * Math.cos(avgLat) * R_EARTH_M,
    n: dLat * R_EARTH_M,
    u: target.altitudeM - current.altitudeM
  };
}

export function pointToRayDistance(pointENU, rayUnitENU) {
  const alongRayM = dot(pointENU, rayUnitENU);

  if (alongRayM <= 0) {
    return {
      distanceM: vectorLength(pointENU),
      alongRayM,
      targetInFront: false
    };
  }

  const closestPoint = scale(rayUnitENU, alongRayM);
  return {
    distanceM: vectorLength(subtract(pointENU, closestPoint)),
    alongRayM,
    targetInFront: true
  };
}

/*
 * DeviceOrientationEvent rotation matrix.
 * Columns of the returned matrix are phone x/y/z axes expressed in ENU.
 *
 * This follows the common alpha/beta/gamma formula used by the
 * Device Orientation specification. Browser implementations differ in
 * details, so the result should be treated as a game/puzzle-grade sensor
 * value, not a survey instrument.
 */
export function rotationMatrixFromDeviceOrientation(orientation) {
  const alpha = degToRad(orientation?.alpha ?? 0);
  const beta = degToRad(orientation?.beta ?? 0);
  const gamma = degToRad(orientation?.gamma ?? 0);

  const cX = Math.cos(beta);
  const cY = Math.cos(gamma);
  const cZ = Math.cos(alpha);
  const sX = Math.sin(beta);
  const sY = Math.sin(gamma);
  const sZ = Math.sin(alpha);

  return [
    [cZ * cY - sZ * sX * sY, -cX * sZ, cY * sZ * sX + cZ * sY],
    [cY * sZ + cZ * sX * sY, cZ * cX, sZ * sY - cZ * cY * sX],
    [-cX * sY, sX, cX * cY]
  ];
}

export function phoneAxesENU(orientation) {
  const m = rotationMatrixFromDeviceOrientation(orientation);

  return {
    x: normalizeVector({ e: m[0][0], n: m[1][0], u: m[2][0] }),
    y: normalizeVector({ e: m[0][1], n: m[1][1], u: m[2][1] }),
    z: normalizeVector({ e: m[0][2], n: m[1][2], u: m[2][2] })
  };
}

export function angleOnPhoneScreenDeg(worldVectorENU, orientation) {
  const axes = phoneAxesENU(orientation);
  const screenX = dot(worldVectorENU, axes.x);
  const screenY = dot(worldVectorENU, axes.y);

  return normalizeDeg(radToDeg(Math.atan2(screenX, screenY)));
}

export function topOfScreenRayENU(orientation) {
  return phoneAxesENU(orientation).y;
}

export function northAngleOnPhoneScreenDeg(orientation) {
  return angleOnPhoneScreenDeg({ e: 0, n: 1, u: 0 }, orientation);
}

export function targetAngleOnPhoneScreenDeg(current, target, orientation) {
  return angleOnPhoneScreenDeg(targetVectorENU(current, target), orientation);
}

export function classifyPrecision(positionUncertainty95M) {
  if (!Number.isFinite(positionUncertainty95M)) return "unknown";
  if (positionUncertainty95M <= 10) return "strong";
  if (positionUncertainty95M <= 25) return "stable";
  if (positionUncertainty95M <= 60) return "weak";
  return "unstable";
}

export function computePositioningMetrics({
  current,
  target = DEFAULT_TARGET,
  orientation = null,
  horizontalAccuracyM = null,
  altitudeAccuracyM = null,
  options = DEFAULT_POSITIONING_OPTIONS
}) {
  const targetVector = targetVectorENU(current, target);
  const distance3dM = vectorLength(targetVector);
  const horizontalDistanceM = horizontalLength(targetVector);
  const verticalDistanceM = targetVector.u;
  const targetBearingDeg = bearingDegFromENU(targetVector);
  const targetElevationDeg = elevationDegFromENU(targetVector);

  const safeHorizontalAccuracyM = Number.isFinite(horizontalAccuracyM) ? horizontalAccuracyM : null;
  const safeAltitudeAccuracyM = Number.isFinite(altitudeAccuracyM)
    ? altitudeAccuracyM
    : options.fallbackAltitudeAccuracyM;

  const positionUncertainty95M = Math.hypot(
    safeHorizontalAccuracyM ?? 0,
    safeAltitudeAccuracyM ?? 0
  );

  const metrics = {
    current,
    target,
    targetVectorENU: targetVector,
    distance3dM,
    horizontalDistanceM,
    verticalDistanceM,
    targetBearingDeg,
    targetElevationDeg,
    horizontalAccuracyM: safeHorizontalAccuracyM,
    altitudeAccuracyM: safeAltitudeAccuracyM,
    positionUncertainty95M,
    precisionLabel: classifyPrecision(positionUncertainty95M),
    hasOrientation: false,
    rayDistanceM: null,
    rayAlongM: null,
    targetInFrontOfRay: null,
    weightedSignalDistanceM: distance3dM,
    targetAngleScreenDeg: null,
    northAngleScreenDeg: null,
    targetAngleCompassDeg: targetBearingDeg,
    rayUncertainty95M: null
  };

  if (orientation && Number.isFinite(orientation.alpha) && Number.isFinite(orientation.beta) && Number.isFinite(orientation.gamma)) {
    const ray = topOfScreenRayENU(orientation);
    const rayResult = pointToRayDistance(targetVector, ray);
    const targetAngleScreenDeg = angleOnPhoneScreenDeg(targetVector, orientation);
    const northAngleScreenDeg = northAngleOnPhoneScreenDeg(orientation);
    const orientationErrorDeg = Number.isFinite(orientation.webkitCompassAccuracy)
      ? Math.max(options.assumedOrientationErrorDeg, orientation.webkitCompassAccuracy)
      : options.assumedOrientationErrorDeg;
    const orientationUncertaintyM = distance3dM * Math.sin(degToRad(orientationErrorDeg));

    Object.assign(metrics, {
      hasOrientation: true,
      rayDistanceM: rayResult.distanceM,
      rayAlongM: rayResult.alongRayM,
      targetInFrontOfRay: rayResult.targetInFront,
      weightedSignalDistanceM: 0.5 * distance3dM + 0.5 * rayResult.distanceM,
      targetAngleScreenDeg,
      northAngleScreenDeg,
      targetAngleCompassDeg: normalizeDeg(targetAngleScreenDeg - northAngleScreenDeg),
      orientationErrorDeg,
      rayUncertainty95M: Math.hypot(positionUncertainty95M, orientationUncertaintyM)
    });
  }

  return metrics;
}

export function createAltitudeCalibrator(referenceAltitudeM) {
  let rawBaselineAltitudeM = null;

  return {
    isCalibrated() {
      return rawBaselineAltitudeM !== null;
    },

    calibrate(rawAltitudeM) {
      if (Number.isFinite(rawAltitudeM)) {
        rawBaselineAltitudeM = rawAltitudeM;
        return true;
      }
      return false;
    },

    reset() {
      rawBaselineAltitudeM = null;
    },

    getAltitude(rawAltitudeM, fallbackAltitudeM = referenceAltitudeM) {
      if (!Number.isFinite(rawAltitudeM)) {
        return Number.isFinite(fallbackAltitudeM) ? fallbackAltitudeM : referenceAltitudeM;
      }

      if (rawBaselineAltitudeM === null) {
        return rawAltitudeM;
      }

      return referenceAltitudeM + (rawAltitudeM - rawBaselineAltitudeM);
    },

    getRawBaselineAltitudeM() {
      return rawBaselineAltitudeM;
    }
  };
}

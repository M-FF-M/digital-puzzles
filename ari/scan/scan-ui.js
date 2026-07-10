import {
  computePositioningMetrics,
  createAltitudeCalibrator,
  normalizeDeg,
  normalizeSignedDeg
} from "./positioning.js";

/*
 * Edit the puzzle parameters here.
 */
const SCAN_CONFIG = {
  target: {
    latitude: 48.174407212691555,
    longitude: 11.553772632411054,
    altitudeM: 810
  },

  // Known ground-level altitude around the target building.
  // When scan data is first displayed, the raw browser altitude is used as a
  // baseline. Later altitude changes are applied relative to this reference.
  groundReferenceAltitudeM: 513,
  // encrypted actual target
  encryptedTarget: 'puzzlecrypt:eyJ2IjoxLCJhbGciOiJBRVMtR0NNIiwia2RmIjoiUEJLREYyLVNIQTI1NiIsIml0ZXJhdGlvbnMiOjIwMDAwMCwic2FsdCI6IkcxNGVaTGZ1Y2c1eW9MUXB0ZUtSMkE9PSIsIml2IjoidnNtZDI4SldiUFA4S3BqKyIsImNpcGhlcnRleHQiOiJxWm1qTlFLbk93Q3lZK2R4R29DZTVMVTBPVDQxa1MrUWpEaXJ4cVRObmVtKzBXNjBQRXQ1VUxFK01UQkRkWCtIdWNTelZuUG5sRUI3SjhhaFpveGxHekRXU2hhWnVhai9PdkF4cVY0dXZUR2kwYmx3elJqVUR5c2EifQ==',

  // The target is about 6 m from the outside walls; a little margin keeps the
  // page in the acquisition state until the player is probably outside.
  targetToOutsideWallDistanceM: 6,
  outsideMarginM: 15,

  minAcquisitionTimeMs: 20_000,
  fallbackAltitudeAccuracyM: 30,
  assumedOrientationErrorDeg: 15,

  // Point generation: 95% of points are placed in a 10 degree total band,
  // i.e. +/-5 degrees around the correct compass bearing.
  signalPoint95BandDeg: 10,

  // Weighted-distance signal-rate model.
  // <=5 m: 5 signals/s. At 100 m: 1 signal / 3 s. Floor: 1 signal / 10 s.
  fastSignalDistanceM: 5,
  farSignalDistanceM: 100,
  fastSignalRateHz: 5,
  farSignalRateHz: 1 / 3,
  minSignalRateHz: 1 / 10,

  debug: false
};

const elements = {
  startPanel: document.querySelector("#startPanel"),
  acquiringPanel: document.querySelector("#acquiringPanel"),
  scannerPanel: document.querySelector("#scannerPanel"),
  errorPanel: document.querySelector("#errorPanel"),
  startButton: document.querySelector("#startScanButton"),
  retryButton: document.querySelector("#retryButton"),
  acquiringMessage: document.querySelector("#acquiringMessage"),
  acquiringDetail: document.querySelector("#acquiringDetail"),
  errorMessage: document.querySelector("#errorMessage"),
  scannerDial: document.querySelector("#scannerDial"),
  rotatingLayer: document.querySelector("#rotatingLayer"),
  signalLayer: document.querySelector("#signalLayer"),
  distanceValue: document.querySelector("#distanceValue"),
  precisionValue: document.querySelector("#precisionValue"),
  rateValue: document.querySelector("#rateValue"),
  scanStatus: document.querySelector("#scanStatus")
};

async function applyEncryptedTargetFromUrl() {
  const encryptedTarget = SCAN_CONFIG.encryptedTarget;
  const key = new URLSearchParams(window.location.search).get("k");

  if (!key || !encryptedTarget) {
    return;
  }

  if (typeof PuzzleCrypto === "undefined" || !PuzzleCrypto.decryptString) {
    return;
  }

  try {
    const decrypted = await PuzzleCrypto.decryptString(key, encryptedTarget);

    if (decrypted === null) {
      return;
    }

    const actualTarget = JSON.parse(decrypted);

    const lat = Number(actualTarget.lat);
    const lon = Number(actualTarget.lon);
    const alt = Number(actualTarget.alt);
    const refAlt = Number(actualTarget.ref_alt);

    const valid =
      Number.isFinite(lat) && lat >= -90 && lat <= 90 &&
      Number.isFinite(lon) && lon >= -180 && lon <= 180 &&
      Number.isFinite(alt) &&
      Number.isFinite(refAlt);

    if (!valid) {
      return;
    }

    SCAN_CONFIG.target = {
      latitude: lat,
      longitude: lon,
      altitudeM: alt
    };

    SCAN_CONFIG.groundReferenceAltitudeM = refAlt;
  } catch (error) {
    if (SCAN_CONFIG.debug) {
      console.warn("Encrypted scan target could not be applied.", error);
    }
  }
}

await applyEncryptedTargetFromUrl();

const altitudeCalibrator = createAltitudeCalibrator(SCAN_CONFIG.groundReferenceAltitudeM);

const scanState = {
  startedAtMs: null,
  watchId: null,
  latestPosition: null,
  latestOrientation: null,
  latestMetrics: null,
  revealed: false,
  audioContext: null,
  lastSignalAtMs: 0,
  animationFrameId: null,
  lastNorthAngleScreenDeg: null,
  continuousNorthAngleDeg: 0
};

function showPanel(panelName) {
  for (const panel of [elements.startPanel, elements.acquiringPanel, elements.scannerPanel, elements.errorPanel]) {
    panel.classList.add("hidden");
  }

  elements[panelName].classList.remove("hidden");
}

function formatDistance(meters) {
  if (!Number.isFinite(meters)) return "-- m";
  if (meters < 10) return `${meters.toFixed(1)} m`;
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(2)} km`;
}

function formatRate(hz) {
  if (!Number.isFinite(hz) || hz <= 0) return "--";
  if (hz >= 1) return `${hz.toFixed(1)} / sec`;
  return `1 / ${Math.round(1 / hz)} sec`;
}

function precisionDisplay(metrics) {
  if (!metrics) return "--";

  const uncertainty = metrics.positionUncertainty95M;
  const label = metrics.precisionLabel;

  if (!Number.isFinite(uncertainty)) return label;
  return `${label} ±${Math.round(uncertainty)} m`;
}

function signalRateHz(weightedSignalDistanceM) {
  const cfg = SCAN_CONFIG;
  const d = Math.max(0, weightedSignalDistanceM);

  if (d <= cfg.fastSignalDistanceM) {
    return cfg.fastSignalRateHz;
  }

  const decay = Math.log(cfg.fastSignalRateHz / cfg.farSignalRateHz) /
    (cfg.farSignalDistanceM - cfg.fastSignalDistanceM);
  const rate = cfg.fastSignalRateHz * Math.exp(-decay * (d - cfg.fastSignalDistanceM));

  return Math.max(cfg.minSignalRateHz, rate);
}

function normalRandom() {
  // Box-Muller transform.
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function noisyBearingDeg(centerBearingDeg) {
  const halfBand = SCAN_CONFIG.signalPoint95BandDeg / 2;
  const sigma = halfBand / 1.96;
  return normalizeDeg(centerBearingDeg + normalRandom() * sigma);
}

function createSignalPoint(metrics) {
  if (!metrics) return;

  const dialRect = elements.scannerDial.getBoundingClientRect();
  const radiusPx = dialRect.width * (0.43 + Math.random() * 0.035);
  const angle = noisyBearingDeg(metrics.targetAngleCompassDeg);

  const point = document.createElement("span");
  point.className = "signal-point";
  point.style.setProperty("--signal-angle", `${angle}deg`);
  point.style.setProperty("--signal-radius", `${radiusPx}px`);
  point.setAttribute("aria-hidden", "true");

  elements.signalLayer.append(point);
  window.setTimeout(() => point.remove(), 10_100);
  playClick();
}

function ensureAudioContext() {
  if (!scanState.audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      scanState.audioContext = new AudioContextClass();
    }
  }

  if (scanState.audioContext?.state === "suspended") {
    scanState.audioContext.resume().catch(() => {});
  }
}

function playClick() {
  const ctx = scanState.audioContext;
  if (!ctx) return;

  const now = ctx.currentTime;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(2300 + Math.random() * 400, now);

  filter.type = "highpass";
  filter.frequency.setValueAtTime(1200, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.22, now + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(now);
  oscillator.stop(now + 0.022);
}

function getRawAltitude(position) {
  const altitude = position?.coords?.altitude;
  return Number.isFinite(altitude) ? altitude : null;
}

function correctedCurrentPosition(position) {
  const coords = position.coords;
  const rawAltitude = getRawAltitude(position);
  const altitudeM = altitudeCalibrator.getAltitude(rawAltitude, SCAN_CONFIG.groundReferenceAltitudeM);

  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
    altitudeM
  };
}

function computeLatestMetrics() {
  if (!scanState.latestPosition) return null;

  const coords = scanState.latestPosition.coords;

  return computePositioningMetrics({
    current: correctedCurrentPosition(scanState.latestPosition),
    target: SCAN_CONFIG.target,
    orientation: scanState.latestOrientation,
    horizontalAccuracyM: coords.accuracy,
    altitudeAccuracyM: coords.altitudeAccuracy,
    options: {
      fallbackAltitudeAccuracyM: SCAN_CONFIG.fallbackAltitudeAccuracyM,
      assumedOrientationErrorDeg: SCAN_CONFIG.assumedOrientationErrorDeg
    }
  });
}

function shouldReveal(metrics) {
  if (!metrics || !scanState.startedAtMs) return false;

  const elapsedMs = performance.now() - scanState.startedAtMs;
  const minimumDistanceM = SCAN_CONFIG.targetToOutsideWallDistanceM + SCAN_CONFIG.outsideMarginM;

  return elapsedMs >= SCAN_CONFIG.minAcquisitionTimeMs &&
    metrics.horizontalDistanceM >= minimumDistanceM;
}

function tryCalibrateAltitude() {
  if (altitudeCalibrator.isCalibrated()) return;

  const rawAltitude = getRawAltitude(scanState.latestPosition);
  if (!altitudeCalibrator.calibrate(rawAltitude)) {
    // If the browser gives no altitude, keep the scanner usable by falling back
    // to the reference altitude. The precision display will remain conservative.
    altitudeCalibrator.calibrate(SCAN_CONFIG.groundReferenceAltitudeM);
  }
}

function updateAcquiringDetail(metrics) {
  const elapsedMs = scanState.startedAtMs ? performance.now() - scanState.startedAtMs : 0;
  const secondsRemaining = Math.max(0, Math.ceil((SCAN_CONFIG.minAcquisitionTimeMs - elapsedMs) / 1000));

  if (!scanState.latestPosition) {
    elements.acquiringDetail.textContent = "initializing scan field...";
    return;
  }

  const outsideGateM = SCAN_CONFIG.targetToOutsideWallDistanceM + SCAN_CONFIG.outsideMarginM;

  if (secondsRemaining > 0) {
    elements.acquiringDetail.textContent = `stabilizing receiver... ${secondsRemaining}s`;
  } else if (metrics && metrics.horizontalDistanceM < outsideGateM) {
    elements.acquiringDetail.textContent = "signal is reflecting; move farther away from the structure";
  } else {
    elements.acquiringDetail.textContent = "locking scan field...";
  }
}

function continuousNorthAngle(rawAngleDeg) {
  if (!Number.isFinite(rawAngleDeg)) return null;

  if (scanState.lastNorthAngleScreenDeg === null) {
    scanState.lastNorthAngleScreenDeg = rawAngleDeg;
    scanState.continuousNorthAngleDeg = rawAngleDeg;
    return scanState.continuousNorthAngleDeg;
  }

  const delta = normalizeSignedDeg(rawAngleDeg - scanState.lastNorthAngleScreenDeg);
  scanState.continuousNorthAngleDeg += delta;
  scanState.lastNorthAngleScreenDeg = rawAngleDeg;

  return scanState.continuousNorthAngleDeg;
}

function renderMetrics(metrics) {
  if (!metrics) return;

  elements.distanceValue.textContent = formatDistance(metrics.distance3dM);
  elements.precisionValue.textContent = precisionDisplay(metrics);

  const rate = metrics.hasOrientation ? signalRateHz(metrics.weightedSignalDistanceM) : null;
  elements.rateValue.textContent = metrics.hasOrientation ? formatRate(rate) : "aligning";

  if (Number.isFinite(metrics.northAngleScreenDeg)) {
    const angle = continuousNorthAngle(metrics.northAngleScreenDeg);
    elements.rotatingLayer.style.setProperty("--north-angle", `${angle}deg`);
  }

  elements.scanStatus.textContent = metrics.hasOrientation
    ? `scan field ${metrics.precisionLabel}`
    : "calibrating directional field";

  if (SCAN_CONFIG.debug) {
    console.log(metrics);
  }
}

function updateScan() {
  const metrics = computeLatestMetrics();
  scanState.latestMetrics = metrics;

  if (!scanState.revealed) {
    updateAcquiringDetail(metrics);

    if (shouldReveal(metrics)) {
      tryCalibrateAltitude();
      scanState.revealed = true;
      showPanel("scannerPanel");
      renderMetrics(computeLatestMetrics());
      scanState.lastSignalAtMs = performance.now();
    }

    return;
  }

  renderMetrics(metrics);
}

function signalAnimationLoop(nowMs) {
  try {
    if (scanState.revealed && scanState.latestMetrics?.hasOrientation) {
      const rate = signalRateHz(scanState.latestMetrics.weightedSignalDistanceM);
      const intervalMs = 1000 / rate;

      if (nowMs - scanState.lastSignalAtMs >= intervalMs) {
        scanState.lastSignalAtMs = nowMs;
        createSignalPoint(scanState.latestMetrics);
      }
    }
  } catch (error) {
    console.error("Signal animation failed:", error);
  } finally {
    scanState.animationFrameId = window.requestAnimationFrame(signalAnimationLoop);
  }
}

function handlePosition(position) {
  scanState.latestPosition = position;
  updateScan();
}

function handlePositionError(error) {
  showError(`Signal acquisition failed: ${error.message}. You may want to try using a different device.`);
}

function handleOrientation(event) {
  if (!Number.isFinite(event.alpha) || !Number.isFinite(event.beta) || !Number.isFinite(event.gamma)) {
    return;
  }

  const absolute = event.absolute === true || event.type === "deviceorientationabsolute" ||
    Number.isFinite(event.webkitCompassHeading);

  // Prefer absolute readings if available, but do not freeze the scanner if a
  // browser only provides relative orientation.
  if (scanState.latestOrientation?.absolute && !absolute) return;

  scanState.latestOrientation = {
    type: event.type,
    absolute,
    alpha: event.alpha,
    beta: event.beta,
    gamma: event.gamma,
    webkitCompassHeading: event.webkitCompassHeading,
    webkitCompassAccuracy: event.webkitCompassAccuracy
  };

  updateScan();
}

async function requestOrientationAccess() {
  if (typeof DeviceOrientationEvent === "undefined") return;

  window.addEventListener("deviceorientationabsolute", handleOrientation, true);
  window.addEventListener("deviceorientation", handleOrientation, true);

  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    try {
      await DeviceOrientationEvent.requestPermission();
    } catch {
      // Continue with location-only behavior if the browser rejects motion access.
    }
  }
}

async function lockPortraitIfPossible() {
  try {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    }

    if (screen.orientation?.lock) {
      await screen.orientation.lock("portrait");
    }
  } catch (error) {
    // Unsupported or denied. The page still works; the browser controls rotation.
    console.warn("Could not lock screen orientation:", error);
  }
}

function requestPositionAccess() {
  if (!("geolocation" in navigator)) {
    showError("Signal receiver unavailable on this device.");
    return;
  }

  scanState.watchId = navigator.geolocation.watchPosition(
    handlePosition,
    handlePositionError,
    {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 20_000
    }
  );
}

async function startScan() {
  elements.startButton.disabled = true;
  altitudeCalibrator.reset();

  scanState.startedAtMs = performance.now();
  scanState.latestPosition = null;
  scanState.latestOrientation = null;
  scanState.latestMetrics = null;
  scanState.revealed = false;
  scanState.lastSignalAtMs = scanState.startedAtMs;
  scanState.lastNorthAngleScreenDeg = null;
  scanState.continuousNorthAngleDeg = 0;

  ensureAudioContext();
  showPanel("acquiringPanel");
  elements.acquiringMessage.textContent = "searching for signal, move outside and away from buildings or other objects";
  elements.acquiringDetail.textContent = "initializing scan field...";

  await lockPortraitIfPossible();
  await requestOrientationAccess();
  requestPositionAccess();

  if (!scanState.animationFrameId) {
    scanState.animationFrameId = window.requestAnimationFrame(signalAnimationLoop);
  }

  // Keep the acquisition countdown moving even if sensor updates are sparse.
  const acquisitionTicker = window.setInterval(() => {
    if (scanState.revealed || !scanState.startedAtMs) {
      window.clearInterval(acquisitionTicker);
      return;
    }
    updateScan();
  }, 250);
}

function showError(message) {
  elements.errorMessage.textContent = message;
  showPanel("errorPanel");
  elements.startButton.disabled = false;
}

function retry() {
  if (scanState.watchId !== null) {
    navigator.geolocation.clearWatch(scanState.watchId);
    scanState.watchId = null;
  }

  showPanel("startPanel");
  elements.startButton.disabled = false;
}

elements.startButton.addEventListener("click", startScan);
elements.retryButton.addEventListener("click", retry);

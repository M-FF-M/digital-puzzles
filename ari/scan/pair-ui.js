const PAIRING_CONFIG = {
  ciphertext: "puzzlecrypt:eyJ2IjoxLCJhbGciOiJBRVMtR0NNIiwia2RmIjoiUEJLREYyLVNIQTI1NiIsIml0ZXJhdGlvbnMiOjIwMDAwMCwic2FsdCI6IkFBV1FVNGNudi8zVzBKNmNlYzZaTUE9PSIsIml2IjoiK1dtdDRGZkdiekY0WlZsQSIsImNpcGhlcnRleHQiOiI1cVdjVWJxeENSMGtDZE1OaFpJOGh5YUZiMEhUS1FKUUlNanpscWVxdGtnPSJ9",
  fakeSearchMs: 8_000,
  scanPage: "index.html"
};

const elements = {
  panel: document.querySelector("#pairPanel"),
  icon: document.querySelector("#pairIcon"),
  iconSymbol: document.querySelector("#pairIconSymbol"),
  message: document.querySelector("#pairMessage"),
  form: document.querySelector("#pairForm"),
  input: document.querySelector("#pairingCode"),
  confirmButton: document.querySelector("#confirmButton"),
  retryButton: document.querySelector("#retryButton")
};

function setIcon(symbol, mode = "normal") {
  elements.iconSymbol.textContent = symbol;
  elements.icon.classList.toggle("warning", mode === "warning");
  elements.icon.classList.toggle("status-orb", mode === "busy");
  elements.icon.classList.toggle("scanner-mark", mode !== "busy");
}

function showEntryState() {
  setIcon("detector");
  elements.message.textContent = "Enter your Portable Threshold's pairing code to connect your device";
  elements.form.classList.remove("hidden");
  elements.retryButton.classList.add("hidden");
  elements.input.disabled = false;
  elements.confirmButton.disabled = false;
  elements.input.value = "";
  elements.input.focus();
}

function showSearchingState() {
  setIcon("detector", "busy");
  elements.message.textContent = "Please press the lightning bolt button on your Portable Threshold to connect. Searching for Portable Threshold...";
  elements.form.classList.add("hidden");
  elements.retryButton.classList.add("hidden");
}

function showFailureState() {
  setIcon("warning", "warning");
  elements.message.textContent = "Connection attempt failed. Make sure to enter the correct pairing code and to press the lightning bolt button within 5 seconds.";
  elements.form.classList.add("hidden");
  elements.retryButton.classList.remove("hidden");
}

function cleanPairingCode(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 6);
}

function delay(ms) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

async function decryptScanKey(pairingCode) {
  if (typeof PuzzleCrypto === "undefined" || !PuzzleCrypto.decryptString) {
    return null;
  }

  return PuzzleCrypto.decryptString(pairingCode, PAIRING_CONFIG.ciphertext);
}

async function startPairing(pairingCode) {
  showSearchingState();

  await delay(PAIRING_CONFIG.fakeSearchMs);

  const scanKey = await decryptScanKey(pairingCode);

  if (!scanKey) {
    showFailureState();
    return;
  }

  window.location.assign(`${PAIRING_CONFIG.scanPage}?k=${encodeURIComponent(scanKey)}`);
}

elements.input.addEventListener("input", () => {
  const cleaned = cleanPairingCode(elements.input.value);
  if (elements.input.value !== cleaned) {
    elements.input.value = cleaned;
  }
});

elements.form.addEventListener("submit", event => {
  event.preventDefault();

  const pairingCode = cleanPairingCode(elements.input.value);
  elements.input.value = pairingCode;

  elements.input.disabled = true;
  elements.confirmButton.disabled = true;

  startPairing(pairingCode).catch(() => {
    showFailureState();
  });
});

elements.retryButton.addEventListener("click", showEntryState);

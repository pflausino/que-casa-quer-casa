/* =====================================================================
   Lógica do formulário de confirmação de presença (RSVP)
   ===================================================================== */
(function () {
  "use strict";

  const form     = document.getElementById("rsvp-form");
  const statusEl = document.getElementById("rsvp-status");
  const submitBtn = document.getElementById("submit-btn");
  const countsBlock = document.getElementById("counts-block");
  const cfg = window.WEDDING_CONFIG || {};
  const SCRIPT_URL = (cfg.GOOGLE_SCRIPT_URL || "").trim();

  /* ---------- Steppers (+/-) ---------- */
  document.querySelectorAll("[data-stepper]").forEach(function (stepper) {
    const input = stepper.querySelector("input");
    const min = Number(input.min || 0);
    const max = Number(input.max || 99);
    const clamp = function (v) { return Math.max(min, Math.min(max, v || 0)); };

    stepper.querySelector("[data-dec]").addEventListener("click", function () {
      input.value = clamp(Number(input.value) - 1);
    });
    stepper.querySelector("[data-inc]").addEventListener("click", function () {
      input.value = clamp(Number(input.value) + 1);
    });
    input.addEventListener("change", function () {
      input.value = clamp(Number(input.value));
    });
  });

  /* ---------- Desabilita contadores se "não vou" ---------- */
  form.querySelectorAll('input[name="attending"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
      const notGoing = form.querySelector('input[name="attending"]:checked')?.value === "nao";
      countsBlock.setAttribute("data-disabled", notGoing ? "true" : "false");
      if (notGoing) {
        document.getElementById("adults").value = 0;
        document.getElementById("children").value = 0;
      }
    });
  });

  /* ---------- Helpers de validação ---------- */
  function setError(name, msg) {
    const el = form.querySelector('.field__error[data-for="' + name + '"]');
    if (el) el.textContent = msg || "";
  }
  function clearErrors() {
    form.querySelectorAll(".field__error").forEach(function (e) { e.textContent = ""; });
  }

  function validate(data) {
    let ok = true;
    if (!data.fullname || data.fullname.length < 3) {
      setError("fullname", "Por favor, informe seu nome completo.");
      ok = false;
    }
    if (!data.attending) {
      setError("attending", "Diga se você poderá comparecer.");
      ok = false;
    }
    return ok;
  }

  function setStatus(msg, kind) {
    statusEl.textContent = msg;
    statusEl.className = "rsvp__status" + (kind ? " " + kind : "");
  }

  /* ---------- Envio ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    const data = {
      fullname: document.getElementById("fullname").value.trim(),
      attending: (form.querySelector('input[name="attending"]:checked') || {}).value || "",
      adults: Number(document.getElementById("adults").value) || 0,
      children: Number(document.getElementById("children").value) || 0,
      message: document.getElementById("message").value.trim(),
      timestamp: new Date().toISOString(),
    };

    if (!validate(data)) {
      setStatus("Confira os campos destacados acima.", "err");
      return;
    }

    // Modo demonstração: sem URL configurada.
    if (!SCRIPT_URL) {
      console.log("[MODO DEMONSTRAÇÃO] RSVP capturado:", data);
      setStatus("Modo demonstração: configure a URL do Google em config.js para salvar de verdade. Os dados foram exibidos no console.", "ok");
      form.reset();
      return;
    }

    submitBtn.disabled = true;
    setStatus("Enviando sua confirmação…", "loading");

    // Apps Script aceita melhor com text/plain para evitar preflight CORS.
    fetch(SCRIPT_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data),
    })
      .then(function (res) { return res.json().catch(function () { return { result: "ok" }; }); })
      .then(function (res) {
        if (res && res.result === "error") throw new Error(res.message || "erro");
        const nome = data.attending === "sim" ? "Nos vemos lá! 🎉" : "Sentiremos sua falta 💛";
        setStatus("Confirmação registrada com sucesso. " + nome, "ok");
        form.reset();
        countsBlock.setAttribute("data-disabled", "false");
      })
      .catch(function (err) {
        console.error(err);
        setStatus("Ops! Não conseguimos registrar agora. Tente novamente em instantes ou avise os noivos.", "err");
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });
})();

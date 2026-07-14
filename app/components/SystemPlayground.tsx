"use client";

import {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type PlaygroundProps = {
  onUseScenario: (summary: string) => void;
};

type Preset = {
  name: string;
  runs: number;
  minutes: number;
  assistance: number;
  review: number;
};

const presets: Preset[] = [
  {
    name: "Client enquiries",
    runs: 45,
    minutes: 14,
    assistance: 50,
    review: 25,
  },
  {
    name: "Weekly reporting",
    runs: 5,
    minutes: 120,
    assistance: 45,
    review: 30,
  },
  {
    name: "Client onboarding",
    runs: 8,
    minutes: 75,
    assistance: 40,
    review: 35,
  },
  {
    name: "Internal requests",
    runs: 50,
    minutes: 10,
    assistance: 55,
    review: 20,
  },
];

const frictionOptions = [
  {
    label: "Re-entering information",
    module: "capture information once",
  },
  {
    label: "Data in too many places",
    module: "unify its context",
  },
  {
    label: "Waiting on handoffs",
    module: "route the next move",
  },
  {
    label: "Decisions without a clear view",
    module: "measure the flow",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

function formatHours(value: number) {
  return value.toFixed(1).replace(/\.0$/, "");
}

type DualControlProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix: string;
  helper?: string;
  onChange: (value: number) => void;
};

function DualControl({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  helper,
  onChange,
}: DualControlProps) {
  const update = (next: number) => onChange(clamp(next, min, max));

  return (
    <div className="dual-control">
      <div className="control-heading">
        <label htmlFor={id}>{label}</label>
        <span>{suffix}</span>
      </div>
      <div className="control-pair">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => update(Number(event.target.value))}
        />
        <input
          aria-label={label + " as a number"}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => update(Number(event.target.value))}
        />
      </div>
      {helper ? <p className="control-helper">{helper}</p> : null}
    </div>
  );
}

export function SystemPlayground({ onUseScenario }: PlaygroundProps) {
  const initial = presets[0];
  const [workflow, setWorkflow] = useState(initial.name);
  const [runs, setRuns] = useState(initial.runs);
  const [minutes, setMinutes] = useState(initial.minutes);
  const [assistance, setAssistance] = useState(initial.assistance);
  const [review, setReview] = useState(initial.review);
  const [frictions, setFrictions] = useState<string[]>([
    frictionOptions[0].label,
    frictionOptions[2].label,
  ]);
  const [announcement, setAnnouncement] = useState("");

  const model = useMemo(() => {
    const manualHours = (runs * minutes) / 60;
    const assistedCandidate = manualHours * (assistance / 100);
    const humanReviewHours = assistedCandidate * (review / 100);
    const planningCapacity = Math.max(
      0,
      assistedCandidate - humanReviewHours,
    );
    const remainingWorkflowLoad = Math.max(0, manualHours - planningCapacity);
    const capacityRatio =
      manualHours > 0 ? planningCapacity / manualHours : 0;
    return {
      manualHours,
      assistedCandidate,
      humanReviewHours,
      planningCapacity,
      remainingWorkflowLoad,
      capacityRatio,
    };
  }, [assistance, minutes, review, runs]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAnnouncement(
        "Model updated. Planning capacity is approximately " +
          formatHours(model.planningCapacity) +
          " hours per week.",
      );
    }, 400);
    return () => window.clearTimeout(timer);
  }, [model.planningCapacity]);

  const applyPreset = (preset: Preset) => {
    setWorkflow(preset.name);
    setRuns(preset.runs);
    setMinutes(preset.minutes);
    setAssistance(preset.assistance);
    setReview(preset.review);
  };

  const toggleFriction = (label: string) => {
    setFrictions((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  };

  const resetModel = () => {
    applyPreset(initial);
    setFrictions([frictionOptions[0].label, frictionOptions[2].label]);
  };

  const activeModules = frictionOptions
    .filter((option) => frictions.includes(option.label))
    .map((option) => option.module);
  const judgementModule =
    review > 0 ? "keep a human at the judgement point" : "apply guardrails";
  const narrativeModules = [...activeModules, judgementModule];
  const narrative =
    "A JDE system for " +
    (workflow || "this workflow").toLowerCase() +
    " could " +
    narrativeModules.join(", ").replace(/, ([^,]*)$/, ", and $1") +
    ".";

  const buildSummary = () =>
    [
      "Playground model: " + (workflow || "Untitled workflow"),
      "Current pattern: " + runs + " runs/week × " + minutes + " minutes",
      "Manual load mapped: approximately " +
        formatHours(model.manualHours) +
        " hours/week",
      "Assistance assumption: " + assistance + "%",
      "Human review retained: " + review + "%",
      "Planning capacity: approximately " +
        formatHours(model.planningCapacity) +
        " hours/week",
      "Main friction: " +
        (frictions.length
          ? frictions.join(", ").toLowerCase()
          : "not selected yet"),
    ].join("\n");

  const moveScene = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
    event.currentTarget.style.setProperty("--lab-tilt-y", x.toFixed(2) + "deg");
    event.currentTarget.style.setProperty("--lab-tilt-x", y.toFixed(2) + "deg");
  };

  const resetScene = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--lab-tilt-y", "0deg");
    event.currentTarget.style.setProperty("--lab-tilt-x", "0deg");
  };

  const particleCount = clamp(Math.round(runs / 5), 3, 14);
  const visualStyle = {
    "--assist-level": String(assistance / 100),
    "--review-level": String(Math.max(0.12, review / 100)),
    "--capacity-level": String(model.capacityRatio),
  } as CSSProperties;

  return (
    <section
      className="playground section-shell"
      id="playground"
      aria-labelledby="playground-title"
    >
      <div className="section-index reveal">
        <span>03</span>
        <span>System playground / live model</span>
      </div>
      <div className="playground-heading">
        <div>
          <p className="eyebrow reveal">Bottleneck lab</p>
          <h2 id="playground-title" className="reveal">
            Put the bottleneck
            <br />
            <em>on the table.</em>
          </h2>
        </div>
        <div className="playground-intro reveal">
          <p>
            Use your own numbers. We’ll turn them into a system sketch—not a
            sales promise.
          </p>
          <span>Planning model / not a forecast</span>
        </div>
      </div>

      <div className="lab-grid">
        <div className="lab-controls">
          <div className="preset-block">
            <p>Starting examples—not industry benchmarks</p>
            <div className="preset-list" aria-label="Workflow examples">
              {presets.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  className={workflow === preset.name ? "is-active" : ""}
                  onClick={() => applyPreset(preset)}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <label className="workflow-field" htmlFor="workflow-name">
            <span>Workflow name</span>
            <input
              id="workflow-name"
              type="text"
              value={workflow}
              onChange={(event) => setWorkflow(event.target.value)}
            />
          </label>

          <DualControl
            id="workflow-runs"
            label="Times this happens each week"
            value={runs}
            min={0}
            max={1000}
            suffix="runs"
            onChange={setRuns}
          />
          <DualControl
            id="workflow-minutes"
            label="Minutes each time"
            value={minutes}
            min={1}
            max={1440}
            suffix="min"
            onChange={setMinutes}
          />
          <DualControl
            id="workflow-assistance"
            label="Share suited to AI or automation"
            value={assistance}
            min={0}
            max={100}
            suffix="%"
            helper="Choose what appears repeatable and rules-based. Discovery still validates exceptions, quality, and risk."
            onChange={setAssistance}
          />
          {assistance > 80 ? (
            <p className="model-warning">
              This is an aggressive assumption. Exceptions and adoption usually
              reduce the usable share.
            </p>
          ) : null}
          <DualControl
            id="workflow-review"
            label="Assisted work kept for human review"
            value={review}
            min={0}
            max={100}
            suffix="%"
            onChange={setReview}
          />
          {review === 0 ? (
            <p className="model-warning">
              Zero human review is best reserved for low-risk, deterministic
              steps.
            </p>
          ) : null}

          <fieldset className="friction-fieldset">
            <legend>Where does the friction live?</legend>
            {frictionOptions.map((option) => (
              <label key={option.label}>
                <input
                  type="checkbox"
                  checked={frictions.includes(option.label)}
                  onChange={() => toggleFriction(option.label)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
        </div>

        <div className="lab-output">
          <figure
            className="lab-figure"
            style={visualStyle}
            onPointerMove={moveScene}
            onPointerLeave={resetScene}
          >
            <div className="lab-scene" aria-hidden="true">
              <div className="flow-input">
                {Array.from({ length: 14 }, (_, index) => (
                  <span
                    key={index}
                    className={index < particleCount ? "is-visible" : ""}
                    style={{
                      animationDelay: String(index * -0.24) + "s",
                    }}
                  />
                ))}
              </div>
              {[
                "Capture",
                "Structure",
                review > 0 ? "Human check" : "Guardrails",
                "Act",
                "Measure",
              ].map((label, index) => (
                <div
                  className="lab-plane"
                  key={label}
                  style={{ "--plane-index": index } as CSSProperties}
                >
                  <span>{label}</span>
                  <i />
                  <i />
                  <i />
                </div>
              ))}
              <div className="flow-output">
                <span />
                <span />
                <span />
              </div>
            </div>
            <figcaption>{narrative}</figcaption>
          </figure>

          <div className="result-ledger" aria-label="Planning model results">
            <div>
              <span>Manual load</span>
              <strong>{formatHours(model.manualHours)} h</strong>
              <small>each week</small>
            </div>
            <div>
              <span>Assistance candidate</span>
              <strong>{formatHours(model.assistedCandidate)} h</strong>
              <small>based on your inputs</small>
            </div>
            <div>
              <span>Human review protected</span>
              <strong>{formatHours(model.humanReviewHours)} h</strong>
              <small>kept in the loop</small>
            </div>
            <div className="result-primary">
              <span>Planning capacity opened</span>
              <strong>≈ {formatHours(model.planningCapacity)} h</strong>
              <small>illustrative weekly capacity</small>
            </div>
            <div>
              <span>Remaining workflow load</span>
              <strong>{formatHours(model.remainingWorkflowLoad)} h</strong>
              <small>after the modelled change</small>
            </div>
          </div>

          <p className="model-caveat">
            This model reflects only the assumptions above. It excludes
            exceptions, integration effort, quality thresholds, and adoption.
            JDE discovery turns assumptions into evidence.
          </p>

          <div className="lab-actions">
            <button
              type="button"
              className="lab-primary-action"
              onClick={() => onUseScenario(buildSummary())}
            >
              Turn this sketch into a build <span aria-hidden="true">↗</span>
            </button>
            <button type="button" className="lab-reset" onClick={resetModel}>
              Reset model
            </button>
          </div>
          <p className="lab-action-note">
            Nothing is submitted yet. Your assumptions are simply carried into
            the message below.
          </p>
          <p className="sr-only" aria-live="polite">
            {announcement}
          </p>
        </div>
      </div>
    </section>
  );
}

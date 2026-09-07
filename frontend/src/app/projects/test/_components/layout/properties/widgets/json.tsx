import { useEffect, useState } from "react";

import { Check, Copy } from "lucide-react";

import { ConfigWidget } from "@/app/projects/test/_components/layout/properties/inputs/config";
import { OutputWidget } from "@/app/projects/test/_components/layout/properties/outputs/config";
import { WidgetError, WidgetType } from "@/app/projects/test/_components/layout/properties/misc";

import { Button } from "@/components/ui/primitives/button";

export function JsonInput({ value, error, onChange }: ConfigWidget["JSON"]) {
  const [text, setText] = useState(value);
  const [copied, setCopied] = useState(false);

  const onFormat = (raw: string) => {
    try {
      const parsed = JSON.parse(raw);

      setText(JSON.stringify(parsed, null, 2));
      onChange(parsed);
    } catch {
      error = "Invalid JSON format - Cannot prettify";
    }
  };

  const onCopy = () => {
    navigator.clipboard.writeText(text);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => setText(value), [value]);

  return (
    <div className="group bg-ink/4 relative focus-within:outline hover:outline">
      <Button
        size="icon"
        aria-label="Copy"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onCopy}
        className="hover:text-accent-ink absolute top-1 right-1 p-1"
        title="Copy"
      >
        {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
      </Button>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={(e) => onFormat(e.target.value)}
        placeholder="Value"
        spellCheck={false}
        className="custom-scroll text-ink field-sizing-content size-full max-h-80 min-h-20 resize-none overflow-x-hidden overflow-y-auto p-2 pr-8 outline-none"
      />

      <WidgetError error={error} />

      <WidgetType type="JSON" />
    </div>
  );
}

export function JsonOutput({ value }: OutputWidget["JSON"]) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(value);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-ink/4 relative focus-within:outline">
      <Button
        size="icon"
        aria-label="Copy"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onCopy}
        className="hover:text-accent-ink absolute top-1 right-1 p-1"
        title="Copy"
      >
        {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
      </Button>

      <pre
        spellCheck={false}
        className="custom-scroll text-ink field-sizing-content size-full max-h-80 min-h-20 resize-none overflow-y-auto p-2 pr-8 text-wrap outline-none"
      >
        {value}
      </pre>

      <WidgetType type="JSON" />
    </div>
  );
}

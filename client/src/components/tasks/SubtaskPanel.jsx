import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { generateSubtasks } from "../../utils/subtaskEngine";

const SubtaskPanel = ({ title, subtasks, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const canGenerate = useMemo(() => title.trim().split(/\s+/).filter(Boolean).length >= 3, [title]);

  useEffect(() => {
    setSuggestions([]);
  }, [title]);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      const items = generateSubtasks(title).map((text) => ({ text, completed: false }));
      setSuggestions(items);
      const merged = [...subtasks];
      items.forEach((item) => {
        if (!merged.find((s) => s.text === item.text)) merged.push(item);
      });
      onChange(merged);
      setLoading(false);
    }, 500);
  };

  const toggleSuggestion = (index) => {
    setSuggestions((prev) => {
      const next = prev.map((item, idx) => (idx === index ? { ...item, completed: !item.completed } : item));
      const suggestionTexts = new Set(next.map((item) => item.text));
      const preserved = subtasks.filter((item) => !suggestionTexts.has(item.text));
      onChange([...preserved, ...next]);
      return next;
    });
  };

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-alt p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-brand-700">
          <Sparkles className="h-4 w-4" /> Subtasks
        </p>
        {canGenerate && (
          <button
            type="button"
            onClick={handleGenerate}
            className="text-xs font-medium text-brand-600 hover:text-brand-700"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate suggestions"}
          </button>
        )}
      </div>
      {loading && <div className="mb-3 h-2 w-full animate-pulse rounded-lg bg-gray-200" />}
      <div className="space-y-2">
        {suggestions.map((item, idx) => (
          <label key={item.text} className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleSuggestion(idx)}
              className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
            />
            {item.text}
          </label>
        ))}
        {!suggestions.length && !loading && (
          <p className="text-xs text-gray-400">Generate ideas tailored to your task title.</p>
        )}
      </div>
    </div>
  );
};

export default SubtaskPanel;

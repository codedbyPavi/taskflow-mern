import Button from "../ui/Button";
import Modal from "../ui/Modal";

const BlockTaskModal = ({ open, task, reason, onReasonChange, onConfirm, onClose, loading }) => (
  <Modal
    open={open && !!task}
    title="Block task"
    subtitle={task?.title}
    onClose={onClose}
    footer={
      <div className="flex justify-end gap-3 rounded-b-3xl border-t border-surface-subtle bg-surface-alt px-8 py-5">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant="danger" onClick={onConfirm} disabled={loading || !reason.trim()}>
          {loading ? "Blocking..." : "Block task"}
        </Button>
      </div>
    }
  >
    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold uppercase tracking-[0.07em] text-gray-400">Reason</label>
      <textarea
        rows={4}
        value={reason}
        onChange={(e) => onReasonChange(e.target.value)}
        placeholder="What's blocking progress?"
        className="w-full resize-none rounded-[10px] border border-surface-border bg-surface-alt px-4 py-3 text-[14px] text-gray-700 placeholder-gray-400 transition-all duration-200 hover:border-gray-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white"
      />
    </div>
  </Modal>
);

export default BlockTaskModal;

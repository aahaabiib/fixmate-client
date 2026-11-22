// Ek jaygay shob status-er rong. Badge ar chart dutoi eta use kore.
export const STATUS_META = {
  // booking
  requested: {
    label: "Requested",
    color: "#3b82f6",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  },
  accepted: {
    label: "Accepted",
    color: "#6366f1",
    badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  },
  "in-progress": {
    label: "In Progress",
    color: "#f59e0b",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  },
  completed: {
    label: "Completed",
    color: "#22c55e",
    badge: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  },
  rejected: {
    label: "Rejected",
    color: "#ef4444",
    badge: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  },
  cancelled: {
    label: "Cancelled",
    color: "#9ca3af",
    badge: "bg-gray-200 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300",
  },
  // service approval
  pending: {
    label: "Pending",
    color: "#f59e0b",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  },
  approved: {
    label: "Approved",
    color: "#22c55e",
    badge: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  },
  // payment
  paid: {
    label: "Paid",
    color: "#22c55e",
    badge: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  },
  unpaid: {
    label: "Unpaid",
    color: "#9ca3af",
    badge: "bg-gray-200 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300",
  },
};

export const BOOKING_STATUSES = [
  "requested",
  "accepted",
  "in-progress",
  "completed",
  "rejected",
  "cancelled",
];

export const ACTIVE_STATUSES = ["requested", "accepted", "in-progress"];
/** Starter task created on registration — excluded from metrics. */
export const ONBOARDING_TASK_TITLE = "Welcome to your board";

export const isOnboardingTask = (task) =>
  Boolean(task?.isOnboarding) || task?.title === ONBOARDING_TASK_TITLE;

export const filterRealTasks = (tasks = []) => tasks.filter((task) => !isOnboardingTask(task));

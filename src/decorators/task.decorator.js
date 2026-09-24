export function decorateTask(task, tags = []) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    category: task.categoryId
      ? { id: task.categoryId, name: task.categoryName }
      : null,
    tags: tags.map((tag) => ({ id: tag.id, name: tag.name })),
    createdAt: task.createdAt,
  };
}
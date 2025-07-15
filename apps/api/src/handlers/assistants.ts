import { createAssistant, deleteAssistant, getAssistantById, getAssistantsByProjectId, updateAssistant } from '@ai-assistant/db'

export const AssistantsHandler = {
  create: createAssistant,
  update: updateAssistant,
  remove: deleteAssistant,
  findOne: getAssistantById,
  findByProject: getAssistantsByProjectId
}

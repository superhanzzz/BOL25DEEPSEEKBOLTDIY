const Joi = require('joi');

const entrySchema = Joi.object({
  user_id: Joi.number().required(),
  entry_type: Joi.string().valid(
    'goal', 'task', 'event', 'project', 'focus', 'routine', 'schedule'
  ).required(),
  title: Joi.string().max(255).required(),
  description: Joi.string().allow(''),
  status: Joi.string().valid(
    'active', 'completed', 'pending'
  ),
  metadata: Joi.object().required()
});

const relationSchema = Joi.object({
  parent_id: Joi.number().required(),
  child_id: Joi.number().required(),
  relation_type: Joi.string().valid(
    'supports', 'belongs_to', 'related_to'
  ).required()
});

const participantSchema = Joi.object({
  entry_id: Joi.number().required(),
  participant_id: Joi.number().required(),
  role: Joi.string().max(50).required()
});

function validateEntry(data) {
  return entrySchema.validate(data);
}

function validateRelation(data) {
  return relationSchema.validate(data);
}

function validateParticipant(data) {
  return participantSchema.validate(data);
}

module.exports = {
  validateEntry,
  validateRelation,
  validateParticipant
};

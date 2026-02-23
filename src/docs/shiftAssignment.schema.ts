import { ShiftAssignmentType } from "@service/enums/shiftAssignmentType";

const tags = ['ShiftAssignment'];

export const createShiftAssignmentSchema = {
    description: 'Create a new shift assignment record',
    tags,
    params: {
        type: 'object',
        required: ['shiftTemplateId'],
        properties: {
            shiftTemplateId: { type: 'string' },
        },
    },
    body: {
        type: 'object',
        required: ['date', 'assignmentType'],
        properties: {
            user
            date: { type: 'string', format: 'date-time' },
            assignmentType: { type: 'string', enum: Object.values(ShiftAssignmentType) },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                shiftAssignmentId: { type: 'string' },
                shiftTemplateId:  { type: 'string' },
                userId: { type: 'string' },
                date: { type: 'string', format: 'date-time' },
                assignmentType: { type: 'string', enum: Object.values(ShiftAssignmentType) },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
    },
};

export const updateShiftAssignmentSchema = {
    description: 'Upadte shift assignment record',
    tags,
    params: {
        type: 'object',
        required: ['shiftAssignmentId'],
        properties: {
            shiftAssignmentId: { type: 'string' },
        },
    },
    body: {
        type: 'object',
        properties: {
            shiftTemplateId:  { type: 'string' },
            assignmentType: { type: 'string', enum: Object.values(ShiftAssignmentType) },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                shiftAssignmentId: { type: 'string' },
                shiftTemplateId:  { type: 'string' },
                userId: { type: 'string' },
                date: { type: 'string', format: 'date-time' },
                assignmentType: { type: 'string', enum: Object.values(ShiftAssignmentType) },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
    },
};

export const summaryMonthShiftAssignmentSchema = {
  description: 'Get shift assignments summary by month',
  tags,
  body: {
    type: 'object',
    required: ['month', 'year'],
    properties: {
        month: { type: 'number' },
        year: { type: 'number' },
    },
  },
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          userName: { type: 'string' },
          assignments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                shiftTemplateType: { type: 'string' }, 
                date: { type: 'string', format: 'date' },
                assignmentType: {
                  type: 'string',
                  enum: Object.values(ShiftAssignmentType),
                },
              },
            },
          },
        },
      },
    },
  },
};
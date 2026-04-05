import { ShiftSwapRequestStatus } from '@service/generated/prisma/enums';
import { ShiftAssignmentType } from '@service/enums/shiftAssignmentType';
import { ShiftTemplateType } from '@service/enums/shiftTemplateType';

const tags = ['ShiftSwapRequest'];

export const createShiftSwapRequestSchema = {
    description: 'Create a new shift swap request record',
    tags,
    body: {
        type: 'object',
        required: ['requester_user_id', 'approver_user_id', 'requester_assignment_id', 'approver_assignment_id'],
        properties: {
            approver_user_id: { type: 'string' },
            requester_assignment_id: { type: 'string' },
            approver_assignment_id: { type: 'string' },
            note: { type: ['string', 'null'], nullable: true }
        },
    },
    response: {
        200: {
            shift_swap_request_id: { type: 'string' },
            requester_user_id: { type: 'string' },
            approver_user_id: { type: 'string' },
            requester_assignment_id: { type: 'string' },
            approver_assignment_id: { type: 'string' },
            status: { type: 'string', enum: Object.values(ShiftSwapRequestStatus) },
            note: { type: ['string', 'null'], nullable: true },
            requested_at: { type: 'string', format: 'date-time' },
            responded_at : { type: 'string', format: 'date-time' },
        },
    },
};

export const updateShiftSwapRequestSchema = {
    description: 'Create a new shift swap request record',
    tags,
    params: {
        type: 'object',
        required: ['shiftSwapRequestId'],
        properties: {
            shiftSwapRequestId: { type: 'string' },
        },
    },
    querystring: {
        type: 'object',
        required: ['status'],
        properties: {
            status: { type: 'string', enum: Object.values(ShiftSwapRequestStatus) },
            note: { type: 'string' },
        },
        additionalProperties: false,
    },
    response: {
        200: {
            shift_swap_request_id: { type: 'string' },
            requester_user_id: { type: 'string' },
            approver_user_id: { type: 'string' },
            requester_assignment_id: { type: 'string' },
            approver_assignment_id: { type: 'string' },
            status: { type: 'string', enum: Object.values(ShiftSwapRequestStatus) },
            note: { type: ['string', 'null'], nullable: true },
            requested_at: { type: 'string', format: 'date-time' },
            responded_at : { type: 'string', format: 'date-time' },
        },
    },
};

export const getAllShiftSwapRequestForSchema = {
    description: 'Get all shift swap request record in ward',
    tags,
    params: {
        type: 'object',
        required: ['wardId'],
        properties: {
            wardId: { type: 'string' },
        },
    },
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    requesterName: { type: 'string' },
                    approverName: { type: 'string' },
                    requesterAssignmentDate: { type: 'string', format: 'date-time' },
                    approverAssignmentDate: { type: 'string', format: 'date-time' },
                    requesterAssignmentType: { type: 'string', enum: Object.values(ShiftAssignmentType) },
                    approverAssignmentType: { type: 'string', enum: Object.values(ShiftAssignmentType) },
                    requesterTemplateType: { type: 'string', enum: Object.values(ShiftTemplateType) },
                    approverTemplateType: { type: 'string', enum: Object.values(ShiftTemplateType) },
                    status: { type: 'string', enum: Object.values(ShiftSwapRequestStatus) },
                },
            },
        },
    },
};

export const getRequestedShiftSwapsSchema = {
    description: 'Get user shift swap request record',
    tags,
    params: {
        type: 'object',
        required: ['wardId'],
        properties: {
            wardId: { type: 'string' },
        },
    },
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    shiftSwapRequestId: { type: 'string' },
                    requesterName: { type: 'string' },
                    requesterAssignmentDate: { type: 'string', format: 'date-time' },
                    requesterAssignmentType: { type: 'string', enum: Object.values(ShiftAssignmentType) },
                    requesterTemplateType: { type: ['string', 'null'], enum: Object.values(ShiftTemplateType) },
                    approverName: { type: 'string' },
                    approverAssignmentDate: { type: 'string', format: 'date-time' },
                    approverAssignmentType: { type: 'string', enum: Object.values(ShiftAssignmentType) },
                    approverTemplateType: { type: ['string', 'null'], enum: Object.values(ShiftTemplateType) },
                    status: { type: 'string', enum: Object.values(ShiftSwapRequestStatus) },
                    note: { type: ['string', 'null'], nullable: true },
                },
            },
        },
    },
};

export const getReceivedShiftSwapsSchema = {
    description: 'Get user shift swap received record',
    tags,
    params: {
        type: 'object',
        required: ['wardId'],
        properties: {
            wardId: { type: 'string' },
        },
    },
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    shiftSwapRequestId: { type: 'string' },
                    requesterName: { type: 'string' },
                    requesterAssignmentDate: { type: 'string', format: 'date-time' },
                    requesterAssignmentType: { type: 'string', enum: Object.values(ShiftAssignmentType) },
                    requesterTemplateType: { type: ['string', 'null'], enum: Object.values(ShiftTemplateType) },
                    approverName: { type: 'string' },
                    approverAssignmentDate: { type: 'string', format: 'date-time' },
                    approverAssignmentType: { type: 'string', enum: Object.values(ShiftAssignmentType) },
                    approverTemplateType: { type: ['string', 'null'], enum: Object.values(ShiftTemplateType) },
                    status: { type: 'string', enum: Object.values(ShiftSwapRequestStatus) },
                    note: { type: ['string', 'null'], nullable: true },
                },
            },
        },
    },
};
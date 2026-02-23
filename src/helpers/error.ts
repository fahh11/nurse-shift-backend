export const ErrorDescription = {
    // Auth Errors
    INVALID_GOOGLE_TOKEN: {
        code: 'INVALID_GOOGLE_TOKEN',
        message: 'The provided Google token is invalid.',
    },
    
    // User Errors
    USER_ALREADY_EXISTS: {
        code: 'USER_ALREADY_EXISTS',
        message: 'A user with this personal email already exists.',
    },
    PROFILE_NOT_COMPLETED: {
        code: 'PROFILE_NOT_COMPLETED',
        message: 'User profile is not completed.',
    },
    PROFILE_INFORMATION_INCOMPLETE: {
        code: 'PROFILE_INFORMATION_INCOMPLETE',
        message: 'User profile information is incomplete.',
    },

    // Ward Errors
    WARD_ACCESS_DENIED: {
        code: 'WARD_ACCESS_DENIED',
        message: 'You do not have permission to access this ward',
    },

    // Ward Member Errors
    USER_NOT_IN_WARD_HOSPITAL: {
        code: 'USER_NOT_IN_WARD_HOSPITAL',
        message: 'User does not belong to the hospital of this ward',
    },
    INVALID_JOIN_CODE: {
        code: 'INVALID_JOIN_CODE',
        message: 'Invalid ward join code'
    },
    WARD_MEMBER_ALREADY_EXISTS: {
        code: 'WARD_MEMBER_ALREADY_EXISTS',
        message: 'Ward member already exists'
    },

    // Shift Template Erros
    SHIFT_TEMPLATE_TYPE_DUPLICATE: {
        code: 'SHIFT_TEMPLATE_TYPE_DUPLICATE',
        message: 'Shift template type already exists in this ward',
    },
    SHIFT_TEMPLATE_LIMIT_EXCEEDED: {
        code: 'SHIFT_TEMPLATE_LIMIT_EXCEEDED',
        message: 'Shift template limit exceeded in this ward',
    },
    SHIFT_TEMPLATE_TIME_OVERLAP:{
        code: 'SHIFT_TEMPLATE_TIME_OVERLAP',
        message: 'Shift template time overlaps with existing shift',
    },

    // Not Found Errors
    HOSPITAL_NOT_FOUND: {
        code: 'HOSPITAL_NOT_FOUND',
        message: 'Hospital not found.',
    },
    USER_NOT_FOUND: {
        code: 'USER_NOT_FOUND',
        message: 'User not found.',
    },
    WARD_NOT_FOUND: {
        code: 'WARD_NOT_FOUND',
        message: 'Ward not found.',
    },
    SHIFT_TEMPLATE_NOT_FOUND: {
        code: 'SHIFT_TEMPLATE_NOT_FOUND',
        message: 'Shift template not found.',
    },

    // Server Errors
    INTERNAL_SERVER_ERROR: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error'
    },

    // Schema Validation Errors
    INVALID_INPUT: {
        code: 'INVALID_INPUT',
        message: 'The input data is invalid.',
    },
  
} as const

export type ErrorCode = keyof typeof ErrorDescription
export type ErrorDetail = (typeof ErrorDescription)[ErrorCode]

export class CustomError extends Error {
  statusCode: number
  errors?: ErrorDetail[]

  constructor(message: string, statusCode: number, errors?: ErrorDetail[]) {
    super(message)
    this.name = 'CustomError'
    this.statusCode = statusCode
    this.errors = errors
  }
}

export const throwCustomError = (description: ErrorDetail, statusCode: number): never => {
  throw new CustomError(description.message, statusCode, [description])
}

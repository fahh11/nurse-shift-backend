import { FastifyRequest } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'

export const validateSchemaError = async (request: FastifyRequest): Promise<void> => {
  if (request.validationError) {
    throwCustomError(ErrorDescription.INVALID_INPUT, StatusCode.UNPROCESSABLE_CONTENT_422)
  }
}
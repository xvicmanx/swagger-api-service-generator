import request from '../__core__/request';
import { notEmptyProps, throwIfAnyMissing } from '../__core__/helpers';
import endpoints from './endpoints';
import RequestHeaders from '../__shared__/headers';

${entityTypesText}

${methodsText}

export default {
    ${methodsNamesText}
};
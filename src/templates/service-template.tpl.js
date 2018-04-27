import request from '../request';
import { notEmptyProps, throwIfAnyMissing } from '../helpers';
import endpoints from '../endpoints';
import RequestHeaders from '../headers';

${entityTypesText}

${methodsText}

export default {
    ${methodsNamesText}
};
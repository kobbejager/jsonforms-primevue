import { example as strings } from './strings';
import { example as numbers } from './numbers';
import { example as booleans } from './booleans';
import { example as dates } from './dates';
import { example as enums } from './enums';
import { example as enumArrays } from './enum-arrays';
import { example as arrays } from './arrays';
import { example as stringArrays } from './string-arrays';
import { example as objects } from './objects';
import { example as oneOf } from './one-of';

export const examples = [
    { 
        label: 'Strings',
        example: strings,
    },
    { 
        label: 'Numbers',
        example: numbers,
    },
    { 
        label: 'Booleans',
        example: booleans,
    },
    { 
        label: 'Dates',
        example: dates,
    },
    { 
        label: 'Enums',
        example: enums,
    },
    { 
        label: 'Arrays',
        example: arrays,
    },
    { 
        label: 'Arrays of strings',
        example: stringArrays,
    },
    { 
        label: 'Arrays of enums',
        example: enumArrays,
    },
    { 
        label: 'Objects',
        example: objects,
    },
    { 
        label: 'OneOf',
        example: oneOf,
    },
]
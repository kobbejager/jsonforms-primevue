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
        category: 'Primitives',
    },
    { 
        label: 'Numbers',
        example: numbers,
        category: 'Primitives',
    },
    { 
        label: 'Booleans',
        example: booleans,
        category: 'Primitives',
    },
    { 
        label: 'Dates',
        example: dates,
        category: 'Primitives',
    },
    { 
        label: 'Enums',
        example: enums,
        category: 'Primitives',
    },
    { 
        label: 'Arrays',
        example: arrays,
        category: 'Arrays & Objects',
    },
    { 
        label: 'Arrays of strings',
        example: stringArrays,
        category: 'Arrays & Objects',
    },
    { 
        label: 'Arrays of enums',
        example: enumArrays,
        category: 'Arrays & Objects',
    },
    { 
        label: 'Objects',
        example: objects,
        category: 'Arrays & Objects',
    },
    { 
        label: 'OneOf',
        example: oneOf,
        category: 'Combinators',
    },
]
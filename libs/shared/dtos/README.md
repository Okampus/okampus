# How do interfaces work?

Interfaces (\*.interface.ts) correspond to the types of the models defined in the BLL, which describe how entities are returned from the API.

By default, properties dependent on the persistance of entities (i.e. id, createdAt, entity props that are generated with defaults...) are optional; those types are only to be used while in the internal state of the BLL.

The type of models returned from the API should be wrapped with Typescript's Required<...>.

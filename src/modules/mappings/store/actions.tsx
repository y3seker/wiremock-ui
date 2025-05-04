import * as React from 'react'
import { action } from 'typesafe-actions'
import { IServer } from '../../servers'
import { IMapping } from '../types'
import { getMappingLabel } from '../dto'
import { MappingsActionTypes } from './types'

export interface ILoadServerMappingsAction {
    type: MappingsActionTypes.LOAD_SERVER_MAPPINGS
    payload: {
        serverName: string
        server: IServer
    }
}

export const loadServerMappings = (server: IServer): ILoadServerMappingsAction => action(
    MappingsActionTypes.LOAD_SERVER_MAPPINGS,
    {
        serverName: server.name,
        server,
    }
)

export interface ILoadServerMappingsRequestAction {
    type: MappingsActionTypes.LOAD_SERVER_MAPPINGS_REQUEST
    payload: {
        serverName: string
        server: IServer
    }
}

export const loadServerMappingsRequest = (server: IServer): ILoadServerMappingsRequestAction => action(
    MappingsActionTypes.LOAD_SERVER_MAPPINGS_REQUEST,
    {
        serverName: server.name,
        server,
    }
)

export interface ILoadServerMappingsSuccessAction {
    type: MappingsActionTypes.LOAD_SERVER_MAPPINGS_SUCCESS
    payload: {
        serverName: string
        server: IServer
        mappings: IMapping[]
    }
}

export const loadServerMappingsSuccess = (
    server: IServer,
    mappings: IMapping[]
): ILoadServerMappingsSuccessAction => action(
    MappingsActionTypes.LOAD_SERVER_MAPPINGS_SUCCESS,
    {
        serverName: server.name,
        server,
        mappings,
    }
)

export interface ILoadServerMappingsErrorAction {
    type: MappingsActionTypes.LOAD_SERVER_MAPPINGS_ERROR
    payload: {
        serverName: string
        server: IServer,
        errorMessage: string
    }
}

export const loadServerMappingsError = (
    server: IServer,
    errorMessage: string
): ILoadServerMappingsErrorAction => action(
    MappingsActionTypes.LOAD_SERVER_MAPPINGS_ERROR,
    {
        serverName: server.name,
        server,
        errorMessage
    },
    {
        notification: {
            type: 'danger',
            content: (
                <div>
                    mappings could not loaded
                    <div>{errorMessage}</div>
                </div>
            ),
            ttl: 2000,
        },
    }
)

export interface IFetchMappingRequestAction {
    type: MappingsActionTypes.FETCH_MAPPING_REQUEST
    payload: {
        serverName: string
        mappingId: string
    }
}

export const fetchMappingRequest = (
    serverName: string,
    mappingId: string
): IFetchMappingRequestAction => action(
    MappingsActionTypes.FETCH_MAPPING_REQUEST,
    {
        serverName,
        mappingId,
    }
)

export interface IFetchMappingSuccessAction {
    type: MappingsActionTypes.FETCH_MAPPING_SUCCESS
    payload: {
        serverName: string
        mappingId: string
        mapping: IMapping
    }
}

export const fetchMappingSuccess = (
    serverName: string,
    mappingId: string,
    mapping: IMapping
): IFetchMappingSuccessAction => action(
    MappingsActionTypes.FETCH_MAPPING_SUCCESS,
    {
        serverName,
        mappingId,
        mapping,
    }
)

export interface IFetchMappingErrorAction {
    type: MappingsActionTypes.FETCH_MAPPING_ERROR
    payload: {
        serverName: string
        mappingId: string
        errorMessage: string
    }
}

export const fetchMappingError = (
    serverName: string,
    mappingId: string,
    errorMessage: string
): IFetchMappingErrorAction => action(
    MappingsActionTypes.FETCH_MAPPING_ERROR,
    {
        serverName,
        mappingId,
        errorMessage
    }
)

export interface IInitMappingWorkingCopyAction {
    type: MappingsActionTypes.INIT_MAPPING_WORKING_COPY
    payload: {
        serverName: string
        mappingId: string
    }
}

export const initMappingWorkingCopy = (
    serverName: string,
    mappingId: string
): IInitMappingWorkingCopyAction => action(
    MappingsActionTypes.INIT_MAPPING_WORKING_COPY,
    {
        serverName,
        mappingId,
    }
)

export interface ISyncMappingWorkingCopyAction {
    type: MappingsActionTypes.SYNC_MAPPING_WORKING_COPY
    payload: {
        serverName: string
        mappingId: string
        update: IMapping
    }
}

export const syncMappingWorkingCopy = (
    serverName: string,
    mappingId: string,
    update: IMapping
): ISyncMappingWorkingCopyAction => action(
    MappingsActionTypes.SYNC_MAPPING_WORKING_COPY,
    {
        serverName,
        mappingId,
        update,
    }
)

export interface IUpdateMappingRequestAction {
    type: MappingsActionTypes.UPDATE_MAPPING_REQUEST
    payload: {
        serverName: string
        mappingId: string
        mapping: IMapping
    }
}

export const updateMappingRequest = (
    serverName: string,
    mappingId: string,
    mapping: IMapping
): IUpdateMappingRequestAction => action(
    MappingsActionTypes.UPDATE_MAPPING_REQUEST,
    {
        serverName,
        mappingId,
        mapping,
    }
)

export interface IUpdateMappingSuccessAction {
    type: MappingsActionTypes.UPDATE_MAPPING_SUCCESS
    payload: {
        serverName: string
        mappingId: string
        mapping: IMapping
    }
}

export interface IUpdateMappingErrorAction {
    type: MappingsActionTypes.UPDATE_MAPPING_ERROR
    payload: {
        serverName: string
        mappingId: string
        mapping: IMapping,
        errorMessage: string
    }
}

export const updateMappingSuccess = (
    serverName: string,
    mappingId: string,
    mapping: IMapping
): IUpdateMappingSuccessAction => action(
    MappingsActionTypes.UPDATE_MAPPING_SUCCESS,
    {
        serverName,
        mappingId,
        mapping,
    },
    {
        notification: {
            type: 'success',
            content: (
                <div>
                    mapping <strong>{getMappingLabel(mapping)}</strong> successfully saved
                </div>
            ),
            ttl: 2000,
        },
    }
)

export const updateMappingError = (
    serverName: string,
    mappingId: string,
    mapping: IMapping,
    errorMessage: string
): IUpdateMappingErrorAction => action(
    MappingsActionTypes.UPDATE_MAPPING_ERROR,
    {
        serverName,
        mappingId,
        mapping,
        errorMessage,
    },
    {
        notification: {
            type: 'danger',
            content: (
                <div>
                    mapping <strong>{getMappingLabel(mapping)}</strong> not saved.
                    <div>{errorMessage}</div>
                </div>
            ),
            ttl: 2000,
        },
    }
)

export interface IDeleteMappingRequestAction {
    type: MappingsActionTypes.DELETE_MAPPING_REQUEST
    payload: {
        serverName: string
        mappingId: string
    }
}

export const deleteMappingRequest = (
    serverName: string,
    mappingId: string
): IDeleteMappingRequestAction => action(
    MappingsActionTypes.DELETE_MAPPING_REQUEST,
    {
        serverName,
        mappingId,
    }
)

export interface IDeleteMappingSuccessAction {
    type: MappingsActionTypes.DELETE_MAPPING_SUCCESS
    payload: {
        serverName: string
        mappingId: string
    }
}

export const deleteMappingSuccess = (
    serverName: string,
    mappingId: string
): IDeleteMappingSuccessAction => action(
    MappingsActionTypes.DELETE_MAPPING_SUCCESS,
    {
        serverName,
        mappingId,
    },
    {
        notification: {
            type: 'success',
            content: (
                <div>
                    mapping successfully deleted
                </div>
            ),
            ttl: 2000,
        },
    }
)

export interface IDeleteMappingErrorAction {
    type: MappingsActionTypes.DELETE_MAPPING_ERROR
    payload: {
        serverName: string
        mappingId: string,
        errorMessage: string
    }
}

export const deleteMappingError = (
    serverName: string,
    mappingId: string,
    errorMessage: string
): IDeleteMappingErrorAction => action(
    MappingsActionTypes.DELETE_MAPPING_ERROR,
    {
        serverName,
        mappingId,
        errorMessage
    },
    {
        notification: {
            type: 'danger',
            content: (
                <div>
                    mapping is not deleted
                    <div>{errorMessage}</div>
                </div>
            ),
            ttl: 2000,
        },
    }
)

export interface IInitCreateMappingAction {
    type: MappingsActionTypes.INIT_CREATE_MAPPING
    payload: {
        serverName: string
        creationId: string
        mapping: IMapping
    }
}

export const initCreateMapping = (
    serverName: string,
    creationId: string
): IInitCreateMappingAction => action(
    MappingsActionTypes.INIT_CREATE_MAPPING,
    {
        serverName,
        creationId,
        mapping: {
            id: creationId,
            uuid: creationId,
            request: {
                method: 'GET' as 'GET',
            },
            response: {
                status: 200,
            },
            persistent: false,
            metadata: {
                folder: ''
            }
        }
    }
)

export interface ICreateMappingRequestAction {
    type: MappingsActionTypes.CREATE_MAPPING_REQUEST
    payload: {
        serverName: string
        creationId: string
        mapping: IMapping
    }
}

export const createMappingRequest = (
    serverName: string,
    creationId: string,
    mapping: IMapping
): ICreateMappingRequestAction => action(
    MappingsActionTypes.CREATE_MAPPING_REQUEST,
    {
        serverName,
        creationId,
        mapping,
    }
)

export interface ICreateMappingSuccessAction {
    type: MappingsActionTypes.CREATE_MAPPING_SUCCESS
    payload: {
        serverName: string
        mappingId: string
        creationId: string
        mapping: IMapping
    }
}

export const createMappingSuccess = (
    serverName: string,
    mappingId: string,
    creationId: string,
    mapping: IMapping
): ICreateMappingSuccessAction => action(
    MappingsActionTypes.CREATE_MAPPING_SUCCESS,
    {
        serverName,
        mappingId,
        creationId,
        mapping,
    },
    {
        notification: {
            type: 'success',
            content: (
                <div>
                    mapping <strong>{getMappingLabel(mapping)}</strong> successfully created
                </div>
            ),
            ttl: 2000,
        },
    }
)

export interface ICreateMappingErrorAction {
    type: MappingsActionTypes.CREATE_MAPPING_ERROR
    payload: {
        serverName: string
        mappingId: string
        creationId: string
        mapping: IMapping,
        errorMessage: string
    }
}

export const createMappingError = (
    serverName: string,
    mappingId: string,
    creationId: string,
    mapping: IMapping,
    errorMessage: string
): ICreateMappingErrorAction => action(
    MappingsActionTypes.CREATE_MAPPING_ERROR,
    {
        serverName,
        mappingId,
        creationId,
        mapping,
        errorMessage
    },
    {
        notification: {
            type: 'danger',
            content: (
                <div>
                    mapping <strong>{getMappingLabel(mapping)}</strong> is not created
                    <div>{errorMessage}</div>
                </div>
            ),
            ttl: 2000,
        },
    }
)

export interface ICancelMappingCreationAction {
    type: MappingsActionTypes.CANCEL_CREATE_MAPPING
    payload: {
        serverName: string
        creationId: string
    }
}

export const cancelMappingCreation = (
    serverName: string,
    creationId: string
): ICancelMappingCreationAction => action(
    MappingsActionTypes.CANCEL_CREATE_MAPPING,
    {
        serverName,
        creationId,
    }
)

export type MappingsAction =
    | ILoadServerMappingsAction
    | ILoadServerMappingsRequestAction
    | ILoadServerMappingsSuccessAction
    | ILoadServerMappingsErrorAction
    | IFetchMappingRequestAction
    | IFetchMappingSuccessAction
    | IFetchMappingErrorAction
    | IInitMappingWorkingCopyAction
    | ISyncMappingWorkingCopyAction
    | IUpdateMappingRequestAction
    | IUpdateMappingSuccessAction
    | IUpdateMappingErrorAction
    | IDeleteMappingRequestAction
    | IDeleteMappingSuccessAction
    | IDeleteMappingErrorAction
    | IInitCreateMappingAction
    | ICreateMappingRequestAction
    | ICreateMappingSuccessAction
    | ICreateMappingErrorAction
    | ICancelMappingCreationAction